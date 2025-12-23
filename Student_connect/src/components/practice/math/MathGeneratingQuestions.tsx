import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bot, Sparkles, Brain, Zap, ArrowLeft } from 'lucide-react';
import { pageTransition } from '../../../constants/practiceConstants';
import LeftSidebar from '../../../components/layout/LeftSidebar';
import { MATH_TYPES } from './MathTypeChoosing';
import { DifficultyLevels } from './MathLevelChoosing';

const MathGeneratingQuestions: React.FC = () => {
  const navigate = useNavigate();
  const { typeId, levelId } = useParams<{ typeId: string; levelId: string }>();
  
  const selectedType = MATH_TYPES.find(type => type.id === typeId);
  const selectedLevel = DifficultyLevels.find(level => level.id === levelId);

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(`/practice/math/exercise/${typeId}/${levelId}`);
    }, 6000); // Redirect after 6 seconds

    return () => clearTimeout(timer);
  }, [navigate, typeId, levelId]);

  if (!selectedType || !selectedLevel) {
    navigate('/practice/math');
    return null;
  }

  const Icon = selectedType.icon;

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
          {/* Back button and course info */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(`/practice/math/level/${typeId}`)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Levels</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Course: {JSON.parse(localStorage.getItem('practiceCourse') || '{}').title || 'N/A'}
              </span>
            </div>
          </div>

          {/* Generating animation */}
          <div className="text-center max-w-2xl mx-auto">
            <div className="relative mb-8">
              <motion.div
                className="w-32 h-32 mx-auto bg-yellow-100 rounded-full flex items-center justify-center"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Icon className="w-16 h-16 text-yellow-600" />
              </motion.div>
              
              {/* Animated particles */}
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-4 h-4 bg-yellow-200 rounded-full"
                  style={{
                    top: '50%',
                    left: '50%',
                    x: '-50%',
                    y: '-50%',
                  }}
                  animate={{
                    x: [
                      `${Math.cos(2 * Math.PI * i / 8) * 100}%`,
                      `${Math.cos(2 * Math.PI * i / 8) * 120}%`,
                      `${Math.cos(2 * Math.PI * i / 8) * 100}%`,
                    ],
                    y: [
                      `${Math.sin(2 * Math.PI * i / 8) * 100}%`,
                      `${Math.sin(2 * Math.PI * i / 8) * 120}%`,
                      `${Math.sin(2 * Math.PI * i / 8) * 100}%`,
                    ],
                    opacity: [0.2, 0.8, 0.2],
                    scale: [0.8, 1.2, 0.8],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.2,
                  }}
                />
              ))}
            </div>

            <motion.h2
              className="text-2xl font-bold text-gray-900 mb-4"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              AI is Generating Your Questions
            </motion.h2>

            <div className="space-y-4 mb-8">
              <motion.div
                className="flex items-center justify-center gap-2 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Bot className="w-5 h-5" />
                <span>Analyzing course content</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-2 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 }}
              >
                <Brain className="w-5 h-5" />
                <span>Creating {selectedLevel.name} level questions</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-2 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.5 }}
              >
                <Sparkles className="w-5 h-5" />
                <span>Adding helpful hints and explanations</span>
              </motion.div>

              <motion.div
                className="flex items-center justify-center gap-2 text-gray-600"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
              >
                <Zap className="w-5 h-5" />
                <span>Optimizing question difficulty</span>
              </motion.div>
            </div>

            <motion.div
              className="w-full max-w-xs mx-auto h-2 bg-gray-200 rounded-full overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-yellow-600"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 8, ease: "linear" }}
              />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default MathGeneratingQuestions; 