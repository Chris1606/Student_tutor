import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, Bot, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { ExerciseTypes, DifficultyLevels, pageTransition } from '../constants/practiceConstants';
import LeftSidebar from '../components/layout/LeftSidebar';
import AIChatPanel from '../components/chat/AIChatPanel';
import { useApp } from '@/context/AppContext';
import RightPanel from '@/components/layout/PracticePanel';
const MOCK_QUESTIONS = [
  {
    id: '1',
    question: 'Minimize the following 4-variable K-map function: f(a,b,c,d)=Σm(0,1,5,6,7,11,12,14)+Σd(3,8,13)',
    correctAnswer: 'a\'d + b\'cd + abd\' + bcd\' + b\'c\'d\'',
    explanation: 'The minimized function can be obtained by grouping the 1s in the K-map. The largest group covers cells 0,1,2,4,5,6 which gives us A\' + B\'.',
    type: 'kmap',
    difficulty: 'hard',
    variables: 4,
    minterms: [0, 1, 5, 6, 7, 11, 12, 14],
    dontCares: [3, 8, 13]
  },
  {
    id: '2',
    question: 'Minimize the following 3-variable K-map function: f(a,b,c)=Σm(0,1)',
    correctAnswer: 'a\'b\'',
    explanation: 'The minimized function can be obtained by grouping the 1s in the K-map. The largest group covers cells 0,1,2,4,5,6 which gives us A\' + B\'.',
    type: 'kmap',
    difficulty: 'medium',
    variables: 3,
    minterms: [0, 1],
    dontCares: []
  },
  {
    id: '3',
    question: 'Minimize the following 4-variable K-map function: f(a,b,c,d)=Σm(1,3,5,7,9,11,13,15)',
    correctAnswer: 'd',
    explanation: 'The minimized function can be obtained by grouping all 1s in the K-map. Since all 1s are in the d=1 half of the map, the result is simply d.',
    type: 'kmap',
    difficulty: 'easy',
    variables: 4,
    minterms: [1, 3, 5, 7, 9, 11, 13, 15],
    dontCares: []
  },
  {
    id: '4',
    question: 'Minimize the following 3-variable K-map function: f(a,b,c)=Σm(0,2,4,6)',
    correctAnswer: 'c\'',
    explanation: 'The minimized function can be obtained by grouping all 1s in the K-map. Since all 1s are in the c=0 half of the map, the result is simply c\'.',
    type: 'kmap',
    difficulty: 'easy',
    variables: 3,
    minterms: [0, 2, 4, 6],
    dontCares: []
  },
  {
    id: '5',
    question: 'Minimize the following 4-variable K-map function: f(a,b,c,d)=Σm(0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15)',
    correctAnswer: '1',
    explanation: 'Since all minterms are 1s, the function is always true, resulting in a constant 1.',
    type: 'kmap',
    difficulty: 'medium',
    variables: 4,
    minterms: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
    dontCares: []
  }
];

const KmapExercise: React.FC = () => {
  const navigate = useNavigate();
  const { typeId, levelId } = useParams<{ typeId: string; levelId: string }>();
  const { isPanelExpanded, togglePanelExpanded } = useApp();
  
  const selectedType = ExerciseTypes.find(type => type.id === typeId);
  const selectedLevel = DifficultyLevels.find(level => level.id === levelId);
  const Icon = selectedType?.icon;

  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);
  const [showHint, setShowHint] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (!selectedType || !selectedLevel) {
      navigate('/practice');
      return;
    }

    setQuestions(MOCK_QUESTIONS);
    setElapsedTime(0);
    setIsTimerRunning(true);
  }, [selectedType, selectedLevel, navigate]);

  useEffect(() => {
    if (isTimerRunning) {
      const timer = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isTimerRunning]);

  const handleSubmitAnswer = async () => {
    if (!selectedAnswer || isSubmitting) return;

    setIsSubmitting(true);
    setIsTimerRunning(false);
    try {
      // For testing UI, simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isCorrect = selectedAnswer.toLowerCase().replace(/\s+/g, '') === 
                       questions[currentQuestionIndex].correctAnswer.toLowerCase().replace(/\s+/g, '');
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
      setShowAIChat(false);
      setElapsedTime(0);
      setIsTimerRunning(true);
    } else {
      // Store session data in localStorage
      const sessionData = {
        totalQuestions: questions.length,
        correctAnswers: questions.filter(q => q.correctAnswer === selectedAnswer).length,
        timeSpent: elapsedTime,
        questions: questions.map(q => ({
          ...q,
          userAnswer: selectedAnswer,
          isCorrect: q.correctAnswer === selectedAnswer
        }))
      };
      localStorage.setItem('kmapSession', JSON.stringify(sessionData));
      
      // Navigate to session page
      navigate(`/practice/session/${Date.now()}`);
    }
  };

  const handleAIAssistantClick = () => {
    setShowAIChat(true);
  };

  const currentQuestion = questions[currentQuestionIndex];

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
      {/* Left Sidebar */}
      <div className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 bg-white">
        <LeftSidebar />
      </div>
      
      {/* Main Content */}
      <motion.div 
        className="flex-1 bg-[#FFFBF0] overflow-auto min-h-screen"
        {...pageTransition}
      >
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Header */}
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
          </div>

          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock size={16} />
                <span>{elapsedTime}s</span>
              </div>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-yellow-600"
                initial={{ width: "0%" }}
                animate={{ width: `${(elapsedTime / 300) * 100}%` }}
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
                  <span className="text-sm font-medium text-red-600">
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
            />

            {/* Answer input */}
            {!showExplanation && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your minimized function:
                </label>
                <input
                  type="text"
                  value={selectedAnswer || ''}
                  onChange={(e) => setSelectedAnswer(e.target.value)}
                  placeholder="Example: a'd + b'cd + abd' + bcd' + b'c'd'"
                  className="w-full p-4 rounded-lg border border-gray-200 focus:border-yellow-200 focus:ring-2 focus:ring-yellow-100 outline-none"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Use lowercase letters and standard notation (a' for NOT a, + for OR, adjacent letters for AND)
                </p>
              </div>
            )}

            {/* Hint button */}
            {!showExplanation && (
              <button
                onClick={() => setShowHint(true)}
                className="mt-4 flex items-center gap-2 text-yellow-600 hover:text-yellow-700 transition-colors"
              >
                <HelpCircle size={16} />
                <span>Show hint</span>
              </button>
            )}

            {/* Hint display */}
            {showHint && (
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <p className="text-sm text-gray-600">
                  {currentQuestion.explanation}
                </p>
              </div>
            )}

            {/* Submit button */}
            {!showExplanation && (
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
                  <p className="text-gray-600">
                    Correct answer: {currentQuestion.correctAnswer}
                  </p>
                  <p className="mt-2 text-gray-600">{currentQuestion.explanation}</p>
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
                        setElapsedTime(0);
                        setIsTimerRunning(true);
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
      <RightPanel />
    </div>
  );
};

export default KmapExercise; 