import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, User, Calendar, Tag } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    tutorId: string;
    tutorName: string;
    tutorAvatar: string;
    enrolledStudents: number;
    rating: number;
    price: number;
    tags: string[];
    duration: string;
    level: string;
    enrolledCount: number;
  };
  onSelect: (course: any) => void;
  index: number;
}

const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, index }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="group bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer"
      onClick={() => onSelect(course)}
    >
      {/* Ảnh minh họa */}
      <div className="relative">
        <div className="h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://img.freepik.com/free-vector/abstract-technology-circuit-board-background_52683-25941.jpg')] bg-cover bg-center opacity-20"></div>
          <div className="relative bg-white/80 backdrop-blur-sm p-5 rounded-full shadow-lg">
            <BookOpen size={36} className="text-gray-700" />
          </div>
        </div>

        {/* Level (trung tính) */}
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-gray-200 text-gray-800 px-4 py-1 rounded-full text-sm font-medium shadow-md border border-white">
          {course.level}
        </div>
      </div>
      
      {/* Nội dung */}
      <div className="p-6 pt-8">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-bold text-lg text-gray-900">{course.title}</h3>
        </div>

        {/* Tutor */}
        <div className="text-xs text-gray-500 flex items-center gap-2 mb-3 bg-gray-100 px-3 py-1 rounded-full w-fit">
          <User size={12} />
          <span>{course.tutorName}</span>
        </div>
        
        {/* Mô tả */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {course.description}
        </p>
        
        {/* Duration + enrolled */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
            <Calendar size={12} />
            <span>{course.duration}</span>
          </div>
          
          <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full border border-gray-200">
            <User size={12} />
            <span>{course.enrolledCount} học viên</span>
          </div>
        </div>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {course.tags.slice(0, 3).map((tag, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 text-gray-700 border border-gray-200 px-2 py-1 rounded-full text-xs">
              <Tag size={10} />
              {tag}
            </div>
          ))}
        </div>
        
        {/* Rating + Giá */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-yellow-500">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg 
                key={i}
                xmlns="http://www.w3.org/2000/svg" width="14" height="14"
                viewBox="0 0 24 24"
                fill={i < Math.floor(course.rating) ? "currentColor" : "none"}
                stroke="currentColor" strokeWidth="2"
                strokeLinecap="round" strokeLinejoin="round"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 
                18.18 21.02 12 17.77 5.82 21.02 
                7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            ))}
            <span className="text-xs ml-1 text-gray-700">{course.rating.toFixed(1)}</span>
          </div>

          <div className="text-gray-900 font-bold">{course.price}₫</div>
        </div>
      </div>
      
      {/* 🔵 Chỉ phần này giữ màu xanh */}
      <div className="py-3 px-6 bg-gray-50 border-t border-gray-200">
        <motion.button 
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full py-2 px-4 bg-[#0078FF] text-white rounded-lg shadow-md hover:bg-[#005FCC] transition-all flex items-center justify-center gap-2"
        >
          <span>Bắt đầu</span>
          
        </motion.button>
      </div>
    </motion.div>
  );
};

export default CourseCard;
