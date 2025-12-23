import React, { useEffect } from 'react';
import ChatComponent from '../components/chat/Chat';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

interface ChatProps {
  courseMode?: boolean;
  practiceMode?: boolean;
  realTutorMode?: boolean;
}

const Chat: React.FC<ChatProps> = (props) => {
  const { courseId, chatId } = useParams();
  const navigate = useNavigate();
  
  const goBack = () => {
    if (courseId) {
      navigate(`/courses/${courseId}`);
    } else {
      navigate('/chats');
    }
  };

  // Redirect từ /chats/new đến /chats với state mới
  useEffect(() => {
    if (chatId === 'new') {
      // Không cần chuyển hướng, chỉ cần truyền state mới đến ChatComponent
      console.log('Starting new chat');
    }
  }, [chatId, navigate]);
  
  return (
    <div className="h-screen flex flex-col">
      {props.courseMode && (
        <div className="p-2 border-b flex items-center">
          <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
            <ChevronLeft size={16} className="mr-1" />
            <span>Back to Course</span>
          </Button>
        </div>
      )}
      <div className={`flex-1 overflow-hidden ${!props.courseMode ? 'h-full' : ''}`}>
        <ChatComponent {...props} chatId={chatId} />
      </div>
    </div>
  );
};

export default Chat; 