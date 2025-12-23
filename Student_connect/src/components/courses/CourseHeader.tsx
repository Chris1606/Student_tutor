import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const CourseHeader: React.FC = () => {
  return (
    <div className="relative mb-12 overflow-hidden explore-header">
      {/* Background layers */}
      <div className="absolute inset-0 bg-[#E6F2FF] opacity-60"></div>
      <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-[#CCE5FF] rounded-full opacity-50 blur-3xl"></div>
      <div className="absolute -top-16 -left-16 w-48 h-48 bg-[#99CCFF] rounded-full opacity-40 blur-2xl"></div>
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 py-10 px-8 rounded-xl"
      >
        <div className="max-w-2xl mx-auto text-center">
          
          {/* Icon container */}
          <div className="w-16 h-16 bg-[#0078FF] rounded-full flex items-center justify-center mx-auto mb-4 shadow-xl shadow-[#CCE5FF]/40 pulse-btn">
            <BookOpen size={30} className="text-white" />
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold mb-3 text-[#0A2540]">
            Khám phá các khóa học
          </h1>

          {/* Underline */}
          <div className="w-24 h-1 bg-[#0078FF] mx-auto mb-4"></div>

          {/* Subtitle */}
          <p className="text-[#0A2540]/70 text-lg max-w-lg mx-auto">
            Học tập hiệu quả với các khóa học được hỗ trợ bởi AI Tutor.
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CourseHeader;
