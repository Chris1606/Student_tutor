import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { 
  ChevronLeft, Clock, Send, 
  MessageSquare, SendHorizontal, Bot
} from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import StudentMessage from './StudentMessage';
import { MOCK_STUDENTS, STUDENT_MESSAGES } from './TutorChat';
import TypingIndicator from './TypingIndicator';

interface StudentChatProps {
  selectedStudent: string | null;
  courseId: string;
  isMobileView: boolean;
  showChatList: boolean;
  setShowChatList: (show: boolean) => void;
  aiConversations?: Record<string, {studentMessage: string, aiResponse: string, timestamp: string}[]>;
}

const StudentChat: React.FC<StudentChatProps> = ({
  selectedStudent,
  courseId,
  isMobileView,
  showChatList,
  setShowChatList,
  aiConversations = {}
}) => {
  const [newMessage, setNewMessage] = useState('');
  const [currentMessages, setCurrentMessages] = useState<typeof STUDENT_MESSAGES[string]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  // Load messages for selected student, including AI conversations if available
  useEffect(() => {
    if (selectedStudent) {
      // Start with original messages
      let messages = [...(STUDENT_MESSAGES[selectedStudent] || [])];
      
      // Xử lý đặc biệt cho student26 - thêm câu trả lời AI tutor trực tiếp
      if (selectedStudent === 'student26') {
        const ethanQuestion = "Could you explain the concept of metastability in flip-flops? I'm working on cross-domain clock designs and need to understand it better.";
        const ethanResponse = "Metastability in flip-flops occurs when input signals violate setup/hold timing requirements, causing the output to enter an unstable state between logic levels. This is critical in cross-domain clock designs where signals cross between different clock domains. To prevent metastability failures, always use synchronizers with at least two D flip-flops in series, which exponentially reduces the probability of metastability persisting. For your cross-domain clock design, implement proper synchronization circuits and ensure adequate timing margins.";
        
        // Tìm câu hỏi metastability trong tin nhắn
        const questionExists = messages.some(
          msg => msg.sender === 'student' && msg.content.includes("metastability")
        );
        
        // Kiểm tra xem câu trả lời AI đã có chưa
        const responseExists = messages.some(
          msg => msg.sender === 'ai' && msg.content.includes("Metastability in flip-flops occurs")
        );
        
        console.log("Ethan Nguyen processing - question exists:", questionExists, "response exists:", responseExists);
        
        // Luôn thêm câu trả lời nếu có câu hỏi và chưa có câu trả lời 
        // (không phụ thuộc vào aiConversations)
        if (questionExists && !responseExists) {
          console.log("Adding AI metastability response for Ethan - FORCED");
          
          // Thêm một đối tượng tin nhắn mới cho câu trả lời AI
          messages.push({
            id: `ai-tutor-metastability-${Date.now()}`,
            content: ethanResponse,
            timestamp: new Date().toISOString(),
            sender: 'ai',
            senderName: 'AI Tutor',
            senderAvatar: '',
          });
        }
      }
      
      // Add AI conversation if available for this student
      if (aiConversations && aiConversations[selectedStudent] && aiConversations[selectedStudent].length > 0) {
        console.log("Processing AI conversations for student:", selectedStudent, aiConversations[selectedStudent]);
        
        // Sort AI conversation by timestamp
        const aiMessages = aiConversations[selectedStudent]
          .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        
        // Add each AI conversation as a student message followed by an AI response
        aiMessages.forEach(conv => {
          // Skip for Ethan's metastability question which we handled specially above
          if (selectedStudent === 'student26' && 
              conv.studentMessage && conv.studentMessage.includes("metastability") && 
              conv.aiResponse && conv.aiResponse.includes("Metastability in flip-flops occurs")) {
            console.log("Skipping already handled metastability question");
            return;
          }
          
          // Check if this student message is already in our messages array
          const studentMessageExists = messages.some(
            msg => msg.sender === 'student' && msg.content === conv.studentMessage
          );
          
          // Add student message if not already in the array
          if (!studentMessageExists) {
            messages.push({
              id: `ai-student-${Date.now()}-${Math.random()}`,
              content: conv.studentMessage,
              timestamp: conv.timestamp,
              sender: 'student',
              senderName: MOCK_STUDENTS.find(s => s.id === selectedStudent)?.name || 'Student',
              senderAvatar: MOCK_STUDENTS.find(s => s.id === selectedStudent)?.avatar || '',
            });
          }
          
          // Check if this AI response is already in our messages array
          const aiResponseExists = messages.some(
            msg => msg.sender === 'ai' && msg.content === conv.aiResponse
          );
          
          // Add AI tutor response if not already in the array
          if (!aiResponseExists) {
            messages.push({
              id: `ai-tutor-${Date.now()}-${Math.random()}`,
              content: conv.aiResponse,
              timestamp: conv.timestamp,
              sender: 'ai',
              senderName: 'AI Tutor',
              senderAvatar: '', // Use blank avatar for AI
            });
          }
        });
        
        // Sort all messages by timestamp to ensure correct order
        messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      }
      
      setCurrentMessages(messages);
      console.log("Updated messages:", messages);
    }
  }, [selectedStudent, aiConversations]);

  // Send message handler
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedStudent) return;
    
    // Show typing indicator
    setIsTyping(true);
    
    // Simulate delay for typing
    setTimeout(() => {
      const newMsg = {
        id: Date.now().toString(),
        content: newMessage,
        timestamp: new Date().toISOString(),
        sender: 'tutor' as const,
        senderName: 'Dr. Nguyen Tuan Anh',
        senderAvatar: 'https://i.pravatar.cc/150?img=10',
      };
      
      setCurrentMessages(prev => [...prev, newMsg]);
      setNewMessage('');
      setIsTyping(false);
    }, 1000);
  };

  // Send greeting message
  const handleSendGreeting = () => {
    if (!selectedStudent) return;
    
    const greetingMessage = {
      id: Date.now().toString(),
      content: `Hello ${MOCK_STUDENTS.find(s => s.id === selectedStudent)?.name}, how may I help you with your coursework today?`,
      timestamp: new Date().toISOString(),
      sender: 'tutor' as const,
      senderName: 'Dr. Nguyen Tuan Anh',
      senderAvatar: 'https://i.pravatar.cc/150?img=10',
    };
    
    setCurrentMessages([greetingMessage]);
  };

  // If no student is selected, show empty state
  if (!selectedStudent) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="h-16 w-16 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mx-auto mb-4">
            <MessageSquare size={24} />
          </div>
          <h3 className="text-lg font-medium mb-2">Select a student to start</h3>
          <p className="text-gray-500 max-w-md">
            Select a student from the list to start a conversation and support them with their studies.
          </p>
        </div>
      </div>
    );
  }

  // Find student details
  const student = MOCK_STUDENTS.find(s => s.id === selectedStudent);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Chat header - simplified */}
      <div className="h-14 border-b border-border flex items-center px-3 bg-white sticky top-0 z-10">
        {isMobileView && !showChatList && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 h-8 w-8" 
            onClick={() => setShowChatList(true)}
          >
            <ChevronLeft size={16} />
          </Button>
        )}
        
        <div className="flex items-center gap-2">
          <UserAvatar
            src={student?.avatar}
            alt={student?.name || ''}
            size="sm"
            online={student?.online}
            className="ring-1 ring-offset-1 ring-tutu-100"
          />
          
          <div>
            <h3 className="font-medium text-sm">
              {student?.name}
            </h3>
            <div className="flex items-center text-xs text-gray-500">
              <span>{student?.course}</span>
              <span className="mx-1.5 text-gray-300">•</span>
              <span className="flex items-center gap-0.5">
                <Clock size={10} />
                {student?.online ? 'Active' : 'Recently Active'}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Chat content with custom scrollbar */}
      <div className="flex-1 overflow-y-auto py-3 px-4 space-y-3 bg-gray-50 custom-scrollbar max-h-[calc(100vh-180px)]" style={{
        scrollbarWidth: 'thin',
        scrollbarColor: '#6941C6 #f5f3ff'
      }}>
        <style dangerouslySetInnerHTML={{ __html: `
          .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: #f5f3ff;
            border-radius: 8px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: #9f7aea;
            border-radius: 8px;
            border: 2px solid #f5f3ff;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background-color: #6941C6;
          }
          .custom-scrollbar {
            padding-right: 4px;
          }
          
          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-slideInUp {
            animation: slideInUp 0.3s ease-out forwards;
          }
        `}} />
        
        {currentMessages.length > 0 ? (
          <div className="flex flex-col mb-4">
            {currentMessages.map((message) => (
              <div key={message.id} className="mb-4 last:mb-0 animate-slideInUp">
                <StudentMessage
                  content={message.content}
                  timestamp={message.timestamp}
                  sender={message.sender}
                  senderName={message.senderName}
                  senderAvatar={message.senderAvatar}
                  isTutorView={true}
                />
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-4 animate-slideInUp">
                <TypingIndicator isTutorView={true} />
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="w-14 h-14 rounded-full bg-tutu-50 flex items-center justify-center mb-3">
              <MessageSquare size={20} className="text-tutu-600" />
            </div>
            <h3 className="text-base font-medium mb-1">No messages yet</h3>
            <p className="text-sm text-gray-500 max-w-md mb-3">
              Start a conversation by sending the first message.
            </p>
            <Button 
              variant="outline" 
              size="sm"
              className="text-sm border-tutu-200 text-tutu-700 hover:bg-tutu-50"
              onClick={handleSendGreeting}
            >
              <SendHorizontal size={14} className="mr-1.5" />
              Send Greeting
            </Button>
          </div>
        )}
      </div>
      
      {/* Message input - simplified */}
      <div className="p-3 border-t border-border bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-end bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <textarea 
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Enter message for the student..."
              className="flex-1 border-0 resize-none p-3 focus:outline-none focus:ring-0 max-h-32 text-sm"
              rows={1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            
            <div className="p-1.5">
              <Button 
                size="sm"
                variant="default"
                className={cn(
                  "rounded-full h-8 w-8 bg-tutu-600 hover:bg-tutu-700",
                  !newMessage.trim() && "opacity-50 cursor-not-allowed"
                )}
                disabled={!newMessage.trim()}
                onClick={handleSendMessage}
              >
                <Send size={14} />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentChat; 