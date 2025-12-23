import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Clock, Brain, Target, TrendingUp, BookOpen } from 'lucide-react';
import { ExerciseTypes, DifficultyLevels, pageTransition } from '../constants/practiceConstants';
import LeftSidebar from '../components/layout/LeftSidebar';

interface SessionResult {
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  questions: {
    id: string;
    question: string;
    type: 'multiple-choice' | 'problem-solving' | 'challenge';
    difficulty: 'easy' | 'medium' | 'hard';
    userAnswer: string | number;
    correctAnswer: string | number;
    explanation: string;
    isCorrect: boolean;
  }[];
  analysis: {
    strengths: string[];
    weaknesses: string[];
    recommendations: string[];
  };
}

// Mock data for testing
const MOCK_SESSION_RESULT: SessionResult = {
  totalQuestions: 10,
  correctAnswers: 7,
  timeSpent: 1200, // in seconds
  questions: [
    {
      id: '1',
      question: 'What is the output of an AND gate when both inputs are 1?',
      type: 'multiple-choice',
      difficulty: 'easy',
      userAnswer: '1',
      correctAnswer: '1',
      explanation: 'An AND gate outputs 1 (true) only when all inputs are 1 (true).',
      isCorrect: true
    },
    {
      id: '2',
      question: 'Design a 4-bit binary counter using D flip-flops.',
      type: 'problem-solving',
      difficulty: 'medium',
      userAnswer: 'Circuit diagram and explanation',
      correctAnswer: 'Circuit diagram and explanation',
      explanation: 'A 4-bit counter requires 4 D flip-flops connected in series.',
      isCorrect: true
    },
    {
      id: '3',
      question: 'What is the truth table for a NAND gate?',
      type: 'multiple-choice',
      difficulty: 'easy',
      userAnswer: '0,0,0,1',
      correctAnswer: '1,1,1,0',
      explanation: 'A NAND gate outputs 0 only when all inputs are 1, otherwise it outputs 1.',
      isCorrect: false
    },
    {
      id: '4',
      question: 'Explain the concept of setup time and hold time in flip-flops.',
      type: 'problem-solving',
      difficulty: 'hard',
      userAnswer: 'Setup time is the minimum time before clock edge...',
      correctAnswer: 'Setup time is the minimum time before clock edge...',
      explanation: 'Setup time ensures data is stable before clock edge, hold time ensures data remains stable after clock edge.',
      isCorrect: true
    },
    {
      id: '5',
      question: 'What is the maximum frequency of a clock signal with a period of 10ns?',
      type: 'multiple-choice',
      difficulty: 'medium',
      userAnswer: '100MHz',
      correctAnswer: '100MHz',
      explanation: 'Frequency = 1/Period = 1/(10ns) = 100MHz',
      isCorrect: true
    },
    {
      id: '6',
      question: 'Design a 3-to-8 decoder using basic logic gates.',
      type: 'problem-solving',
      difficulty: 'medium',
      userAnswer: 'Circuit diagram with 3 inputs and 8 outputs',
      correctAnswer: 'Circuit diagram with 3 inputs and 8 outputs',
      explanation: 'A 3-to-8 decoder uses 3 input lines to select one of 8 output lines.',
      isCorrect: true
    },
    {
      id: '7',
      question: 'What is the propagation delay of a CMOS inverter?',
      type: 'multiple-choice',
      difficulty: 'hard',
      userAnswer: '10ps',
      correctAnswer: '20ps',
      explanation: 'Typical propagation delay for a CMOS inverter is around 20ps.',
      isCorrect: false
    },
    {
      id: '8',
      question: 'Explain the working principle of a D-latch.',
      type: 'problem-solving',
      difficulty: 'medium',
      userAnswer: 'A D-latch is transparent when enable is high...',
      correctAnswer: 'A D-latch is transparent when enable is high...',
      explanation: 'A D-latch passes input to output when enable is high, holds value when enable is low.',
      isCorrect: true
    },
    {
      id: '9',
      question: 'What is the power consumption of a CMOS circuit?',
      type: 'multiple-choice',
      difficulty: 'hard',
      userAnswer: 'Static power only',
      correctAnswer: 'Both static and dynamic power',
      explanation: 'CMOS circuits consume both static (leakage) and dynamic (switching) power.',
      isCorrect: false
    },
    {
      id: '10',
      question: 'Design a 2-bit full adder using half adders.',
      type: 'problem-solving',
      difficulty: 'hard',
      userAnswer: 'Circuit diagram with 2 half adders and OR gate',
      correctAnswer: 'Circuit diagram with 2 half adders and OR gate',
      explanation: 'A 2-bit full adder can be constructed using two half adders and an OR gate.',
      isCorrect: true
    }
  ],
  analysis: {
    strengths: [
      'Strong understanding of basic logic gates',
      'Good grasp of sequential circuits',
      'Excellent problem-solving skills',
      'Solid knowledge of combinational circuits'
    ],
    weaknesses: [
      'Need more practice with complex timing diagrams',
      'Could improve in state machine design',
      'Some confusion with asynchronous circuits',
      'Power consumption concepts need review'
    ],
    recommendations: [
      'Practice more timing diagram exercises',
      'Review state machine design principles',
      'Focus on asynchronous circuit concepts',
      'Study power consumption in digital circuits'
    ]
  }
};

