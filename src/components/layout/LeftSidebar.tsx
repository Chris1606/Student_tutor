import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/hooks/useAuth';
import { 
  Home, 
  BookOpen, 
  MessageSquare, 
  User, 
  LogOut, 
  Coins, 
  PlusCircle,
  LineChart,
  BrainCircuit,
  Users,
  PanelLeftClose,
  PanelLeftOpen,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const LeftSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, togglePanelExpanded, coins, isStudent, isTutor, setChatHistoryVisible } = useApp();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isChatsOpen, setIsChatsOpen] = useState(false);
  const [chatHistory, setChatHistory] = useState([
    { title: 'Tutorial digital electronics', id: '1' },
    { title: 'Flip-flop and sequential circuits', id: '2' },
    { title: 'Designing logic gates', id: '3' }
  ]);

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname.startsWith(path + '/') ? 'active' : '';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const handleChatClick = () => {
    if (isCollapsed) {
      navigate('/chats');
      setChatHistoryVisible(true);
    } else {
      setIsChatsOpen(!isChatsOpen);
    }
  };

  const navigateToChatById = (chatId: string) => {
    navigate(`/chats/${chatId}`);
    setChatHistoryVisible(false);
    setIsChatsOpen(false);
  };

  const startNewChat = () => {
    navigate('/chats/new');
    setChatHistoryVisible(false);
    setIsChatsOpen(false);
  };

  // Đóng dropdown chat history khi sidebar bị thu gọn
  useEffect(() => {
    if (isCollapsed) {
      setIsChatsOpen(false);
    }
  }, [isCollapsed]);

  return (
    <div className={`${isCollapsed ? 'w-[80px] min-w-[80px]' : 'w-[260px] min-w-[260px]'} h-full bg-white border-r border-border flex flex-col transition-all duration-300 ease-in-out relative`}>
      {/* Toggle Button */}
      <button 
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 bg-white border border-border rounded-full p-1.5 shadow-sm hover:bg-gray-50 z-10 transition-colors duration-200"
      >
        {isCollapsed ? <PanelLeftOpen size={18} className="text-gray-600" /> : <PanelLeftClose size={18} className="text-gray-600" />}
      </button>

      {/* Logo and Brand */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-illuma-600 flex items-center justify-center">
            <span className="text-white font-bold">I</span>
          </div>
          {!isCollapsed && <h1 className="text-xl font-bold">ILLUMA</h1>}
        </div>
      </div>

      {/* User Profile */}
      {user && !isCollapsed && (
        <div className="p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <img 
              src={user.avatar || 'https://i.pravatar.cc/150?img=default'} 
              alt={user.name} 
              className="w-10 h-10 rounded-full object-cover border-2 border-illuma-200"
            />
            <div>
              <p className="font-medium text-sm">{user.name}</p>
              <div className="coin-badge">
                <Coins size={12} />
                <span>{user.coins} LUX</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <Link to="/home" className={`sidebar-item ${isActive('/home')} ${isCollapsed ? 'justify-center' : ''}`}>
          <Home size={18} />
          {!isCollapsed && <span>Home</span>}
        </Link>
        
        <Link to="/courses" className={`sidebar-item ${isActive('/courses')} ${isCollapsed ? 'justify-center' : ''}`}>
          <BookOpen size={18} />
          {!isCollapsed && <span>Courses</span>}
        </Link>
        
        <div className="relative">
          <button 
            onClick={handleChatClick}
            className={`sidebar-item w-full text-left ${isActive('/chats')} ${isCollapsed ? 'justify-center' : ''} ${isChatsOpen ? 'bg-gray-100' : ''}`}
          >
            <MessageSquare size={18} />
            {!isCollapsed && (
              <div className="flex-1 flex items-center justify-between">
                <span>Chats</span>
                {isChatsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            )}
          </button>
          
          {/* Chat history dropdown */}
          {!isCollapsed && isChatsOpen && (
            <div className="ml-6 pl-4 border-l border-gray-200 mt-1 mb-1 animate-slideDown">
              <div className="flex items-center justify-between py-2 px-2">
                <h6 className="text-xs font-medium text-muted-foreground">Recent chats</h6>
                <button 
                  onClick={startNewChat}
                  className="text-xs flex items-center gap-1 text-illuma-600 hover:text-illuma-700"
                >
                  <Sparkles size={12} />
                  <span>New</span>
                </button>
              </div>
              
              <div className="space-y-1 max-h-[150px] overflow-y-auto custom-scrollbar pr-1">
                {chatHistory.map((chat) => (
                  <button
                    key={chat.id}
                    onClick={() => navigateToChatById(chat.id)}
                    className="w-full text-left px-3 py-2 text-xs rounded-md hover:bg-gray-100 transition-colors"
                  >
                    {chat.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {isStudent && (
          <Link to="/profile" className={`sidebar-item ${isActive('/profile')} ${isCollapsed ? 'justify-center' : ''}`}>
            <User size={18} />
            {!isCollapsed && <span>Profile</span>}
          </Link>
        )}

        {isTutor && (
          <>
            <Link to="/my-ai-tutor" className={`sidebar-item ${isActive('/my-ai-tutor')} ${isCollapsed ? 'justify-center' : ''}`}>
              <BrainCircuit size={18} />
              {!isCollapsed && <span>AI Tutor</span>}
            </Link>
            <Link to="/analytics" className={`sidebar-item ${isActive('/analytics')} ${isCollapsed ? 'justify-center' : ''}`}>
              <LineChart size={18} />
              {!isCollapsed && <span>Analytics</span>}
            </Link>
          </>
        )}
      </div>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border">
        <div className="mb-3">
          <button className={`w-full btn-primary flex items-center ${isCollapsed ? 'justify-center' : ''} gap-2`}>
            <PlusCircle size={16} />
            {!isCollapsed && <span>Add LUX Coins</span>}
          </button>
        </div>
        
        <button 
          onClick={handleLogout}
          className={`w-full btn-secondary flex items-center ${isCollapsed ? 'justify-center' : ''} gap-2`}
        >
          <LogOut size={16} />
          {!isCollapsed && <span>Log Out</span>}
        </button>
      </div>
    </div>
  );
};

export default LeftSidebar;
