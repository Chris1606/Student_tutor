import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, User, Check, AlertCircle, GraduationCap } from 'lucide-react';

interface RegisterFormProps {
  onRegister: (name: string, email: string, password: string, role: 'student' | 'tutor') => Promise<void>;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student' as 'student' | 'tutor',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role: 'student' | 'tutor') => {
    setFormData(prev => ({ ...prev, role }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      setError('Invalid email address');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      await onRegister(formData.name, formData.email, formData.password, formData.role);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-[#0A2540]">Tạo tài khoản</h1>
        <p className="text-sm text-[#0A2540]/70 mt-2">Đăng kí để bắt đầu hành trình học tập</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2 text-[#0A2540]/80">
            Username
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E6F2FF] rounded-lg focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 text-[#0A2540] bg-white/60 backdrop-blur-md transition-all"
              placeholder="Your Name"
              required
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
          </div>
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2 text-[#0A2540]/80">
            Email
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E6F2FF] rounded-lg focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 text-[#0A2540] bg-white/60 backdrop-blur-md transition-all"
              placeholder="user@example.com"
              required
            />
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
          </div>
        </div>

        {/* Password */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2 text-[#0A2540]/80">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E6F2FF] rounded-lg focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 pr-10 text-[#0A2540] bg-white/60 backdrop-blur-md transition-all"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70 focus:outline-none"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2 text-[#0A2540]/80">
            Nhập lại mật khẩu
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-[#E6F2FF] rounded-lg focus:ring-2 focus:ring-[#0078FF]/30 focus:border-[#0078FF] pl-10 pr-10 text-[#0A2540] bg-white/60 backdrop-blur-md transition-all"
              placeholder="••••••••"
              required
            />
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70" size={18} />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#0078FF]/70 focus:outline-none"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-[#0A2540]/80">Bạn là</label>
          <div className="grid grid-cols-2 gap-4">
            {/* Student */}
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`relative p-4 border rounded-lg flex flex-col items-center transition-all duration-300 ${
                formData.role === 'student'
                  ? 'border-[#0078FF] bg-[#E6F2FF] text-[#0078FF] shadow-md scale-[1.03]'
                  : 'border-[#E6F2FF] hover:border-[#0078FF]/50 hover:text-[#0078FF]'
              }`}
            >
              {formData.role === 'student' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#0078FF] rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <User
                className={`mb-2 ${
                  formData.role === 'student' ? 'text-[#0078FF]' : 'text-[#0A2540]/70'
                }`}
                size={24}
              />
              <span className="text-sm font-medium">Học sinh</span>
            </button>

            {/* Tutor */}
            <button
              type="button"
              onClick={() => handleRoleChange('tutor')}
              className={`relative p-4 border rounded-lg flex flex-col items-center transition-all duration-300 ${
                formData.role === 'tutor'
                  ? 'border-[#0078FF] bg-[#E6F2FF] text-[#0078FF] shadow-md scale-[1.03]'
                  : 'border-[#E6F2FF] hover:border-[#0078FF]/50 hover:text-[#0078FF]'
              }`}
            >
              {formData.role === 'tutor' && (
                <div className="absolute top-2 right-2 w-5 h-5 bg-[#0078FF] rounded-full flex items-center justify-center">
                  <Check size={12} className="text-white" />
                </div>
              )}
              <GraduationCap
                className={`mb-2 ${
                  formData.role === 'tutor' ? 'text-[#0078FF]' : 'text-[#0A2540]/70'
                }`}
                size={24}
              />
              <span className="text-sm font-medium">Gia sư</span>
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm flex items-start">
            <AlertCircle size={16} className="mr-2 mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-2 px-4 rounded-lg text-white font-medium bg-gradient-to-r from-[#0078FF] to-[#005FCC] hover:from-[#005FCC] hover:to-[#004C99] shadow-md transition-all duration-300 disabled:opacity-70"
          disabled={loading}
        >
          {loading ? 'Xử lý...' : 'Đăng ký'}
        </button>

        {/* Login Link */}
        <div className="text-center mt-4">
          <span className="text-sm text-[#0A2540]/70">Đã có tài khoản? </span>
          <Link to="/login" className="text-sm font-medium text-[#0078FF] hover:text-[#005FCC]">
            Đăng nhập ngay
          </Link>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
