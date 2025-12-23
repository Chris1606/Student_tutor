import React from 'react';
import { UserAvatar } from '@/components/ui/avatar';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TypingIndicatorProps {
  children?: React.ReactNode;
  isTutorView?: boolean;
  showAvatar?: boolean;
  className?: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  children,
  isTutorView = false,
  showAvatar = true,
  className
}) => {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .typing-dots {
          display: inline-flex;
          align-items: center;
          column-gap: 4px;
          height: 24px;
        }
        
        .typing-dots span {
          display: inline-block;
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background-color: #d1d5db;
          animation: typingAnimation 1.4s infinite ease-in-out both;
        }
        
        .typing-dots span:nth-child(1) {
          animation-delay: -0.32s;
        }
        
        .typing-dots span:nth-child(2) {
          animation-delay: -0.16s;
        }
        
        @keyframes typingAnimation {
          0%, 80%, 100% { 
            transform: scale(0);
          }
          40% { 
            transform: scale(1);
          }
        }
      `}} />
      
      <div className={cn("flex items-start gap-3", className)}>
        {showAvatar && !isTutorView && (
          <div className="flex-shrink-0 mt-1">
            <UserAvatar
              size="sm"
              className="bg-tutu-100"
              fallback={<Bot className="w-4 h-4 text-tutu-600" />}
            />
          </div>
        )}
        
        <div className="flex flex-col items-start">
          <div className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 shadow-sm">
            {children ? children : (
              <div className="typing-dots inline-flex">
                <span></span>
                <span></span>
                <span></span>
              </div>
            )}
          </div>
        </div>
        
        {showAvatar && isTutorView && (
          <div className="flex-shrink-0 mt-1">
            <UserAvatar
              size="sm"
              className="bg-tutu-600"
              fallback={<Bot className="w-4 h-4 text-white" />}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default TypingIndicator; 