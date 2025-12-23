import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { getAIResponse } from '@/services/openRouterService';
import { toast } from 'sonner';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  role?: 'user' | 'assistant';
}

interface AIChatPanelProps {
  isVisible: boolean;
  onClose: () => void;
  question: string;
  currentTopic?: string;
  difficulty?: string;
  type?: string;
  explanation?: string;
  circuitType?: string;
}

const AIChatPanel: React.FC<AIChatPanelProps> = ({
  isVisible,
  onClose,
  question,
  currentTopic,
  difficulty,
  type,
  explanation,
  circuitType
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastQuestionRef = useRef<string>(question);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Reset messages when question changes
  useEffect(() => {
    if (question !== lastQuestionRef.current) {
      setMessages([]);
      lastQuestionRef.current = question;
    }
  }, [question]);

  const getInitialAIResponse = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const initialQuestion = `Hãy hướng dẫn tôi giải bài tập sau: ${question}`;
      
      const response = await getAIResponse(initialQuestion, {
        currentTopic,
        difficulty,
        type,
        circuitType,
        previousMessages: []
      });

      const aiMessage: Message = {
        id: Date.now().toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        role: 'assistant'
      };

      setMessages([aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
      setError(errorMessage);
      toast.error('Không thể kết nối với AI Assistant: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isVisible && messages.length === 0) {
      getInitialAIResponse();
    }
  }, [isVisible, question]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      role: 'user'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError(null);

    try {
      const previousMessages = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }));

      const response = await getAIResponse(inputMessage, {
        currentTopic,
        difficulty,
        type,
        circuitType,
        previousMessages
      });

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'ai',
        timestamp: new Date(),
        role: 'assistant'
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error getting AI response:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unexpected error occurred';
      setError(errorMessage);
      toast.error('Không thể kết nối với AI Assistant: ' + errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed right-0 top-0 h-full w-[400px] bg-white border-l border-gray-200 flex flex-col shadow-lg z-50"
          style={{
            marginLeft: 'auto'
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-blue-600" />
              <h3 className="font-medium">AI Assistant</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
                {error}
                <Button
                  onClick={getInitialAIResponse}
                  variant="ghost"
                  size="sm"
                  className="mt-2 w-full"
                >
                  Thử lại
                </Button>
              </div>
            )}
            {messages.map(message => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-start"
              >
                <div className="bg-gray-100 rounded-lg p-3">
                  <Loader2 className="w-5 h-5 animate-spin text-gray-600" />
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Nhập tin nhắn..."
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !inputMessage.trim()}
                size="icon"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AIChatPanel; 