import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import RegisterForm from '@/components/auth/RegisterForm';
import { motion } from 'framer-motion';
import logoImage from '../../assets/evol.png'; // ✅ logo EVOSKY

const Register: React.FC = () => {
  const { isAuthenticated } = useApp();
  const { register } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  const handleRegister = async (name: string, email: string, password: string, role: 'student' | 'tutor') => {
    const success = await register(name, email, password, role);
    if (success) {
      navigate('/home');
    }
  };

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E6F2FF] via-[#F9FBFF] to-white relative overflow-hidden px-4"
      // className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#E6F2FF] via-[#F9FBFF] to-white p-4 relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background glow */}
      <div className="absolute top-0 right-0 w-[30rem] h-[30rem] bg-[#0078FF]/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[30rem] h-[30rem] bg-[#0078FF]/20 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

      <motion.div 
        className="w-full max-w-4xl flex flex-col md:flex-row rounded-xl shadow-xl overflow-hidden border border-[#E6F2FF]/60 backdrop-blur-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        {/* Left side - Illustration and branding */}
        <motion.div 
          className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#0078FF] to-[#005FCC] text-white p-12 flex-col justify-between"
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <div>
            {/* Logo */}
            <motion.div 
              className="flex items-center gap-2 mb-8"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.5 }}
            >
              <img 
                src={logoImage} 
                alt="EVOSKY Logo" 
                className="w-10 h-10 object-contain bg-white rounded-full p-1"
              />
              <h1 className="text-2xl font-bold tracking-wide">EVOSKY</h1>
            </motion.div>

            <motion.h2 
              className="text-3xl font-bold mb-6 leading-snug"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              Tham gia hệ sinh thái học tập thông minh
            </motion.h2>
            <motion.p 
              className="text-blue-100/90 mb-6 text-[15px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
            >
              Tạo tài khoản để trải nghiệm hành trình học tập cá nhân hóa cùng AI Tutor, và kết nối với các gia sư thực trong mạng lưới EVOSKY.
            </motion.p>
          </div>

          {/* <motion.div 
            className="text-sm text-blue-100/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <p>Already have an account?</p>
            <Link to="/login" className="text-white hover:underline font-medium">
              Sign in now →
            </Link>
          </motion.div> */}
        </motion.div>

        {/* Right side - Register form */}
        <motion.div 
          className="w-full md:w-1/2 bg-white/70 backdrop-blur-lg p-8 md:p-12"
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <RegisterForm onRegister={handleRegister} />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Register;
