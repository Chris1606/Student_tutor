import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, Timer, BookOpen, PanelLeftClose, PanelLeftOpen, Bot, MessageSquare, Lightbulb, Brain, ChevronUp } from 'lucide-react';
import { ExerciseTypes, DifficultyLevels, pageTransition } from '../constants/practiceConstants';
import { generatePracticeQuestions, submitPracticeAnswers, PracticeQuestion } from '../api/practiceService';
import LeftSidebar from '../components/layout/LeftSidebar';

import AIChatPanel from '../components/chat/AIChatPanel';
import { useApp } from '@/context/AppContext';
import DigitalLogicCanvas from '@/components/canvas/digital-logic/DigitalLogicCanvas';

// Mock questions for testing UI
const MOCK_QUESTIONS: PracticeQuestion[] = [
  {
    id: '1',
    question: 'What is the output of an AND gate when both inputs are 1?',
    options: ['0', '1', 'Undefined', 'Floating'],
    correctAnswer: '1',
    explanation: 'An AND gate outputs 1 (true) only when all inputs are 1 (true). This is a fundamental concept in digital logic.',
    type: 'multiple-choice',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'Design a 4-bit binary counter using D flip-flops. Draw the circuit diagram and explain its operation.',
    correctAnswer: 'Circuit diagram and explanation',
    explanation: 'A 4-bit counter requires 4 D flip-flops connected in series. The output of each flip-flop represents one bit of the counter. The clock input triggers the count sequence.',
    type: 'problem-solving',
    difficulty: 'medium',
    requiresDrawing: true,
    circuitType: 'counter'
  },
  {
    id: '3',
    question: 'Which of the following is a characteristic of sequential circuits?',
    options: [
      'Output depends only on current inputs',
      'Output depends on both current inputs and previous states',
      'Output is always combinational',
      'Output is independent of clock'
    ],
    correctAnswer: 'Output depends on both current inputs and previous states',
    explanation: 'Sequential circuits have memory elements that store previous states, making their outputs dependent on both current inputs and previous states.',
    type: 'multiple-choice',
    difficulty: 'medium'
  },
  {
    id: '4',
    question: 'Draw the waveform diagram for a clock signal with a frequency of 1MHz and a duty cycle of 50%.',
    correctAnswer: 'Waveform diagram',
    explanation: 'A 1MHz clock signal has a period of 1μs. With 50% duty cycle, the signal is high for 0.5μs and low for 0.5μs.',
    type: 'problem-solving',
    difficulty: 'easy',
    requiresDrawing: true
  },
  {
    id: '5',
    question: 'What is the maximum number of inputs a NAND gate can have?',
    options: ['2', '3', '4', 'Unlimited'],
    correctAnswer: 'Unlimited',
    explanation: 'A NAND gate can have any number of inputs, though practical implementations typically limit it to 8 inputs.',
    type: 'multiple-choice',
    difficulty: 'easy'
  },
  {
    id: '6',
    question: 'Design a 2-to-4 decoder using basic logic gates. Draw the circuit diagram and write the truth table.',
    correctAnswer: 'Decoder circuit and truth table',
    explanation: 'A 2-to-4 decoder has 2 inputs and 4 outputs. Each output represents a unique combination of the input bits.',
    type: 'problem-solving',
    difficulty: 'medium',
    requiresDrawing: true
  },
  {
    id: '7',
    question: 'In a JK flip-flop, what happens when both J and K inputs are 1?',
    options: [
      'Q remains unchanged',
      'Q toggles',
      'Q becomes 1',
      'Q becomes 0'
    ],
    correctAnswer: 'Q toggles',
    explanation: 'When J=K=1, the JK flip-flop toggles its output state on each clock pulse.',
    type: 'multiple-choice',
    difficulty: 'medium'
  },
  {
    id: '8',
    question: 'Draw the timing diagram for a D flip-flop with asynchronous reset. Show the clock, D input, reset, and Q output signals.',
    correctAnswer: 'Timing diagram',
    explanation: 'The timing diagram should show how the Q output responds to the D input on clock edges and how the reset signal overrides normal operation.',
    type: 'problem-solving',
    difficulty: 'hard',
    requiresDrawing: true
  },
  {
    id: '9',
    question: 'What is the minimum number of NAND gates required to implement an XOR gate?',
    options: ['2', '3', '4', '5'],
    correctAnswer: '4',
    explanation: 'An XOR gate can be implemented using 4 NAND gates. This is a common exercise in digital logic design.',
    type: 'multiple-choice',
    difficulty: 'hard'
  },
  {
    id: '10',
    question: 'Design a 3-bit synchronous counter with a count sequence of 0,1,2,3,4,5,6,7,0. Draw the circuit diagram using D flip-flops.',
    correctAnswer: 'Counter circuit diagram',
    explanation: 'A 3-bit synchronous counter requires 3 D flip-flops and combinational logic to generate the next state logic.',
    type: 'problem-solving',
    difficulty: 'hard',
    requiresDrawing: true
  }
];

