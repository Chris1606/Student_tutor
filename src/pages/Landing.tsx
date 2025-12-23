import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import logoImage from '../../assets/evol.png';

const Landing: React.FC = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5, ease: 'easeOut' } }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col bg-gradient-to-br from-[#E6F2FF] via-[#F9FBFF] to-white transition-all duration-500 relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Nền mờ logo */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none flex items-center justify-center"
        style={{
          backgroundImage: `url(${logoImage})`,
          backgroundSize: '80%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
      />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Thanh header */}
        <motion.header 
          className="w-full bg-white/30 backdrop-blur-sm border-b border-[#E6F2FF] transition-all duration-300"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <img src={logoImage} alt="EVOSKY Logo" className="w-8 h-8 object-contain transition-all duration-300 hover:scale-110" />
              <span className="text-xl font-bold text-[#0078FF] hover:text-[#005FCC] transition-colors duration-300 cursor-pointer">EVOSKY</span>
            </motion.div>

            <motion.div 
              className="flex items-center gap-4"
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                to="/login"
                className="px-4 py-2 text-sm font-medium text-[#0A2540] hover:text-[#0078FF] hover:bg-[#E6F2FF]/60 rounded-lg transition-all duration-300"
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#0078FF] to-[#005FCC] rounded-lg hover:from-[#005FCC] hover:to-[#004C99] shadow-sm hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                Bắt đầu ngay
              </Link>
            </motion.div>
          </div>
        </motion.header>

        {/* Nội dung chính */}
        <main className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              {/* Bên trái */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <motion.h1 
                  className="text-4xl md:text-5xl font-bold text-[#0A2540] mb-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  Nền tảng học tập thông minh
                </motion.h1>
                <motion.p 
                  className="text-lg text-[#0A2540]/80 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.5 }}
                >
                  Học tập hiệu quả với <span className="text-[#0078FF] font-medium">Trợ lý AI cá nhân hóa</span>, 
                  kết nối cùng gia sư thật và môi trường học tập tương tác.
                </motion.p>
              </motion.div>

              {/* Bên phải - danh sách tính năng */}
              <motion.div 
                className="grid gap-6 md:grid-cols-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {[{
                  title: 'Học tập với AI',
                  text: 'Lộ trình học cá nhân hóa và phản hồi tức thì nhờ công nghệ AI tiên tiến.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  )
                }, {
                  title: 'Tương tác trực quan',
                  text: 'Tham gia các bài tập, câu đố và công cụ hợp tác học tập thời gian thực.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                  )
                }, {
                  title: 'Gia sư chuyên nghiệp',
                  text: 'Kết nối với các gia sư giàu kinh nghiệm để được hướng dẫn và hỗ trợ trực tiếp.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  )
                }, {
                  title: 'Theo dõi tiến độ',
                  text: 'Theo dõi quá trình học với biểu đồ chi tiết và báo cáo tiến bộ cá nhân.',
                  icon: (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  )
                }].map((feature, i) => (
                  <motion.div 
                    key={i} 
                    className="bg-white/40 backdrop-blur-sm rounded-xl p-6 border-2 border-[#E6F2FF] shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-[1.02] hover:bg-[#F9FBFF]/80 hover:border-[#0078FF]/40 group relative overflow-hidden" 
                    variants={itemVariants}
                  >
                    <div className="absolute -top-10 -right-10 w-20 h-20 bg-[#E6F2FF]/60 rounded-full blur-xl group-hover:bg-[#E6F2FF]/80 transition-all duration-500"></div>
                    <div className="absolute -bottom-8 -left-8 w-16 h-16 bg-[#E6F2FF]/60 rounded-full blur-lg group-hover:bg-[#E6F2FF]/80 transition-all duration-500"></div>
                    <div className="text-[#0078FF] group-hover:text-[#005FCC] mb-4 bg-[#E6F2FF]/40 w-fit p-2.5 rounded-lg transition-all duration-500 group-hover:bg-[#E6F2FF]/70 group-hover:shadow">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{feature.icon}</svg>
                    </div>
                    <h3 className="text-xl font-bold text-[#0A2540] mb-2 group-hover:text-[#0078FF] transition-colors duration-500">{feature.title}</h3>
                    <p className="text-[#0A2540]/80 group-hover:text-[#0A2540] transition-colors duration-500">{feature.text}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <motion.footer 
          className="bg-white/40 backdrop-blur-md border-t border-[#E6F2FF] transition-all duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-[#0A2540]/70">
              <p>
                © 2025 <span className="text-[#0078FF] hover:text-[#005FCC] hover:underline cursor-pointer transition-all duration-300">EVOSKY</span>. 
                Mọi quyền được bảo lưu.
              </p>
            </div>
          </div>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default Landing;
