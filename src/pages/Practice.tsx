import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { pageTransition } from '../constants/practiceConstants';

const Practice: React.FC = () => {
  const navigate = useNavigate();
  const { courseId } = useParams<{ courseId: string }>();
  const { currentCourse } = useApp();

  useEffect(() => {
    // Store course information in localStorage for use in practice
    if (currentCourse) {
      localStorage.setItem('practiceCourse', JSON.stringify(currentCourse));
    }
    
    // Redirect to practice type selection
    navigate('/practice');
  }, [navigate, currentCourse]);

  return (
    <motion.div 
      className="flex-1 h-full flex items-center justify-center bg-gray-50"
      {...pageTransition}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tutu-600"></div>
    </motion.div>
  );
};

export default Practice; 