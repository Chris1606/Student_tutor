import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ExerciseTypes, DifficultyLevels, pageTransition } from '../constants/practiceConstants';
import LeftSidebar from '../components/layout/LeftSidebar';

const LevelChoosing: React.FC = () => {
  const navigate = useNavigate();
  const { typeId } = useParams<{ typeId: string }>();
  
  const selectedType = ExerciseTypes.find(type => type.id === typeId);

  const handleLevelSelect = (levelId: string) => {
    navigate(`/practice/generating/${typeId}/${levelId}`);
  };

  if (!selectedType) {
    navigate('/practice');
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
              onClick={() => navigate('/practice')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Back to Types</span>
            </button>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Course: {JSON.parse(localStorage.getItem('practiceCourse') || '{}').title || 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Icon className="w-6 h-6 text-yellow-600" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900">
                Choose Difficulty Level
              </h1>
            </div>
            <p className="text-lg text-gray-600">
              Select the difficulty level for your {selectedType.name} practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DifficultyLevels.map((level) => (
              <motion.div
                key={level.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleLevelSelect(level.id)}
              >
                <h2 className="text-xl font-semibold text-gray-900 mb-2">
                  {level.name}
                </h2>
                <p className="text-gray-600 mb-4">
                  {level.description}
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    {level.recommendedFor}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    {level.questionsCount} questions
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                    {level.timeLimit} seconds per question
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LevelChoosing;