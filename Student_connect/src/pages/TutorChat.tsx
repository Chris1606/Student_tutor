import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TutorChatComponent from '@/components/chat/TutorChat';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const TutorChat = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(`/courses/${courseId}`);
  };
  
  return (
    <div className="h-screen flex flex-col">
      <div className="p-2 border-b flex items-center">
        <Button variant="ghost" size="sm" onClick={goBack} className="mr-2">
          <ChevronLeft size={16} className="mr-1" />
          <span>Back to Course</span>
        </Button>
      </div>
      <div className="flex-1 overflow-hidden">
        <TutorChatComponent courseId={courseId || 'course1'} />
      </div>
    </div>
  );
};

export default TutorChat; 