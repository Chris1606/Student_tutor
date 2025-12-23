import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { 
  BookOpen, User, Calendar, Tag, Bot, 
  UserPlus, GraduationCap, MessageSquare, ChevronLeft 
} from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface CourseDetailProps {
  course: any;
  onSelectMode: (mode: 'ai' | 'tutor' | 'practice' | 'students' | 'exercises' | 'aiTutorConversation' | 'learningPath') => void;
}

const CourseDetail: React.FC<CourseDetailProps> = ({ course, onSelectMode }) => {
  const navigate = useNavigate();
  const { isStudent, isTutor } = useApp();

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="relative p-10 mb-6 bg-gradient-to-r from-tutu-100 to-tutu-200 border-b border-border">
        <button 
          onClick={() => navigate('/courses')}
          className="absolute top-4 left-4 flex items-center gap-1 text-tutu-600 hover:text-tutu-800 transition-colors bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
        >
          <ChevronLeft size={16} />
          <span>Back</span>
        </button>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col items-center justify-center text-center max-w-2xl mx-auto"
        >
          <div className="p-4 bg-white rounded-full shadow-md mb-4">
            <BookOpen size={32} className="text-tutu-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
          <div className="flex items-center text-sm gap-4 mb-4">
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <Calendar size={14} />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm px-3 py-1 rounded-full">
              <User size={14} />
              <span>{course.enrolledCount} Học sinh</span>
            </div>
          </div>
          <p className="text-sm max-w-xl">{course.description}</p>
        </motion.div>
      </div>
      
      {/* Nội dung */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="lg:col-span-2"
        >
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 border-b pb-2">Thông tin khóa học</h2>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              
              {/* Thời lượng */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center 
                              hover:bg-[#E6F2FF] transition-colors">
                <div className="p-2 bg-white rounded-full mb-2">
                  <Calendar size={20} className="text-tutu-600" />
                </div>
                <span className="text-xs text-muted-foreground">Thời lượng</span>
                <span className="font-medium">{course.duration}</span>
              </div>

              {/* Học viên */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center 
                              hover:bg-[#E6F2FF] transition-colors">
                <div className="p-2 bg-white rounded-full mb-2">
                  <User size={20} className="text-tutu-600" />
                </div>
                <span className="text-xs text-muted-foreground">Học viên</span>
                <span className="font-medium">{course.enrolledCount}</span>
              </div>

              {/* Trình độ */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center 
                              hover:bg-[#E6F2FF] transition-colors">
                <div className="p-2 bg-white rounded-full mb-2">
                  <GraduationCap size={20} className="text-tutu-600" />
                </div>
                <span className="text-xs text-muted-foreground">Trình độ</span>
                <span className="font-medium">{course.level}</span>
              </div>

              {/* Ngôn ngữ */}
              <div className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center text-center 
                              hover:bg-[#E6F2FF] transition-colors">
                <div className="p-2 bg-white rounded-full mb-2">
                  <MessageSquare size={20} className="text-tutu-600" />
                </div>
                <span className="text-xs text-muted-foreground">Ngôn ngữ</span>
                <span className="font-medium">Tiếng Việt</span>
              </div>

            </div>
          </div>

          
          <div className="mb-8">
            <h2 className="text-xl font-medium mb-4 border-b pb-2">Giảng viên</h2>
            <motion.div 
              whileHover={{ scale: 1.02, }}
              className="flex items-center gap-4 p-6 bg-gray-50 rounded-lg border border-border"
            >
              <img 
                src={course.tutorAvatar} 
                alt={course.tutorName} 
                className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-md"
              />
              <div>
                <h3 className="font-medium text-lg">{course.tutorName}</h3>
                <p className="text-sm text-muted-foreground mb-2">{course.tutorInstitute}</p>
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={i < Math.floor(course.rating) ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-400">
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                    </svg>
                  ))}
                  <span className="text-sm ml-1">{course.rating.toFixed(1)}</span>
                </div>
              </div>
            </motion.div>
          </div>
          
        <div>
          <h2 className="text-xl font-medium mb-4 border-b pb-2">Nội dung </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {(course.learningOutcomes ?? ["Nội dung đang được cập nhật"]).map((item, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1), duration: 0.5 }}
                className="flex items-start gap-2"
              >
                <div className="mt-1 p-1 bg-tutu-100 rounded-full text-tutu-600">
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" 
                    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span>{item}</span>
              </motion.div>
            ))}
          </div>
</div>

        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="lg:col-span-1"
        >
          <div className="bg-white border border-border rounded-xl p-6 shadow-sm sticky top-6">
            <h2 className="text-xl font-medium mb-4 border-b pb-2">Bắt đầu học</h2>
            
            <div className="space-y-3">
              {isStudent && (
                <>
                   <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('learningPath')}
                    className="w-full bg-white border border-tutu-200 text-tutu-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-tutu-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} className="text-tutu-600" />
                      <span>Học theo bài Giảng</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('aiTutorConversation')}
                    className="w-full bg-white border border-tutu-200 text-tutu-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-tutu-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Bot size={18} className="text-tutu-600" />
                      <span>Học với gia sư AI</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>


                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('tutor')}
                    className="w-full bg-white border border-tutu-200 text-tutu-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-tutu-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus size={18} />
                      <span>Nhắn tin với giảng viên</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('practice')}
                    className="w-full bg-white border border-tutu-200 text-tutu-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-tutu-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus size={18} />
                      <span>Luyện tập - Practice Mode</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                </>
              )}
              
              {isTutor && (
                <>
                  <motion.button 
                    whileHover={{ scale: 1.02, backgroundColor: "rgba(251, 191, 36, 0.8)" }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('ai')}
                    className="w-full bg-tutu-600 text-black rounded-lg py-3 px-4 flex items-center justify-between gap-2 transition-all shadow-sm"
                  >
                    <div className="flex items-center gap-2">
                      <Bot size={18} />
                      <span>Conversation</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('aiTutorConversation')}
                    className="w-full bg-white border border-tutu-200 text-tutu-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-tutu-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <Bot size={18} className="text-tutu-600" />
                      <span>Check AI Tutor Conversation</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('students')}
                    className="w-full bg-white border border-border text-gray-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <UserPlus size={18} />
                      <span>Manage students</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                  
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onSelectMode('exercises')}
                    className="w-full bg-white border border-border text-gray-700 rounded-lg py-3 px-4 flex items-center justify-between gap-2 hover:bg-gray-50 transition-all"
                  >
                    <div className="flex items-center gap-2">
                      <GraduationCap size={18} />
                      <span>Manage exercises</span>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14M12 5l7 7-7 7"/>
                    </svg>
                  </motion.button>
                </>
              )}
            </div>
            
            <div className="mt-6">
              <h3 className="font-medium text-sm mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {course.tags.map((tag: string, index: number) => (
                  <motion.div 
                    key={index} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + (index * 0.1) }}
                    className="chip bg-gray-100 hover:bg-tutu-100 hover:text-tutu-600 transition-colors text-gray-700 cursor-pointer"
                  >
                    <Tag size={10} />
                    {tag}
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CourseDetail; 