const Session: React.FC = () => {
  const navigate = useNavigate();
  const { sessionId } = useParams<{ sessionId: string }>();
  
  // Get session data from localStorage
  const storedSession = localStorage.getItem('practiceSession');
  const sessionResult = storedSession ? JSON.parse(storedSession) : MOCK_SESSION_RESULT;

  // Add state for current question index
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(0);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Clear session data when leaving the page
  useEffect(() => {
    return () => {
      localStorage.removeItem('practiceSession');
    };
  }, []);

  // Navigation functions
  const handleNext = () => {
    if (currentQuestionIndex < sessionResult.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Get current question
  const currentQuestion = sessionResult.questions[currentQuestionIndex];

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
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Practice</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Course: {JSON.parse(localStorage.getItem('practiceCourse') || '{}').title || 'N/A'}
              </span>
            </div>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Results and Overview */}
            <div className="space-y-8">
              {/* Session Overview */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Practice Session Results</h1>
                
                <div className="grid grid-cols-1 gap-6">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-green-600 mb-2">
                      <CheckCircle size={20} />
                      <span className="font-medium">Correct Answers</span>
                    </div>
                    <div className="text-2xl font-bold text-green-700">
                      {sessionResult.correctAnswers}/{sessionResult.totalQuestions}
                    </div>
                    <div className="text-sm text-green-600">
                      {((sessionResult.correctAnswers / sessionResult.totalQuestions) * 100).toFixed(1)}% accuracy
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-600 mb-2">
                      <Clock size={20} />
                      <span className="font-medium">Time Spent</span>
                    </div>
                    <div className="text-2xl font-bold text-blue-700">
                      {formatTime(sessionResult.timeSpent)}
                    </div>
                    <div className="text-sm text-blue-600">
                      Average: {formatTime(sessionResult.timeSpent / sessionResult.totalQuestions)} per question
                    </div>
                  </div>

                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-600 mb-2">
                      <Target size={20} />
                      <span className="font-medium">Performance</span>
                    </div>
                    <div className="text-2xl font-bold text-yellow-700">
                      {sessionResult.correctAnswers >= 8 ? 'Excellent' : 
                       sessionResult.correctAnswers >= 6 ? 'Good' : 
                       sessionResult.correctAnswers >= 4 ? 'Fair' : 'Needs Improvement'}
                    </div>
                    <div className="text-sm text-yellow-600">
                      Based on accuracy and time
                    </div>
                  </div>
                </div>
              </div>

              {/* Analysis Section */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Performance Analysis</h2>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center gap-2 text-green-600 mb-3">
                      <Brain size={20} />
                      <span className="font-medium">Strengths</span>
                    </div>
                    <ul className="space-y-2">
                      {sessionResult.analysis.strengths.map((strength, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                          <span>{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-red-600 mb-3">
                      <TrendingUp size={20} />
                      <span className="font-medium">Areas for Improvement</span>
                    </div>
                    <ul className="space-y-2">
                      {sessionResult.analysis.weaknesses.map((weakness, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <XCircle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                          <span>{weakness}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 text-blue-600 mb-3">
                      <BookOpen size={20} />
                      <span className="font-medium">Recommendations</span>
                    </div>
                    <ul className="space-y-2">
                      {sessionResult.analysis.recommendations.map((rec, index) => (
                        <li key={index} className="text-gray-600 flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Questions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Question Details</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">
                    Question {currentQuestionIndex + 1} of {sessionResult.questions.length}
                  </span>
                </div>
              </div>
              
              {currentQuestion && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-500">Question {currentQuestionIndex + 1}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium
                          ${currentQuestion.difficulty === 'easy' ? 'bg-green-100 text-green-700' :
                            currentQuestion.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'}`}
                        >
                          {currentQuestion.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {currentQuestion.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <p className="text-gray-900 mb-4">{currentQuestion.question}</p>

                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Your Answer</div>
                        <div className="p-3 bg-gray-50 rounded-lg text-gray-700">
                          {currentQuestion.userAnswer}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-500 mb-2">Correct Answer</div>
                        <div className="p-3 bg-green-50 rounded-lg text-green-700">
                          {currentQuestion.correctAnswer}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4">
                      <div className="text-sm font-medium text-gray-500 mb-2">Explanation</div>
                      <div className="p-3 bg-blue-50 rounded-lg text-gray-700">
                        {currentQuestion.explanation}
                      </div>
                    </div>
                  </div>

                  {/* Navigation Controls */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <button
                      onClick={handleBack}
                      disabled={currentQuestionIndex === 0}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${currentQuestionIndex === 0 
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      <ArrowLeft size={20} />
                      <span>Previous</span>
                    </button>
                    <button
                      onClick={handleNext}
                      disabled={currentQuestionIndex === sessionResult.questions.length - 1}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors
                        ${currentQuestionIndex === sessionResult.questions.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
                    >
                      <span>Next</span>
                      <ArrowLeft size={20} className="rotate-180" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Session; 