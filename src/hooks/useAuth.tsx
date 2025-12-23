import { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

// Mock user data - with fixed role types
const MOCK_USERS = [
  {
    id: '1',
    email: 'student@example.com',
    password: '1',
    name: 'John Student',
    role: 'student' as const,
    coins: 100,
    avatar: 'https://i.pravatar.cc/150?img=1'
  },
  {
    id: '2',
    email: 'tutor@example.com',
    password: '1',
    name: 'Jane Tutor',
    role: 'tutor' as const,
    coins: 500,
    avatar: 'https://i.pravatar.cc/150?img=2'
  }
];

export const useAuth = () => {
  const { setIsAuthenticated, setUser } = useApp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUser(user);
      setIsAuthenticated(true);
    }
  }, [setIsAuthenticated, setUser]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Find user in mock data
      const user = MOCK_USERS.find(u => u.email === email && u.password === password);
      
      if (user) {
        // Remove password before storing
        const { password, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        toast.success(`Welcome back, ${user.name}!`);
        return true;
      } else {
        setError('Invalid email or password');
        toast.error('Invalid email or password');
        return false;
      }
    } catch (err) {
      setError('An error occurred during login');
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: 'student' | 'tutor') => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user with this email already exists
      const existingUser = MOCK_USERS.find(u => u.email === email);
      if (existingUser) {
        setError('Email is already in use');
        toast.error('Email is already in use');
        return false;
      }
      
      // Create new user
      const newUser = {
        id: `${MOCK_USERS.length + 1}`,
        email,
        password,
        name,
        role,
        coins: role === 'student' ? 100 : 500,
        avatar: `https://i.pravatar.cc/150?img=${MOCK_USERS.length + 3}`
      };
      
      // In a real app, we would send this to an API
      // For demo purposes, we'll just log the registration
      console.log('Registered new user:', newUser);
      
      // Auto-login after registration
      const { password: _, ...userWithoutPassword } = newUser;
      localStorage.setItem('user', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      
      toast.success(`Welcome, ${name}!`);
      return true;
    } catch (err) {
      setError('An error occurred during registration');
      toast.error('Registration failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return {
    login,
    register,
    logout,
    loading,
    error
  };
};
