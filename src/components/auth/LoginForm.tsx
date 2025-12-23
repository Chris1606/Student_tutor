import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/home');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="w-full flex justify-center items-center min-h-[80vh]">
      <div className="w-full max-w-md px-4">
        <div className="bg-white/40 backdrop-blur-xl rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] p-8 border border-[#E6F2FF]/80">
          
          {/* Title */}
          <div className="mb-8 text-center relative z-10">
            <h2 className="text-3xl font-bold text-[#0A2540] mb-2 drop-shadow-sm">Chào mừng trở lại!</h2>
            <p className="text-[#0A2540]/80">Vui lòng đăng nhập để tiếp tục</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div className="space-y-5">

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#0A2540]/80">Email</label>
                <div className="relative">
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E6F2FF]/80 rounded-xl focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 text-[#0A2540] bg-white/60 backdrop-blur-lg transition-all duration-200"
                    placeholder="Nhập email của bạn"
                    required
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2 text-[#0A2540]/80">Mật khẩu</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-[#E6F2FF]/80 rounded-xl focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 pr-10 text-[#0A2540] bg-white/60 backdrop-blur-lg transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                    required
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70 hover:text-[#005FCC] transition-colors duration-200"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0078FF] border-gray-300 rounded focus:ring-[#0078FF]/40"
                />
                <span className="ml-2 text-sm text-[#0A2540]/80">Ghi nhớ đăng nhập</span>
              </label>

              <Link 
                to="/forgot-password" 
                className="text-sm font-medium text-[#0078FF] hover:text-[#005FCC] transition-colors duration-200"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Error */}
            {error && (
              <div className="p-4 bg-red-50/60 backdrop-blur-lg border border-red-100/50 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-[#0078FF] to-[#005FCC] text-white px-4 py-3.5 rounded-xl hover:from-[#005FCC] hover:to-[#004C99] focus:ring-2 focus:ring-[#0078FF]/30 transition-all duration-200 font-medium shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
            </button>

            {/* Redirect */}
            <p className="text-center text-sm text-[#0A2540]/80">
              Chưa có tài khoản?{' '}
              <Link 
                to="/register" 
                className="font-medium text-[#0078FF] hover:text-[#005FCC] transition-colors"
              >
                Đăng ký ngay
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
