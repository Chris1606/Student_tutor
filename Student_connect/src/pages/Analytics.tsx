import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Activity, Users, Layers, BookOpen, 
  ArrowUpRight, ArrowDownRight, HelpCircle, Download, 
  Calendar, ChevronDown, Filter, LineChart, PieChart, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';

// Dữ liệu mẫu cho biểu đồ và phân tích
const DUMMY_DATA = {
  totalStudents: 82,
  activeStudents: 76,
  completionRate: 68,
  averageScore: 72,
  monthlyEngagement: [
    { month: 'Jan', count: 45 },
    { month: 'Feb', count: 52 },
    { month: 'Mar', count: 68 },
    { month: 'Apr', count: 76 },
    { month: 'May', count: 82 },
    { month: 'Jun', count: 91 },
  ],
  aiTutorTrend: [
    { month: 'Jan', sessions: 420 },
    { month: 'Feb', sessions: 530 },
    { month: 'Mar', sessions: 580 },
    { month: 'Apr', sessions: 620 },
    { month: 'May', sessions: 750 },
    { month: 'Jun', sessions: 789 },
  ],
  subjectPerformance: [
    { subject: 'Digital Electronics', score: 78, students: 32 },
    { subject: 'Circuit Design', score: 65, students: 24 },
    { subject: 'Microprocessors', score: 82, students: 18 },
    { subject: 'VHDL', score: 76, students: 8 },
  ],
  aiTutorUsage: [
    { name: 'Digital Electronics Tutor', sessions: 324, rating: 4.7 },
    { name: 'Circuit Design Assistant', sessions: 198, rating: 4.5 },
    { name: 'VHDL Programming Guide', sessions: 267, rating: 4.9 },
  ],
  studentProgress: [
    { id: '1', name: 'Nguyen Van A', progress: 92, courses: 2, lastActive: '2 hours ago' },
    { id: '2', name: 'Tran Thi B', progress: 78, courses: 3, lastActive: '1 day ago' },
    { id: '3', name: 'Le Van C', progress: 85, courses: 1, lastActive: 'Just now' },
    { id: '4', name: 'Pham Thi D', progress: 65, courses: 2, lastActive: '3 days ago' },
    { id: '5', name: 'Hoang Van E', progress: 98, courses: 3, lastActive: '5 hours ago' },
  ],
};

