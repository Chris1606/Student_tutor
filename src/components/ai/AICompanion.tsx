import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/context/AppContext';
import { Link } from 'react-router-dom';
import { Bot, ArrowRight, Send, Maximize2, Minimize2, X, MessageSquare, Activity, Users, Star } from 'lucide-react';
import './AICompanion.css';

// Định nghĩa interface cho AICompanion props
interface AICompanionProps {
  showHeader?: boolean;
  className?: string;
  showStats?: boolean;
}

// Định nghĩa kiểu cho tin nhắn chat
interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

const AICompanion: React.FC<AICompanionProps> = ({ showHeader = true, className = '', showStats = true }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      content: 'Hello! I am your AI Companion. How can I help you today?',
      sender: 'ai',
      timestamp: new Date()
    }
  ]);

  // Dữ liệu thống kê mẫu
  const stats = {
    questionsAnswered: 127,
    studentsHelped: 54,
    averageRating: 4.7
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Cuộn xuống tin nhắn mới nhất
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Cuộn xuống dưới cùng
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const getActiveStudentsResponse = () => {
    const hour = new Date().getHours();
    const responses = [
      // Morning responses (6-12)
      {
        timeRange: [6, 12],
        responses: [
          "There are currently 85 students actively engaging with tutors this morning, with numbers steadily increasing as the day progresses.",
          "Around 90 students are working with tutors right now, which is typical for this time of morning.",
          "We have 95 active students this morning, showing good early engagement with the platform."
        ]
      },
      // Afternoon responses (12-18)
      {
        timeRange: [12, 18],
        responses: [
          "We're seeing peak activity with 160 students currently working with tutors this afternoon.",
          "There are 145 active students engaging with tutors at the moment, which is our busiest time of day.",
          "Around 155 students are currently using the platform, with high engagement in the afternoon sessions."
        ]
      },
      // Evening responses (18-24)
      {
        timeRange: [18, 24],
        responses: [
          "We have 120 students actively working with tutors this evening.",
          "Around 110 students are currently engaged in tutoring sessions this evening.",
          "There are 115 active students using the platform right now, with steady evening participation."
        ]
      },
      // Night responses (0-6)
      {
        timeRange: [0, 6],
        responses: [
          "We have 45 students currently working with tutors during these late hours.",
          "Around 40 students are actively engaged in tutoring sessions at this time.",
          "There are 50 students using the platform right now, with lower but consistent night-time activity."
        ]
      }
    ];

    // Find the appropriate time range
    const timeRange = responses.find(range => 
      hour >= range.timeRange[0] && hour < range.timeRange[1]
    ) || responses[0];

    // Get a random response from the appropriate time range
    const randomIndex = Math.floor(Math.random() * timeRange.responses.length);
    return timeRange.responses[randomIndex];
  };

  const handleSendMessage = () => {
    if (!input.trim()) return;

    // Thêm tin nhắn người dùng
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    // Mô phỏng phản hồi từ AI
    setTimeout(() => {
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: getActiveStudentsResponse(),
        sender: 'ai',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className={`ai-companion-container bg-white border border-border rounded-xl shadow-sm ${isExpanded ? 'expanded fixed top-4 right-4 left-4 bottom-4 z-50 overflow-hidden' : ''} transition-all duration-300 ${className}`}>
      {showHeader && (
        <div className="ai-companion-header p-4 border-b border-border flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-lg">AI Companion</h2>
              <p className="text-sm text-gray-500">Your personal teaching assistant</p>
            </div>
          </div>
          <div className="resize-controls flex items-center gap-2">
            <button 
              onClick={toggleExpand} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label={isExpanded ? "Minimize" : "Maximize"}
            >
              {isExpanded ? <Minimize2 size={18} className="text-gray-600" /> : <Maximize2 size={18} className="text-gray-600" />}
            </button>
            {isExpanded && (
              <button 
                onClick={() => setIsExpanded(false)} 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Close"
              >
                <X size={18} className="text-gray-600" />
              </button>
            )}
          </div>
        </div>
      )}
      
      <div className="flex flex-col">
        {/* Khu vực hiển thị tin nhắn */}
        <div className="chat-messages flex-1 overflow-y-auto space-y-3" style={{ 
          maxHeight: isExpanded ? 'calc(100vh - 170px)' : '300px'
        }}>
          {showStats && !isExpanded && messages.length <= 1 && (
            <div className="mb-4">
              <div className="mb-4 bg-gradient-to-br from-indigo-50 to-indigo-100 p-5 rounded-xl border border-indigo-200">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-600 flex-shrink-0">
                    <Bot size={24} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-base">AI Companion of you</h3>
                    <p className="text-sm text-gray-600 mt-1">Your personal teaching assistant</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  This AI is trained from your lectures and can answer questions even when you're offline.
                </p>
              </div>
              
              <div className="space-y-3">
                <div className="stats-card p-3 rounded-xl flex items-center">
                  <div className="stats-icon flex-shrink-0 w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                    <Activity size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Questions Answered</h3>
                    <p className="text-xl font-semibold text-gray-900">{stats.questionsAnswered}</p>
                  </div>
                </div>
                
                <div className="stats-card p-3 rounded-xl flex items-center">
                  <div className="stats-icon flex-shrink-0 w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Users size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Students Helped</h3>
                    <p className="text-xl font-semibold text-gray-900">{stats.studentsHelped}</p>
                  </div>
                </div>
                
                <div className="stats-card p-3 rounded-xl flex items-center">
                  <div className="stats-icon flex-shrink-0 w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                    <Star size={20} />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-600">Average Rating</h3>
                    <p className="text-xl font-semibold text-gray-900">{stats.averageRating}/5</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'ai' && (
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 mr-3">
                  <Bot size={20} />
                </div>
              )}
              
              <div 
                className={`max-w-[75%] p-3 rounded-xl message-bubble ${
                  message.sender === 'user' 
                    ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white' 
                    : 'bg-white border border-gray-100 text-gray-800'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>
                <p className={`text-xs mt-1 ${message.sender === 'user' ? 'text-white/70' : 'text-gray-500'}`}>
                  {message.timestamp.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              
              {message.sender === 'user' && (
                <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 flex-shrink-0 ml-3">
                  <MessageSquare size={18} />
                </div>
              )}
            </div>
          ))}
          
          {/* Hiển thị chỉ báo đang nhập */}
          {isTyping && (
            <div className="flex justify-start">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white flex-shrink-0 mr-3">
                <Bot size={20} />
              </div>
              <div className="bg-white border border-gray-100 p-3 rounded-xl">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          
          {/* Element để cuộn xuống */}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Nhập tin nhắn */}
        <div className="p-3 border-t border-border">
          <div className="flex items-center gap-2">
            <textarea 
              value={input} 
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              className="message-input flex-grow bg-white p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm"
              placeholder="Ask me anything..."
              rows={1}
              disabled={isTyping}
            />
            <button 
              onClick={handleSendMessage}
              disabled={!input.trim() || isTyping}
              className={`send-button p-3 rounded-xl text-white ${
                input.trim() && !isTyping ? 'hover:bg-indigo-700' : 'bg-gray-200'
              } transition-colors`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICompanion; 