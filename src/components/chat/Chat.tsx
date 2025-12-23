import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Settings, Bot, User, Sparkles } from 'lucide-react';
import ChatInterface from './ChatInterface';
import RightPanel from '../layout/RightPanel';
import { useApp } from '@/context/AppContext';
import { AVAILABLE_MODELS } from '@/api/openrouter';

interface ChatProps {
  courseMode?: boolean;
  practiceMode?: boolean;
  realTutorMode?: boolean;
  chatId?: string;
}

const Chat: React.FC<ChatProps> = ({ courseMode = false, practiceMode = false, realTutorMode = false, chatId }) => {
  const params = useParams();
  const routeChatId = params.chatId || chatId; // Lấy chatId từ route params hoặc từ props
  const { setChatHistoryVisible } = useApp();
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [showModelSelect, setShowModelSelect] = useState(false);
  const [isNewChat, setIsNewChat] = useState(false);

  // Kiểm tra xem có phải là yêu cầu tạo chat mới không
  useEffect(() => {
    setIsNewChat(routeChatId === 'new');
  }, [routeChatId]);

  // Kích hoạt hiển thị chat history khi component được tạo
  useEffect(() => {
    // Chỉ hiển thị chat history nếu không trong chế độ khóa học hoặc tutor
    if (!courseMode && !realTutorMode) {
      setChatHistoryVisible(true);
    }
    
    return () => {
      // Ẩn chat history khi rời khỏi trang
      setChatHistoryVisible(false);
    };
  }, [courseMode, realTutorMode, setChatHistoryVisible]);

  // Hàm tạo cuộc trò chuyện mới
  const startNewChat = () => {
    // Xử lý logic tạo cuộc trò chuyện mới (sẽ triển khai trong ChatInterface)
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="h-16 border-b border-border flex items-center justify-between px-4">
        {/* Left side - Model selector */}
        <div className="flex items-center gap-4">
          {!courseMode && !realTutorMode && (
            <div className="relative">
              <button
                onClick={() => setShowModelSelect(!showModelSelect)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium">{selectedModel.name}</span>
                <Settings size={14} />
              </button>

              {/* Model selection dropdown */}
              {showModelSelect && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white border border-border rounded-lg shadow-lg z-10">
                  <div className="p-2">
                    {AVAILABLE_MODELS.map((model) => (
                      <button
                        key={model.id}
                        onClick={() => {
                          setSelectedModel(model);
                          setShowModelSelect(false);
                        }}
                        className="w-full text-left p-2 rounded text-sm hover:bg-gray-50 transition-colors"
                      >
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </button>
                    ))}
                  </div>

                  <div className="p-2 border-t border-border">
                    <button className="w-full text-left p-2 rounded text-sm flex items-center gap-2 text-muted-foreground hover:bg-gray-50 transition-colors">
                      <Settings size={14} />
                      <span>Customize model</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right side - Show tutor status if in real tutor mode */}
        {realTutorMode && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-tutu-100 flex items-center justify-center">
              <User size={16} className="text-tutu-600" />
            </div>
            <span className="text-sm">Tutor is online</span>
          </div>
        )}
      </div>

      {/* Chat interface */}
      <div className="flex-1 overflow-hidden">
        <ChatInterface 
          selectedModel={courseMode ? undefined : selectedModel} 
          courseMode={courseMode}
          practiceMode={practiceMode}
          realTutorMode={realTutorMode}
          isNewChat={isNewChat}
          chatId={routeChatId !== 'new' ? routeChatId : undefined}
        />
      </div>
    </div>
  );
};

export default Chat; 