const PracticeExercise: React.FC = () => {
  const navigate = useNavigate();
  const { typeId, levelId } = useParams<{ typeId: string; levelId: string }>();
  const { isPanelExpanded, togglePanelExpanded } = useApp();
  
  const selectedType = ExerciseTypes.find(type => type.id === typeId);
  const selectedLevel = DifficultyLevels.find(level => level.id === levelId);
  const Icon = selectedType?.icon;

  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(null);
  const [showAIAssistant, setShowAIAssistant] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{
    conceptExplanation: string;
    stepByStepGuide: string[];
    commonMistakes: string[];
    relatedConcepts: string[];
  } | null>(null);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    // Get course information from localStorage
    const storedCourse = localStorage.getItem('practiceCourse');
    if (storedCourse) {
      const course = JSON.parse(storedCourse);
      setCourseId(course.id);
    }

    if (!selectedType || !selectedLevel) {
      navigate('/practice');
      return;
    }

    // Set mock questions for testing
    setQuestions(MOCK_QUESTIONS);
    setTimeLeft(selectedLevel.timeLimit || 60);
  }, [selectedType, selectedLevel, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting || !courseId) return;

    setIsSubmitting(true);
    try {
      // For testing UI, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isCorrect = selectedAnswer === questions[currentQuestionIndex].correctAnswer;
      setIsAnswerCorrect(isCorrect);
      setShowExplanation(true);
    } catch (error) {
      console.error('Failed to submit answer:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setShowHint(false);
      setShowAIAssistant(false);
      setShowAIChat(false);
      setTimeLeft(selectedLevel?.timeLimit || 60);
    } else {
      // Store session data in localStorage
      const sessionData = {
        totalQuestions: questions.length,
        correctAnswers: questions.filter(q => q.correctAnswer === selectedAnswer).length,
        timeSpent: selectedLevel?.timeLimit * questions.length - timeLeft,
        questions: questions.map(q => ({
          ...q,
          userAnswer: selectedAnswer,
          isCorrect: q.correctAnswer === selectedAnswer
        })),
        analysis: {
          strengths: [
            'Strong understanding of basic logic gates',
            'Good grasp of sequential circuits',
            'Excellent problem-solving skills'
          ],
          weaknesses: [
            'Need more practice with complex timing diagrams',
            'Could improve in state machine design',
            'Some confusion with asynchronous circuits'
          ],
          recommendations: [
            'Practice more timing diagram exercises',
            'Review state machine design principles',
            'Focus on asynchronous circuit concepts'
          ]
        }
      };
      localStorage.setItem('practiceSession', JSON.stringify(sessionData));
      
      // Navigate to session page
      navigate(`/practice/session/${Date.now()}`);
    }
  };

  const handleAIAssistantClick = () => {
    setShowAIChat(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

  // Render answer section based on question type
  const renderAnswerSection = () => {
    if (currentQuestion.requiresDrawing) {
      return (
        <div className="mt-6">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h3 className="font-medium text-gray-700">Vẽ mạch logic</h3>
              <p className="text-sm text-gray-500 mt-1">
                Sử dụng các công cụ bên trái để vẽ mạch logic theo yêu cầu.
                Kéo thả các cổng logic và kết nối chúng lại với nhau.
              </p>
            </div>
            <div className="h-[400px] relative">
              <DigitalLogicCanvas 
                type={currentQuestion.circuitType || 'counter'}
                onSubmit={(isValid) => {
                  setSelectedAnswer('submitted');
                  setIsAnswerCorrect(isValid);
                  setShowExplanation(true);
                }}
              />
            </div>
          </div>
        </div>
      );
    }

    if (currentQuestion.options) {
      return (
        <div className="space-y-3 mt-6">
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showExplanation && setSelectedAnswer(option)}
              className={`w-full p-4 rounded-lg border transition-colors text-left
                ${selectedAnswer === option
                  ? showExplanation
                    ? isAnswerCorrect
                      ? 'bg-green-50 border-green-200'
                      : 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200 hover:border-yellow-200'}`}
              disabled={showExplanation}
            >
              {option}
            </button>
          ))}
        </div>
      );
    }

    return (
      <div className="mt-6">
        <textarea
          value={selectedAnswer as string || ''}
          onChange={(e) => !showExplanation && setSelectedAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-4 rounded-lg border border-gray-200 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-100 outline-none"
          rows={4}
          disabled={showExplanation}
        />
      </div>
    );
  };

  if (!currentQuestion) {
    return (
      <div className="flex min-h-screen">
        <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white">
          <LeftSidebar />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar - Fixed width on desktop, hidden on mobile */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <LeftSidebar />
      </div>
      
      {/* Main Content - Full width on mobile, adjusted on desktop */}
      <motion.div 
        className="flex-1 bg-[#FFFBF0] overflow-auto min-h-screen"
        {...pageTransition}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header with back button and course info */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/practice/level/${typeId}`)}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Levels</span>
              </button>
              <button
                onClick={togglePanelExpanded}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                title={isPanelExpanded ? "Hide tools" : "Show tools"}
              >
                {isPanelExpanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Course: {JSON.parse(localStorage.getItem('practiceCourse') || '{}').title || 'N/A'}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{timeLeft}s</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-600"
                initial={{ width: "100%" }}
                animate={{ width: `${(timeLeft / (selectedLevel?.timeLimit || 1)) * 100}%` }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>

          {/* Question card */}
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Icon className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {currentQuestion.question}
                  </h2>
                  <span className={`text-sm font-medium
                    ${selectedLevel?.id === 'easy' ? 'text-green-600' :
                      selectedLevel?.id === 'medium' ? 'text-yellow-600' :
                      'text-red-600'}`}
                  >
                    {selectedLevel?.name} Level
                  </span>
                </div>
              </div>
              <button
                onClick={handleAIAssistantClick}
                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                title="Get AI assistance"
              >
                <Bot size={18} />
                <span>AI Assistant</span>
              </button>
            </div>

            {/* AI Chat Panel */}
            <AIChatPanel
              isVisible={showAIChat}
              onClose={() => setShowAIChat(false)}
              question={currentQuestion.question}
              currentTopic={selectedType?.name}
              difficulty={selectedLevel?.name}
              type={currentQuestion.type}
              explanation={currentQuestion.explanation}
              circuitType={currentQuestion.circuitType}
            />

            {/* Answer section */}
            {renderAnswerSection()}

            {/* Hint button - Ẩn khi đang vẽ mạch */}
            {!showExplanation && !currentQuestion.requiresDrawing && (
              <button
                onClick={() => setShowHint(true)}
                className="mt-4 flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                <HelpCircle size={16} />
                <span>Show hint</span>
              </button>
            )}

            {/* Hint display */}
            {showHint && !currentQuestion.requiresDrawing && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Submit button - Ẩn khi đang vẽ mạch */}
            {!showExplanation && !currentQuestion.requiresDrawing && (
              <button
                onClick={handleSubmitAnswer}
                disabled={!selectedAnswer || isSubmitting}
                className="mt-6 w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Answer'}
              </button>
            )}

            {/* Explanation */}
            {showExplanation && (
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-4">
                  {isAnswerCorrect ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500" />
                  )}
                  <h3 className="text-lg font-medium">
                    {isAnswerCorrect ? 'Correct!' : 'Incorrect'}
                  </h3>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-600">{currentQuestion.explanation}</p>
                </div>
                <div className="mt-6 space-y-4">
                  <button
                    onClick={handleNextQuestion}
                    className="w-full py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                  >
                    {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Practice'}
                  </button>
                  {!isAnswerCorrect && (
                    <button
                      onClick={() => {
                        setSelectedAnswer(null);
                        setShowExplanation(false);
                        setShowHint(false);
                        setTimeLeft(selectedLevel?.timeLimit || 60);
                      }}
                      className="w-full py-3 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors flex items-center justify-center gap-2"
                    >
                      <HelpCircle size={18} />
                      <span>Try This Question Again</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Right Panel */}
      
    </div>
  );
};

export default PracticeExercise; 