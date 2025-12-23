import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import LoginForm from '@/components/auth/LoginForm';
import { motion } from 'framer-motion';
import logoImage from '../../assets/evol.png';

const Login: React.FC = () => {
  const { isAuthenticated } = useApp();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  console.log("Rendering Login page");

  return (
    <motion.div 
      className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#E6F2FF] via-[#F9FBFF] to-white relative overflow-hidden px-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Elements */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `url(${logoImage})`,
          backgroundSize: '60%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      />

      <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400/5 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2" />

      {/* Main Content */}
      <motion.div
        className="relative z-10 w-full max-w-[1200px] flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        {/* Logo Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-3">
            <img 
              src={logoImage} 
              alt="EVOSKY Logo" 
              className="w-12 h-12 object-contain"
            />
            <span className="text-3xl font-bold text-gray-900">EVOSKY</span>
          </div>
        </div>

        {/* Login Form Container */}
        <div className="w-full">
          <LoginForm />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Login; 