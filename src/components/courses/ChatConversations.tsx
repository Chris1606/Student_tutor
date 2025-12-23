import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Bot, User, Clock, Eye, ChevronLeft } from 'lucide-react';
import { ChatSession } from '@/api/chatService';

interface ChatConversationsProps {
  chatSessions: ChatSession[];
  selectedChat: ChatSession | null;
  onSelectChat: (chat: ChatSession | null) => void;
  onGoBack: () => void;
  formatTime: (timestamp: string) => string;
  formatTimeShort: (timestamp: string) => string;
}

const ChatConversations: React.FC<ChatConversationsProps> = ({
  chatSessions,
  selectedChat,
  onSelectChat,
  onGoBack,
  formatTime,
  formatTimeShort
}) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-white border border-border rounded-xl shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-border bg-gradient-to-r from-tutu-50 to-tutu-100">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="p-3 bg-white rounded-full shadow-sm"
            >
              <Bot size={24} className="text-tutu-600" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">AI Tutor Conversations</h1>
              <p className="text-muted-foreground">
                View all AI tutoring sessions
              </p>
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onGoBack}
            className="px-4 py-2 border border-border rounded-lg text-sm hover:bg-tutu-50 transition-colors flex items-center gap-2"
          >
            <ChevronLeft size={16} />
            Back to course
          </motion.button>
        </div>
      </div>
      
      {/* Nội dung */}
      <div className="p-6">
        {selectedChat ? (
          // Chi tiết cuộc trò chuyện
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <motion.button 
                  whileHover={{ x: -5 }}
                  onClick={() => onSelectChat(null)}
                  className="mb-4 flex items-center gap-2 text-tutu-600 hover:underline"
                >
                  <ChevronLeft size={16} />
                  <span>Back to conversations list</span>
                </motion.button>
                <h2 className="text-xl font-semibold">{selectedChat.title}</h2>
                <p className="text-muted-foreground text-sm">
                  <Clock className="inline-block mr-1 h-3 w-3" />
                  {formatTime(selectedChat.createdAt)}
                </p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
                  }
                }}
                className="px-3 py-2 text-sm border border-tutu-200 rounded-lg flex items-center gap-2 hover:bg-tutu-50 text-tutu-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5v14M5 12l7 7 7-7"/>
                </svg>
                <span>Scroll to Bottom</span>
              </motion.button>
            </div>
            
            <div className="space-y-6 mt-6 overflow-y-auto max-h-[60vh] pr-2 chat-conversation rounded-lg bg-gray-50 p-4" style={{ scrollbarWidth: 'thin' }} ref={chatContainerRef}>
              {selectedChat.messages.map((message, idx) => (
                <motion.div 
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1, duration: 0.3 }}
                  className={`flex gap-4 ${message.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                >
                  {message.sender !== 'student' && (
                    <div className="w-10 h-10 rounded-full bg-tutu-100 flex items-center justify-center text-tutu-600 shadow-sm">
                      {message.sender === 'ai' ? <Bot size={20} /> : <User size={20} />}
                    </div>
                  )}
                  
                  <div className={`max-w-[80%] ${message.sender === 'student' ? 'items-end text-right' : 'items-start'}`}>
                    <div className="text-xs text-muted-foreground mb-1">
                      {message.sender === 'student' ? 'Student' : message.senderName} • {formatTime(message.timestamp)}
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className={`rounded-lg px-4 py-3 message-bubble shadow-sm ${
                        message.sender === 'student' 
                          ? 'bg-tutu-600 text-black' 
                          : 'bg-white'
                      }`}
                    >
                      <div className="whitespace-pre-line">{message.content}</div>
                    </motion.div>
                  </div>
                  
                  {message.sender === 'student' && (
                    <div className="w-10 h-10 rounded-full bg-tutu-600 flex items-center justify-center text-black shadow-sm">
                      <User size={20} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          // Danh sách các cuộc trò chuyện
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-semibold mb-6">Active AI Conversations</h2>
            
            {chatSessions.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="text-center p-10 bg-gray-50 rounded-lg border border-dashed border-gray-300"
              >
                <Bot size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium mb-2">No AI conversations yet</h3>
                <p className="text-muted-foreground">Students haven't had any conversations with AI Tutor in this course yet.</p>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto max-h-[70vh] pr-2 chat-list" style={{ scrollbarWidth: 'thin' }}>
                {chatSessions.map((session, idx) => {
                  // Lấy tin nhắn đầu và cuối để hiển thị preview
                  const firstMessage = session.messages[0];
                  const lastMessage = session.messages[session.messages.length - 1];
                  
                  return (
                    <motion.div 
                      key={session.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1, duration: 0.4 }}
                      whileHover={{ 
                        y: -5, 
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" 
                      }}
                      className="border border-border rounded-lg p-4 hover:border-tutu-300 transition-all cursor-pointer bg-white"
                      onClick={() => onSelectChat(session)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium text-lg truncate pr-2">{session.title}</h3>
                        <span className="bg-tutu-100 text-tutu-600 text-xs px-2 py-1 rounded-full">
                          {session.messages.length} messages
                        </span>
                      </div>
                      
                      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
                        <Clock size={12} className="inline" />
                        {formatTimeShort(session.createdAt)}
                      </p>
                      
                      <div className="border-l-2 border-gray-200 pl-3 text-sm text-muted-foreground mb-2 line-clamp-2">
                        {firstMessage.content}
                      </div>
                      
                      {session.messages.length > 1 && (
                        <div className="border-l-2 border-tutu-600 pl-3 text-sm line-clamp-2">
                          <p className="text-xs font-medium mb-1">Last message:</p>
                          {lastMessage.content}
                        </div>
                      )}
                      
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full mt-3 flex items-center justify-center gap-2 text-tutu-600 text-sm border border-tutu-200 rounded-lg p-2 hover:bg-tutu-50"
                      >
                        <Eye size={16} />
                        View conversation
                      </motion.button>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatConversations; 