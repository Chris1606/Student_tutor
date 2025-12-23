import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Clock, CheckCircle, XCircle, HelpCircle, Timer, BookOpen, PanelLeftClose, PanelLeftOpen, Bot } from 'lucide-react';
import { pageTransition } from '../../../constants/practiceConstants';
import LeftSidebar from '../../../components/layout/LeftSidebar';
import { MATH_TYPES } from './MathTypeChoosing';
import { DifficultyLevels } from './MathLevelChoosing';
import AIChatPanel from '../../../components/chat/AIChatPanel';
import { useApp } from '../../../context/AppContext';
import PracticePanel from '../../layout/PracticePanel';


// Mock questions for testing UI
const MOCK_QUESTIONS = [
  {
    id: '1',
    question: 'Solve the equation: 2x + 5 = 13',
    options: ['x = 4', 'x = 5', 'x = 6', 'x = 7'],
    correctAnswer: 'x = 4',
    explanation: 'To solve 2x + 5 = 13, subtract 5 from both sides: 2x = 8, then divide by 2: x = 4',
    type: 'multiple-choice',
    difficulty: 'easy'
  },
  {
    id: '2',
    question: 'What is the area of a circle with radius 3?',
    options: ['6π', '9π', '12π', '15π'],
    correctAnswer: '9π',
    explanation: 'The area of a circle is πr². With r = 3, area = π(3)² = 9π',
    type: 'multiple-choice',
    difficulty: 'easy'
  },
  // Add more mock questions as needed
];

const MathPracticeExercise: React.FC = () => {
  const navigate = useNavigate();
  const { typeId, levelId } = useParams<{ typeId: string; levelId: string }>();
  const { isPanelExpanded, togglePanelExpanded } = useApp();
  
  const selectedType = MATH_TYPES.find(type => type.id === typeId);
  const selectedLevel = DifficultyLevels.find(level => level.id === levelId);
  const Icon = selectedType?.icon;

  const [questions, setQuestions] = useState(MOCK_QUESTIONS);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [showHint, setShowHint] = useState(false);
  const [showAIChat, setShowAIChat] = useState(false);

  useEffect(() => {
    if (!selectedType || !selectedLevel) {
      navigate('/practice/math');
      return;
    }

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
    if (!selectedAnswer || isSubmitting) return;

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
            'Strong understanding of basic concepts',
            'Good problem-solving skills',
            'Quick calculations'
          ],
          weaknesses: [
            'Need more practice with complex problems',
            'Time management could improve',
            'Review fundamental concepts'
          ],
          recommendations: [
            'Practice more complex problems',
            'Focus on time management',
            'Review basic principles'
          ]
        }
      };
      localStorage.setItem('practiceSession', JSON.stringify(sessionData));
      
      // Navigate to session page
      navigate(`/practice/math/session/${Date.now()}`);
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
                onClick={() => navigate(`/practice/math/level/${typeId}`)}
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
                    ${selectedLevel?.id === 'beginner' ? 'text-green-600' :
                      selectedLevel?.id === 'intermediate' ? 'text-yellow-600' :
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
            />

            {/* Answer section */}
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
        <PracticePanel />
    </div>
  );
};

export default MathPracticeExercise; 