import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Send, PaperclipIcon, Sparkles, XCircle, ChevronDown, ChevronUp, User, Bot, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { OpenRouterRequestMessage, sendMessageToOpenRouter, streamMessageFromOpenRouter } from '@/api/openrouter';

export interface LLMModel {
  id: string;
  name: string;
  description: string;
}

// Mock chat data
const MOCK_MESSAGES = [
  {
    id: '1',
    sender: 'ai' as const,
    senderName: 'ILLUMA',
    senderAvatar: '/placeholder.svg',
    content: 'Hi! I\'m ILLUMA. How can I help you today?',
    timestamp: new Date(Date.now() - 3600000).toISOString()
  }
];

// Message type definition
interface Message {
  id: string;
  sender: 'student' | 'tutor' | 'ai';
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  selectedModel?: LLMModel;
  courseMode?: boolean;
  practiceMode?: boolean;
  realTutorMode?: boolean;
  tutorMode?: boolean;
  studentId?: string;
  chatId?: string;
  isNewChat?: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  selectedModel, 
  courseMode = false, 
  practiceMode = false, 
  realTutorMode = false, 
  tutorMode = false, 
  studentId,
  chatId,
  isNewChat = false
}) => {
  const { currentCourse, user, chatHistoryVisible, setChatHistoryVisible } = useApp();
  const [messages, setMessages] = useState<Message[]>(MOCK_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const [isAITyping, setIsAITyping] = useState(false);
  const [currentChat, setCurrentChat] = useState<string>(chatId || 'new');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [aiResponseText, setAiResponseText] = useState('');

  // Xử lý khi chatId thay đổi
  useEffect(() => {
    if (chatId) {
      setCurrentChat(chatId);
      // Load tin nhắn dựa trên chatId
      loadChatById(chatId);
    }
  }, [chatId]);

  // Xử lý khi isNewChat = true
  useEffect(() => {
    if (isNewChat) {
      startNewChat();
    }
  }, [isNewChat]);

  // Hàm load chat dựa trên ID
  const loadChatById = (id: string) => {
    // Trong ứng dụng thực tế, chúng ta sẽ gọi API để lấy tin nhắn
    console.log(`Loading chat with ID: ${id}`);
    // Mock data cho việc hiển thị
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'ai',
        senderName: selectedModel?.name || 'ILLUMA',
        senderAvatar: '/placeholder.svg',
        content: `Hello! I am ${selectedModel?.name || 'ILLUMA'}. How can I help you today?`,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '100',
        sender: 'student',
        senderName: user?.name || 'Student',
        senderAvatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
        content: 'How to design a JK flip-flop circuit?',
        timestamp: new Date(Date.now() - 2400000).toISOString()
      },
      {
        id: '101',
        sender: 'ai',
        senderName: selectedModel?.name || 'ILLUMA',
        senderAvatar: '/placeholder.svg',
        content: 'To design a JK flip-flop circuit, you need to follow these steps:\n\n1. Understand the operation of the JK flip-flop\n2. Connect NAND gates to create a basic circuit\n3. Add a clock input\n4. Connect the output Q and Q̅\n\nDo you want me to explain each step in detail?',
        timestamp: new Date(Date.now() - 2300000).toISOString()
      }
    ];
    setMessages(mockMessages);
  };

  // Auto-adjust textarea height based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [newMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Chuyển đổi các tin nhắn thành định dạng cho OpenRouter API
  const formatMessagesForAPI = (messages: Message[]): OpenRouterRequestMessage[] => {
    return messages.map(message => ({
      role: message.sender === 'ai' ? 'assistant' : 'user',
      content: message.content
    }));
  };

  // Tạo hệ thống thông điệp dựa theo ngữ cảnh
  const createContextMessages = (): OpenRouterRequestMessage[] => {
    let promptContent = `You are ILLUMA, an AI teaching assistant specializing in electronics and digital circuits.
    ${currentCourse ? `You are currently helping with the course: ${currentCourse.title}.` : ''}
    ${practiceMode ? 'You are in practice mode, where you should guide students through exercises and provide hints rather than direct answers.' : ''}
    ${realTutorMode ? 'You should inform the student that you are an AI assistant and a real tutor will join the conversation soon.' : ''}`;
    
    if (tutorMode) {
      promptContent = `You are ILLUMA, an AI assistant for tutors specializing in electronics and digital circuits.
      Your goal is to help the tutor provide better guidance to their students.
      You can suggest teaching approaches, provide technical information, and help prepare explanations.
      Focus on being concise, accurate, and helpful to the tutor's specific needs.`;
    }
    
    promptContent += `Always be helpful, clear, and provide step-by-step explanations when teaching concepts.
    If asked about circuit designs, explain the principles and components clearly.`;
    
    const systemPrompt: OpenRouterRequestMessage = {
      role: 'system',
      content: promptContent
    };
    
    return [systemPrompt];
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'student',
      senderName: user?.name || 'Student',
      senderAvatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
      content: newMessage,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Sử dụng API để lấy phản hồi từ AI thay vì mô phỏng
    setIsAITyping(true);
    setAiResponseText('');
    
    try {
      // Chuẩn bị tin nhắn cho API
      const contextMessages = createContextMessages();
      const historyMessages = formatMessagesForAPI(messages);
      const currentMessage: OpenRouterRequestMessage = {
        role: 'user',
        content: newMessage
      };
      
      console.log("Preparing messages for API:", {
        contextMessages,
        historyMessages,
        currentMessage
      });
      
      const apiMessages = [...contextMessages, ...historyMessages, currentMessage];
      
      let responseText = '';
      // Để có hiệu ứng đánh máy, sử dụng streaming API
      await streamMessageFromOpenRouter(
        apiMessages,
        selectedModel?.id || 'anthropic/claude-3-sonnet',
        (chunk) => {
          console.log("Chunk received in callback:", chunk);
          responseText += chunk;
          setAiResponseText(responseText);
        }
      );
      
      console.log("Received full response:", responseText);
      
      // Kiểm tra nếu phản hồi trống
      if (!responseText.trim()) {
        console.warn("Empty response received, using fallback message");
        responseText = "Sorry, I can't provide an answer at the moment. Please try again later.";
      }
      
      // Khi streaming kết thúc, tạo tin nhắn AI hoàn chỉnh
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        senderName: selectedModel?.name || 'ILLUMA',
        senderAvatar: '/placeholder.svg',
        content: responseText,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      
      // Hiển thị thông báo lỗi 
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        senderName: 'System',
        senderAvatar: '/placeholder.svg',
        content: 'Sorry, I encountered an error while processing your request. Please try again later.',
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsAITyping(false);
    }
  };

  const startNewChat = () => {
    setCurrentChat('new');
    setMessages([{
      id: '1',
      sender: 'ai',
      senderName: selectedModel?.name || 'ILLUMA',
      senderAvatar: '/placeholder.svg',
      content: `Hello! I am ${selectedModel?.name || 'ILLUMA'}. How can I help you today?`,
      timestamp: new Date().toISOString()
    }]);
  };

  const selectChat = (chatId: string) => {
    setCurrentChat(chatId);
    // In a real app, we would load the chat history here
    const mockMessages: Message[] = [
      {
        id: '1',
        sender: 'ai',
        senderName: selectedModel?.name || 'ILLUMA',
        senderAvatar: '/placeholder.svg',
        content: `Hello! I am ${selectedModel?.name || 'ILLUMA'}. How can I help you today?`,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: '100',
        sender: 'student',
        senderName: user?.name || 'Student',
        senderAvatar: user?.avatar || 'https://i.pravatar.cc/150?img=1',
        content: 'How to design a JK flip-flop circuit?',
        timestamp: new Date(Date.now() - 2400000).toISOString()
      },
      {
        id: '101',
        sender: 'ai',
        senderName: selectedModel?.name || 'ILLUMA',
        senderAvatar: '/placeholder.svg',
        content: 'To design a JK flip-flop circuit, you need to follow these steps:\n\n1. Understand the operation of the JK flip-flop\n2. Connect NAND gates to create a basic circuit\n3. Add a clock input\n4. Connect the output Q and Q̅\n\nDo you want me to explain each step in detail?',
        timestamp: new Date(Date.now() - 2300000).toISOString()
      }
    ];
    setMessages(mockMessages);
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="h-full flex overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Custom chat header for tutor mode */}
        {!tutorMode && (
          <div className="flex items-center gap-3 bg-white p-4 border-b border-border">
            <div className="flex-1">
              <h3 className="font-medium text-lg">
                {realTutorMode ? 'Real Tutor' : (practiceMode ? 'Practice Mode' : 'ILLUMA Assistant')}
              </h3>
              <p className="text-xs text-muted-foreground">{currentCourse?.title}</p>
            </div>
            
            {/* New chat button moved to header */}
            {!courseMode && !tutorMode && !practiceMode && !realTutorMode && (
              <button 
                onClick={startNewChat}
                className="bg-tutu-600 text-black rounded-lg py-2 px-3 flex items-center gap-2 hover:bg-tutu-700 transition-colors text-sm"
              >
                <Sparkles size={14} />
                <span>New chat</span>
              </button>
            )}
          </div>
        )}
        
        {/* Different interfaces based on mode */}
        {practiceMode ? (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-4">Practice Mode</h3>
                <p className="text-muted-foreground mb-6">
                  Practice mode allows you to work on exercises and receive instant feedback.
                </p>
                
                <div className="space-y-4 mb-6">
                  <div className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium mb-2">Exercise: Design a JK Flip-flop</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      Design a JK Flip-flop using NAND gates and explain its operation principle.
                    </p>
                    <button className="bg-tutu-600 text-white rounded-lg py-2 px-4 text-sm">
                      Start Exercise
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : realTutorMode ? (
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-3xl mx-auto">
              <div className="bg-white border border-border rounded-lg p-6 shadow-sm">
                <h3 className="font-medium text-lg mb-4">Connect with Real Tutor</h3>
                <p className="text-muted-foreground mb-6">
                  You will be connected with a real tutor for assistance.
                </p>
                
                <div className="flex items-center p-4 bg-gray-50 rounded-lg mb-4">
                  <div className="w-12 h-12 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-600 flex-shrink-0">
                    <User size={20} />
                  </div>
                  <div className="ml-4">
                    <h4 className="font-medium">Dr. John Smith</h4>
                    <p className="text-sm text-muted-foreground">Electronics Department Professor</p>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 rounded-full bg-green-500 mr-2"></div>
                      <span className="text-xs text-green-600">Online</span>
                    </div>
                  </div>
                  <button className="ml-auto px-4 py-2 bg-tutu-600 text-white text-sm rounded-lg">
                    Connect Now
                  </button>
                </div>
                
                <p className="text-xs text-muted-foreground">
                  Average response time: 2-3 minutes. If the tutor doesn't respond within 5 minutes, 
                  you can switch to AI Tutor for immediate assistance.
                </p>
              </div>
            </div>
          </div>
        ) : (
          // Chat messages
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="max-w-3xl mx-auto space-y-6">
              {messages.map(message => (
                <div 
                  key={message.id} 
                  className={`flex items-start gap-4 ${
                    // For tutor mode, adjust the message appearance
                    tutorMode 
                      ? (message.sender === 'student' 
                          ? '' 
                          : 'justify-end')
                      : (message.sender === 'student' 
                          ? 'justify-end' 
                          : '')
                  }`}
                >
                  {/* Avatar for AI or student (in tutor mode) */}
                  {((message.sender !== 'student' && !tutorMode) || 
                    (message.sender === 'student' && tutorMode)) && (
                    <div className="w-8 h-8 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-600 flex-shrink-0 mt-1">
                      {message.sender === 'ai' ? <Bot size={18} /> : <User size={18} />}
                    </div>
                  )}
                  
                  <div className={`flex flex-col max-w-[80%] ${
                    tutorMode 
                      ? (message.sender === 'student' 
                          ? 'items-start' 
                          : 'items-end')
                      : (message.sender === 'student' 
                          ? 'items-end' 
                          : 'items-start')
                  }`}>
                    <div className={`${
                      tutorMode
                        ? (message.sender === 'student'
                            ? 'bg-white border border-border'
                            : 'bg-tutu-600 text-black')
                        : (message.sender === 'student' 
                            ? 'bg-tutu-600 text-black' 
                            : message.sender === 'ai' 
                              ? 'bg-white border border-border' 
                              : 'bg-gray-200')
                      } rounded-lg px-4 py-3 shadow-sm`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                  
                  {/* Avatar for tutor (when in tutor mode) or student (when not in tutor mode) */}
                  {((message.sender === 'student' && !tutorMode) || 
                    (message.sender !== 'student' && tutorMode)) && (
                    <div className="w-8 h-8 rounded-full bg-tutu-600 flex items-center justify-center text-black flex-shrink-0 mt-1">
                      <User size={18} />
                    </div>
                  )}
                </div>
              ))}
              
              {isAITyping && (
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-600 flex-shrink-0 mt-1">
                    <Bot size={18} />
                  </div>
                  
                  <div className="flex flex-col max-w-[80%]">
                    <div className="bg-white border border-border rounded-lg px-4 py-3 shadow-sm">
                      {aiResponseText ? (
                        <div className="whitespace-pre-line">{aiResponseText}</div>
                      ) : (
                        <div className="typing-indicator">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          </div>
        )}
        
        {/* Message input */}
        <div className="bg-white p-4 border-t border-border">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white border border-border rounded-xl shadow-sm">
              <div className="flex items-end">
                <textarea
                  ref={textareaRef}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder={
                    tutorMode 
                      ? "Type your question to AI assistant..." 
                      : (realTutorMode 
                          ? "Type your question for the tutor..." 
                          : "Type a message...")
                  }
                  className="flex-1 border-0 bg-transparent max-h-[200px] p-3 text-sm focus:ring-0 resize-none"
                  rows={1}
                  disabled={isAITyping}
                />
                <div className="p-2 flex gap-2">
                  <button
                    type="button"
                    className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <PaperclipIcon size={16} className="text-gray-500" />
                  </button>
                  <button
                    type="button"
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || isAITyping}
                    className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      newMessage.trim() && !isAITyping
                        ? 'bg-tutu-600 text-white hover:bg-tutu-700'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
            {tutorMode && (
              <p className="text-xs text-center text-muted-foreground mt-2">
                Ask questions about teaching approaches, technical concepts, or student guidance.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
