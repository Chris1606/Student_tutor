import React, { useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { BookOpen, Star, Trophy, BarChart3, Clock, Calendar, ArrowRight, Bot, Users, Activity, MessageSquare, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import AICompanion from '@/components/ai/AICompanion';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { setActiveSection, user, isStudent, isTutor } = useApp();

  useEffect(() => {
    setActiveSection('home');
  }, [setActiveSection]);

  // Hiển thị giao diện student hoặc tutor dựa theo role
  return isStudent ? <StudentHome /> : <TutorHome />;
};

// Animation variants for elements
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: 'easeOut'
    }
  })
};

// Trang Home cho student
const StudentHome: React.FC = () => {
  const { user } = useApp();

  // Dữ liệu mẫu cho tiến độ học tập của student
  const learningProgress = [
    // { courseId: '1', courseName: 'Digital Electronics', progress: 65, lastAccess: '2 days ago' },
    // { courseId: '2', courseName: 'Integrated Circuit Design', progress: 30, lastAccess: '1 week ago' },
    // { courseId: '3', courseName: 'Digital Signal Processing', progress: 10, lastAccess: 'Today' },
    // { courseId: '4', courseName: 'Microprocessor Systems', progress: 45, lastAccess: '3 days ago' },
    // { courseId: '5', courseName: 'Computer Architecture', progress: 80, lastAccess: 'Yesterday' },
      { courseId: '1', courseName: 'Toán – Hình học không gian', progress: 65, lastAccess: '2 ngày trước' },
      { courseId: '2', courseName: 'Vật lý – Chuyên đề Điện xoay chiều', progress: 30, lastAccess: '1 tuần trước' },
      { courseId: '3', courseName: 'Hóa học – Phản ứng Oxi hóa – Khử', progress: 10, lastAccess: 'Hôm nay' },
      { courseId: '4', courseName: 'Ngữ văn – Phân tích tác phẩm văn học hiện đại', progress: 45, lastAccess: '3 ngày trước' },
      { courseId: '5', courseName: 'Sinh học – Di truyền học & Biến dị', progress: 80, lastAccess: 'Hôm qua' }
 
  ];

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Welcome section with personalized greeting */}
      <motion.div 
        className="mb-8 bg-gradient-to-r from-tutu-50 to-white p-6 rounded-xl border border-[#CCE5FF]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Xin chào, {user?.name || 'Student'}! 👋</h1>
        {/* <p className="text-gray-600 mt-2">Welcome back to your learning dashboard. Here's your progress overview.</p> */}
        <p className="text-gray-600 mt-2">Chào mừng bạn quay lại bảng điều khiển học tập. Dưới đây là tổng quan tiến độ của bạn.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content - 8 columns on large screens */}
        <div className="lg:col-span-8 space-y-6">
          {/* Stats cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-3 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div 
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={0}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Khóa học</h3>
                <BookOpen className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">{learningProgress.length}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={1}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Thành tựu</h3>
                <Trophy className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">3</p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={2}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Đánh giá trung bình</h3>
                <Star className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">4.6</p>
            </motion.div>
          </motion.div>

          {/* Learning progress section */}
          <motion.div 
            className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-5 border-b border-border flex justify-between items-center">
              <h2 className="font-medium flex items-center">
                <BarChart3 size={18} className="mr-2 text-[#0078FF]" />
                Learning Progress
              </h2>
              <Link to="/courses" className="text-sm text-[#0078FF] hover:underline flex items-center">
                Xem tất cả khóa học<ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
            <div className="p-5">
              <motion.div 
                className="space-y-5"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                  }
                }}
              >
                {learningProgress.map((course, index) => (
                  <motion.div 
                    key={course.courseId} 
                    className="border border-border rounded-lg p-5 hover:border-[#0078FF] transition-colors"
                    custom={index}
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold tracking-tight text-gray-800">{course.courseName}</h3>
                      <p className="text-xs text-gray-500 flex items-center">
                        <Clock size={12} className="mr-1" />
                        {course.lastAccess}
                      </p>
                    </div>
                    {/* Progress bar with light yellow background and yellow-amber fill */}
                   <div className="w-full bg-[#E6F2FF] rounded-full h-3 mb-3">
                      <motion.div 
                        className="bg-[#0078FF] h-3 rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${course.progress}%` }}
                        transition={{ delay: 0.5 + (index * 0.1), duration: 0.8, ease: "easeOut" }}
                      ></motion.div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">{course.progress}% completed</span>
                      <Link 
                        to={`/courses/${course.courseId}`} 
                        className="px-4 py-2 bg-[#0078FF] hover:bg-[#005FCC] text-white rounded-lg text-sm font-medium transition-colors flex items-center"                      >
                        Tiếp tục 
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Upcoming schedule section */}
          <motion.div 
            className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="p-5 border-b border-border">
              <h2 className="font-medium flex items-center">
                <Calendar size={18} className="mr-2 text-[#0078FF]" />
                Lịch 
              </h2>
            </div>
            <div className="p-5">
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.2, delayChildren: 0.7 }
                  }
                }}
              >
                {[1, 2].map((session, index) => (
                  <motion.div 
                    key={session} 
                    className="flex items-center p-5 bg-[#F3F9FF] rounded-lg border border-[#CCE5FF]"
                    custom={index}
                    variants={itemVariants}
                  >
                    <div className="flex-shrink-0 w-12 h-12 bg-tutu-100 rounded-lg flex items-center justify-center text-[#0078FF]">
                      <Calendar size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-gray-800">Tutor session: {session === 1 ? 'Digital Electronics' : 'Integrated Circuit Design'}</h3>
                      <p className="text-sm text-gray-500">
                        {session === 1 ? 'Friday, 15th August • 15:00 - 16:30' : 'Monday, 18th August • 10:00 - 11:30'}
                      </p>
                    </div>
                    <button className="ml-auto px-4 py-2 bg-[#0078FF] hover:bg-[#005FCC] text-white text-sm rounded-lg transition-colors">
                      Join
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* AI Companion column - 4 columns on large screens */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="lg:sticky lg:top-6">
            <div className="bg-white border border-border rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-[#CCE5FF] p-4 bg-gradient-to-r from-[#E6F2FF] to-white flex items-center">
                 <Bot size={18} className="text-[#0078FF] mr-2" />
                <h2 className="font-medium">AI Learning Companion</h2>
              </div>
              <div> 
                <AICompanion 
                  showHeader={false} 
                  className="border-none shadow-none" 
                  showStats={true}
                />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

// Trang Home cho tutor
const TutorHome: React.FC = () => {
  const { user } = useApp();

  // Dữ liệu mẫu cho thông tin Tutor
  const tutorStats = {
    totalStudents: 82,
    activeCourses: 3,
    averageRating: 4.8,
    totalAIUsers: 156,
    recentQuestions: [
      { id: '1', student: 'John Doe', question: 'How to design a JK flip-flop?', course: 'Digital Electronics', time: '2 hours ago' },
      { id: '2', student: 'Jane Smith', question: 'What is the difference between sequential and combinational circuits?', course: 'Digital Electronics', time: '1 day ago' },
      { id: '3', student: 'Chris Johnson', question: 'Can you explain how to implement a full adder?', course: 'Digital Logic Design', time: '3 days ago' }
    ],
    aiAgentFeedback: [
      { 
        id: '1', 
        agentName: 'Digital Electronics Tutor', 
        rating: 4.7, 
        totalInteractions: 324, 
        reviews: [
          { id: '1', student: 'John Doe', comment: 'Very helpful for understanding flip-flops', rating: 5, date: '2 days ago' },
          { id: '2', student: 'Jane Smith', comment: 'Clear explanations on digital circuits', rating: 4, date: '1 week ago' }
        ]
      },
      { 
        id: '2', 
        agentName: 'Circuit Design Assistant', 
        rating: 4.5, 
        totalInteractions: 198, 
        reviews: [
          { id: '3', student: 'Chris Johnson', comment: 'Helped me understand Karnaugh maps', rating: 5, date: '3 days ago' },
          { id: '4', student: 'Jane Smith', comment: 'Good explanations but could be more detailed', rating: 4, date: '5 days ago' }
        ]
      },
      { 
        id: '3', 
        agentName: 'VHDL Programming Guide', 
        rating: 4.9, 
        totalInteractions: 267, 
        reviews: [
          { id: '5', student: 'Chris Johnson', comment: 'Excellent code examples and explanations', rating: 5, date: '1 day ago' },
          { id: '6', student: 'Jane Smith', comment: 'Extremely helpful for my VHDL project', rating: 5, date: '4 days ago' }
        ]
      }
    ]
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Phần tiêu đề */}
      <motion.div 
        // className="mb-8 bg-gradient-to-r from-amber-50 to-white p-6 rounded-xl border border-[#CCE5FF]"
        className="mb-8 bg-gradient-to-r from-[#E6F2FF] to-white p-6 rounded-xl border border-[#CCE5FF]"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Hello, {user?.name || 'Tutor'}! 👋</h1>
        <p className="text-gray-600 mt-2">Welcome to your teaching dashboard. Here's an overview of your impact.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cột 1: Thông tin tổng quan - 8 cột */}
        <div className="lg:col-span-8 space-y-6">
          {/* Thẻ tổng quan */}
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.1 }
              }
            }}
          >
            <motion.div 
              className="bg-white border border-[#CCE5FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={0}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Students</h3>
                <Users className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">{tutorStats.totalStudents}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-[#CCE5FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={1}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Courses</h3>
                <BookOpen className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">{tutorStats.activeCourses}</p>
            </motion.div>
            
            <motion.div 
              className="bg-white border border-[#CCE5FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={2}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">Rating</h3>
                <Star className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">{tutorStats.averageRating}</p>
            </motion.div>

            <motion.div 
              className="bg-white border border-[#CCE5FF] rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow"
              custom={3}
              variants={itemVariants}
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-medium text-gray-500">AI Users</h3>
                <Bot className="text-[#0078FF]" size={18} />
              </div>
              <p className="text-2xl font-bold">{tutorStats.totalAIUsers}</p>
            </motion.div>
          </motion.div>

          {/* Đánh giá AI Agents */}
          <motion.div 
            className="bg-white border border-[#CCE5FF] rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="font-medium flex items-center text-gray-800">
                <Bot size={18} className="mr-2 text-[#0078FF]" />
                AI Tutor Performance
              </h2>
            </div>
            <div className="p-0">
              <motion.div 
                className="divide-y divide-amber-100"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.4 }
                  }
                }}
              >
                {tutorStats.aiAgentFeedback.map((agent, index) => (
                  <motion.div 
                    key={agent.id} 
                    className="p-5 hover:bg-[#E6F2FF] transition-colors"
                    custom={index}
                    variants={itemVariants}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#0078FF] mr-3">
                          <Bot size={20} />
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-800">{agent.agentName}</h3>
                          <div className="flex items-center">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={14} 
                                  className={`${star <= Math.round(agent.rating) ? 'text-[#0078FF] fill-amber-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">{agent.rating.toFixed(1)}/5.0</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <div className="text-gray-600">{agent.totalInteractions}</div>
                        <div className="text-gray-500 text-xs">total interactions</div>
                      </div>
                    </div>
                    
                    <div className="bg-[#E6F2FF] rounded-lg p-4 space-y-3">
                      <h4 className="text-sm font-medium text-gray-700">Recent Student Reviews</h4>
                      {agent.reviews.map((review) => (
                        <div key={review.id} className="border-l-2 border-amber-300 pl-3 py-1">
                          <div className="flex justify-between">
                            <span className="text-sm font-medium">{review.student}</span>
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  size={12} 
                                  className={`${star <= review.rating ? 'text-[#0078FF] fill-amber-500' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 italic">"...{review.comment}..."</p>
                          <div className="text-xs text-gray-500">{review.date}</div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Link 
                        to={`/ai-agents/${agent.id}`}
                        className="px-4 py-2 bg-[#E6F2FF]0 hover:bg-amber-600 text-white rounded-lg text-sm flex items-center transition-colors"
                      >
                        View details
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Câu hỏi gần đây */}
          <motion.div 
            className="bg-white border border-[#CCE5FF] rounded-xl shadow-sm overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="p-5 border-b border-amber-100 bg-gradient-to-r from-amber-50 to-white">
              <h2 className="font-medium flex items-center text-gray-800">
                <MessageSquare size={18} className="mr-2 text-[#0078FF]" />
                Recent Questions
              </h2>
            </div>
            <div className="p-5">
              <motion.div 
                className="space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { 
                    opacity: 1,
                    transition: { staggerChildren: 0.1, delayChildren: 0.7 }
                  }
                }}
              >
                {tutorStats.recentQuestions.map((question, index) => (
                  <motion.div 
                    key={question.id} 
                    className="p-4 bg-white border border-amber-100 rounded-lg hover:border-[#66B2FF] transition-colors shadow-sm"
                    custom={index}
                    variants={itemVariants}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-[#0078FF] mr-2">
                          <User size={16} />
                        </div>
                        <h3 className="font-medium text-gray-800">{question.student}</h3>
                      </div>
                      <p className="text-xs text-gray-500">{question.time}</p>
                    </div>
                    <p className="text-sm text-gray-700 mb-2 pl-10">{question.question}</p>
                    <div className="flex items-center justify-between pl-10">
                      <span className="text-xs px-2 py-1 bg-amber-100 text-amber-800 rounded-full">{question.course}</span>
                      <Link to={`/chats`} className="text-sm text-amber-600 hover:text-amber-700 font-medium flex items-center">
                        Answer
                        <ArrowRight size={14} className="ml-1" />
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
        
        {/* Cột 2: My AI Tutor - 4 cột */}
        <motion.div 
          className="lg:col-span-4"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div className="lg:sticky lg:top-6">
            <div className="bg-white border border-[#CCE5FF] rounded-xl shadow-sm overflow-hidden">
              <div className="border-b border-amber-100 p-4 bg-gradient-to-r from-amber-50 to-white flex items-center">
                <Bot size={18} className="text-[#0078FF] mr-2" />
                <h2 className="font-medium">AI Teaching Assistant</h2>
              </div>
              <div>
                <AICompanion 
                  showHeader={false} 
                  className="border-none shadow-none" 
                  showStats={true}
                />
              </div>
            </div>
            
            <div className="mt-6 bg-white border border-[#CCE5FF] rounded-xl p-5 shadow-sm">
              <h3 className="font-medium mb-4 flex items-center">
                <Activity size={18} className="text-[#0078FF] mr-2" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Link 
                  to="/my-ai-tutor" 
                  className="block w-full p-3 bg-[#E6F2FF] hover:bg-amber-100 rounded-lg text-sm text-gray-800 transition-colors flex items-center group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mr-3 group-hover:bg-amber-300 transition-colors">
                    <Bot size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Create new AI Tutor</div>
                    <div className="text-xs text-gray-500 mt-0.5">Design custom AI for your students</div>
                  </div>
                  <ArrowRight size={16} className="text-[#0078FF] group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/courses" 
                  className="block w-full p-3 bg-[#E6F2FF] hover:bg-amber-100 rounded-lg text-sm text-gray-800 transition-colors flex items-center group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mr-3 group-hover:bg-amber-300 transition-colors">
                    <BookOpen size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Manage courses</div>
                    <div className="text-xs text-gray-500 mt-0.5">Update content and materials</div>
                  </div>
                  <ArrowRight size={16} className="text-[#0078FF] group-hover:translate-x-1 transition-transform" />
                </Link>
                
                <Link 
                  to="/analytics" 
                  className="block w-full p-3 bg-[#E6F2FF] hover:bg-amber-100 rounded-lg text-sm text-gray-800 transition-colors flex items-center group"
                >
                  <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center text-amber-700 mr-3 group-hover:bg-amber-300 transition-colors">
                    <BarChart3 size={16} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">Analytics dashboard</div>
                    <div className="text-xs text-gray-500 mt-0.5">View student performance metrics</div>
                  </div>
                  <ArrowRight size={16} className="text-[#0078FF] group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home; 