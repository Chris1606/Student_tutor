import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { ExerciseTypes, pageTransition } from '../constants/practiceConstants';
import LeftSidebar from '../components/layout/LeftSidebar';

const TypeChoosing: React.FC = () => {
  const navigate = useNavigate();

  const handleTypeSelect = (typeId: string) => {
    navigate(`/practice/level/${typeId}`);
  };

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
          {/* Back buttons */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex gap-4">
              <button
                onClick={() => {
                  const courseData = localStorage.getItem('practiceCourse');
                  if (courseData) {
                    const course = JSON.parse(courseData);
                    navigate(`/courses/${course.id}`);
                  }
                }}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft size={20} />
                <span>Back to Course</span>
              </button>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                Course: {JSON.parse(localStorage.getItem('practiceCourse') || '{}').title || 'N/A'}
              </span>
            </div>
          </div>

          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Choose Your Practice Type
            </h1>
            <p className="text-lg text-gray-600">
              Select the type of exercises you want to practice
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ExerciseTypes.map((type) => {
              const Icon = type.icon;
              return (
                <motion.div
                  key={type.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleTypeSelect(type.id)}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon className="w-6 h-6 text-yellow-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {type.name}
                    </h2>
                  </div>
                  <p className="text-gray-600 mb-4">
                    {type.description}
                  </p>
                  <div className="space-y-2">
                    {type.examples.map((example, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-500">
                        <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full" />
                        {example}
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default TypeChoosing;