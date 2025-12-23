import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type UserRole = 'student' | 'tutor' | 'admin' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  coins: number;
  avatar?: string;
}

interface Course {
  id: string;
  title: string;
  description: string;
  tutorId: string;
  tutorName: string;
  tutorAvatar?: string;
  rating: number;
  price: number;
  tags: string[];
  enrolledCount: number;
  duration: string;
  level: string;
}

export interface AppContextType {
  isAuthenticated: boolean;
  user: User | null;
  currentCourse: Course | null;
  activeSection: 'courses' | 'chat' | 'dashboard' | 'profile' | 'home' | 'analytics' | 'my-ai-tutor';
  panelExpanded: boolean;
  setIsAuthenticated: (value: boolean) => void;
  setUser: (user: User | null) => void;
  setCurrentCourse: (course: Course | null) => void;
  setActiveSection: (section: 'courses' | 'chat' | 'dashboard' | 'profile' | 'home' | 'analytics' | 'my-ai-tutor') => void;
  togglePanelExpanded: () => void;
  coins: number;
  addCoins: (amount: number) => void;
  removeCoins: (amount: number) => void;
  isStudent: boolean;
  isTutor: boolean;
  isPanelExpanded: boolean;
  chatHistoryVisible: boolean;
  setChatHistoryVisible: (isVisible: boolean) => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [activeSection, setActiveSection] = useState<'courses' | 'chat' | 'dashboard' | 'profile' | 'home' | 'analytics' | 'my-ai-tutor'>('home');
  const [panelExpanded, setPanelExpanded] = useState(true);
  const [isPanelExpanded, setIsPanelExpanded] = useState(true);
  const [chatHistoryVisible, setChatHistoryVisible] = useState(false);

  const isStudent = user?.role === 'student';
  const isTutor = user?.role === 'tutor';
  const coins = user?.coins || 0;

  // Check for saved user in localStorage on app start
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
      console.log("User authenticated from localStorage");
    } else {
      setIsAuthenticated(false);
      console.log("No user found in localStorage");
    }
  }, []);

  const togglePanelExpanded = () => {
    setPanelExpanded(!panelExpanded);
    setIsPanelExpanded(!isPanelExpanded);
  };

  const addCoins = (amount: number) => {
    if (user) {
      setUser({ ...user, coins: user.coins + amount });
    }
  };

  const removeCoins = (amount: number) => {
    if (user) {
      setUser({ ...user, coins: Math.max(0, user.coins - amount) });
    }
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        user,
        currentCourse,
        activeSection,
        panelExpanded,
        setIsAuthenticated,
        setUser,
        setCurrentCourse,
        setActiveSection,
        togglePanelExpanded,
        coins,
        addCoins,
        removeCoins,
        isStudent,
        isTutor,
        isPanelExpanded,
        chatHistoryVisible,
        setChatHistoryVisible
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