const Analytics: React.FC = () => {
  const { setActiveSection } = useApp();
  const [period, setPeriod] = useState('month');

  useEffect(() => {
    setActiveSection('analytics');
  }, [setActiveSection]);

  // Giả lập biểu đồ thanh với CSS
  const BarGraph = ({ data, maxValue }: { data: { month: string; count: number }[], maxValue?: number }) => {
    const highest = maxValue || Math.max(...data.map(item => item.count));
    
    return (
      <div className="mt-6">
        {/* Chú thích giá trị */}
        <div className="flex justify-between mb-2 px-2">
          <div className="text-xs text-gray-500">0</div>
          <div className="text-xs text-gray-500">{highest}</div>
        </div>
        
        {/* Các cột */}
        <motion.div 
          className="space-y-4"
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
          {data.map((item, index) => {
            const widthPercent = (item.count / highest) * 100;
            return (
              <motion.div 
                key={index} 
                className="flex items-center"
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { 
                      duration: 0.5,
                      ease: "easeOut" 
                    }
                  }
                }}
              >
                <div className="w-16 font-medium text-sm text-gray-700">{item.month}</div>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <motion.div 
                    className="h-full bg-amber-400 relative rounded-lg flex items-center px-3 justify-end"
                    initial={{ width: 0 }}
                    animate={{ width: `${widthPercent}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 }}
                  >
                    <span className="text-amber-800 font-medium text-sm relative z-10">
                      {item.count}
                    </span>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    );
  };

  // Giả lập biểu đồ tiến trình
  const ProgressBar = ({ value, max = 100 }: { value: number, max?: number }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="w-full bg-gray-100 rounded-full h-2">
        <motion.div 
          className="bg-amber-500 h-2 rounded-full" 
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        ></motion.div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6">
      <motion.div 
        className="flex justify-between items-center mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Monitor student progress and performance metrics</p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <Calendar size={16} className="text-gray-500" />
            <select 
              className="bg-transparent border-none outline-none text-sm text-gray-700 appearance-none pr-8"
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
            <ChevronDown size={14} className="text-gray-500" />
          </div>
          
          <motion.button 
            className="bg-white border border-gray-200 rounded-lg px-4 py-2 flex items-center gap-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={16} />
            Export
          </motion.button>
        </div>
      </motion.div>
      
      {/* Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
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
          className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5 }
            }
          }}
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <Users size={16} className="mr-1 text-amber-500" />
                Active Students
              </p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{DUMMY_DATA.activeStudents}</h3>
                <p className="text-xs text-emerald-600 ml-2 flex items-center">
                  <ArrowUpRight size={12} />
                  +12%
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                out of {DUMMY_DATA.totalStudents} total students
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Activity size={24} className="text-amber-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: 0.1 }
            }
          }}
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <BookOpen size={16} className="mr-1 text-amber-500" />
                Completion Rate
              </p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{DUMMY_DATA.completionRate}%</h3>
                <p className="text-xs text-emerald-600 ml-2 flex items-center">
                  <ArrowUpRight size={12} />
                  +5%
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                of all assigned materials
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Layers size={24} className="text-amber-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: 0.2 }
            }
          }}
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <BarChart3 size={16} className="mr-1 text-amber-500" />
                Average Score
              </p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">{DUMMY_DATA.averageScore}</h3>
                <p className="text-xs text-rose-500 ml-2 flex items-center">
                  <ArrowDownRight size={12} />
                  -3
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                points across all courses
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <LineChart size={24} className="text-amber-500" />
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm hover:shadow-md transition-all"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.5, delay: 0.3 }
            }
          }}
          whileHover={{ y: -5 }}
        >
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm text-gray-500 flex items-center">
                <PieChart size={16} className="mr-1 text-amber-500" />
                AI Tutor Usage
              </p>
              <div className="flex items-baseline mt-1">
                <h3 className="text-2xl font-bold">789</h3>
                <p className="text-xs text-emerald-600 ml-2 flex items-center">
                  <ArrowUpRight size={12} />
                  +24%
                </p>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                total interactions this {period}
              </p>
            </div>
            <div className="p-3 bg-amber-50 rounded-full">
              <Activity size={24} className="text-amber-500" />
            </div>
          </div>
        </motion.div>
      </motion.div>
      
      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <motion.div 
          className="col-span-2 bg-white rounded-xl border border-amber-200 p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="font-medium text-gray-800">Monthly Student Engagement</h3>
            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
                <span>Active students</span>
              </div>
              <motion.button 
                className="text-sm text-amber-600 flex items-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={14} className="mr-1" />
                Filter
              </motion.button>
            </div>
          </div>
          <BarGraph data={DUMMY_DATA.monthlyEngagement} />
        </motion.div>
        
        <motion.div 
          className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="font-medium text-gray-800 mb-6">Subject Performance</h3>
          <motion.div 
            className="space-y-6"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { 
                opacity: 1,
                transition: { staggerChildren: 0.2, delayChildren: 0.2 }
              }
            }}
          >
            {DUMMY_DATA.subjectPerformance.map((subject, index) => (
              <motion.div 
                key={index}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.5 }
                  }
                }}
              >
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{subject.subject}</span>
                  <span className="text-sm text-gray-500">{subject.score}%</span>
                </div>
                <ProgressBar value={subject.score} />
                <div className="text-xs text-gray-500 mt-1">
                  {subject.students} students enrolled
                </div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
      
      {/* AI Tutor Performance */}
      <motion.div 
        className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-gray-800">AI Tutor Performance</h3>
          <motion.div
            whileHover={{ scale: 1.05 }}
          >
            <Link to="/my-ai-tutor" className="text-sm text-amber-600 flex items-center">
              View all AI tutors
              <ChevronDown size={14} className="ml-1" />
            </Link>
          </motion.div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">AI Tutor</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Sessions</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Rating</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Usage Trend</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {DUMMY_DATA.aiTutorUsage.map((tutor, index) => (
                <motion.tr 
                  key={index} 
                  className="border-b border-gray-100 hover:bg-gray-50"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.7 + (index * 0.1) }}
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-500 mr-3">
                        <Activity size={16} />
                      </div>
                      <div className="text-sm font-medium">{tutor.name}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{tutor.sessions} sessions</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="text-amber-500 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <div key={star} className={`text-amber-500 ${star <= Math.round(tutor.rating) ? 'fill-amber-500' : 'fill-gray-200'}`}>
                            <Star size={14} className={star <= Math.round(tutor.rating) ? 'fill-amber-500 text-amber-500' : 'fill-gray-200 text-gray-200'} />
                          </div>
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{tutor.rating}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center text-emerald-600">
                      <ArrowUpRight size={16} />
                      <span className="ml-1 text-sm">24% increase</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <motion.div whileHover={{ scale: 1.05 }}>
                      <Link 
                        to={`/my-ai-tutor/${index + 1}`}
                        className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                      >
                        View details
                      </Link>
                    </motion.div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
      
      {/* Thêm biểu đồ xu hướng sử dụng AI Tutor bên dưới phần AI Tutor Performance */}
      <motion.div 
        className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="flex justify-between items-center">
          <h3 className="font-medium text-gray-800">AI Tutor Usage Trend</h3>
          <div className="flex items-center gap-3">
            <div className="text-xs text-gray-500 flex items-center gap-1">
              <div className="w-3 h-3 bg-amber-400 rounded-sm"></div>
              <span>Total sessions</span>
            </div>
            <motion.button 
              className="text-sm text-amber-600 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={14} className="mr-1" />
              Filter
            </motion.button>
          </div>
        </div>
        <div className="mt-6">
          {/* Chú thích giá trị */}
          <div className="flex justify-between mb-2 px-2">
            <div className="text-xs text-gray-500">0</div>
            <div className="text-xs text-gray-500">800</div>
          </div>
          
          {/* Các cột */}
          <motion.div 
            className="space-y-4"
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
            {DUMMY_DATA.aiTutorTrend.map((item, index) => {
              const widthPercent = (item.sessions / 800) * 100;
              return (
                <motion.div 
                  key={index} 
                  className="flex items-center"
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { 
                      opacity: 1, 
                      y: 0,
                      transition: { 
                        duration: 0.5,
                        ease: "easeOut" 
                      }
                    }
                  }}
                >
                  <div className="w-16 font-medium text-sm text-gray-700">{item.month}</div>
                  <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <motion.div 
                      className="h-full bg-amber-400 relative rounded-lg flex items-center px-3 justify-end"
                      initial={{ width: 0 }}
                      animate={{ width: `${widthPercent}%` }}
                      transition={{ duration: 0.8, ease: "easeOut", delay: index * 0.1 + 0.2 }}
                    >
                      <span className="text-amber-800 font-medium text-sm relative z-10">
                        {item.sessions}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </motion.div>
      
      {/* Top Students */}
      <motion.div 
        className="bg-white rounded-xl border border-amber-200 p-6 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-medium text-gray-800">Top Performing Students</h3>
          <motion.button 
            className="text-sm text-amber-600 flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            View all students
            <ChevronDown size={14} className="ml-1" />
          </motion.button>
        </div>
        
        <motion.div 
          className="space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1,
              transition: { staggerChildren: 0.1, delayChildren: 0.2 }
            }
          }}
        >
          {DUMMY_DATA.studentProgress.map((student, index) => (
            <motion.div 
              key={index} 
              className="flex items-center"
              variants={{
                hidden: { opacity: 0, x: -20 },
                visible: { 
                  opacity: 1, 
                  x: 0,
                  transition: { 
                    duration: 0.5,
                    ease: "easeOut" 
                  }
                }
              }}
              whileHover={{ x: 5 }}
            >
              <div className="mr-4 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
                {student.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium">{student.name}</span>
                  <span className="text-sm text-gray-500">{student.progress}%</span>
                </div>
                <ProgressBar value={student.progress} />
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-gray-500">{student.courses} active courses</span>
                  <span className="text-xs text-gray-500">Last active: {student.lastActive}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Analytics; 