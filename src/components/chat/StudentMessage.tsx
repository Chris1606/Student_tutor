import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import Markdown from 'react-markdown';

// Format timestamp string to more user-friendly display
const formatTimestamp = (timestamp: string): string => {
  try {
    const date = new Date(timestamp);
    
    // If invalid date, return the original string
    if (isNaN(date.getTime())) return timestamp;
    
    // If today, return the time in HH:MM format
    const now = new Date();
    const today = now.toDateString() === date.toDateString();
    
    if (today) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Otherwise, return relative time (e.g., "2 days ago")
    return formatDistanceToNow(date, { addSuffix: true });
  } catch (error) {
    return timestamp;
  }
};

interface StudentMessageProps {
  content: string;
  timestamp: string;
  sender: 'student' | 'tutor' | 'ai';
  senderName: string;
  senderAvatar: string;
  isTutorView?: boolean;
}

const StudentMessage: React.FC<StudentMessageProps> = ({
  content,
  timestamp,
  sender,
  senderName,
  senderAvatar,
  isTutorView = false
}) => {
  const isOutgoing = (isTutorView && sender === 'tutor') || (!isTutorView && sender === 'student');
  const isAI = sender === 'ai';
  
  const formattedTimestamp = formatTimestamp(timestamp);
  
  return (
    <div className={cn(
      "flex items-start gap-2.5 max-w-full",
      isOutgoing && "flex-row-reverse"
    )}>
      {/* Avatar */}
      {isAI ? (
        <div className="flex-shrink-0 h-8 w-8 rounded-full bg-tutu-100 flex items-center justify-center">
          <Bot size={16} className="text-tutu-600" />
        </div>
      ) : (
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={senderAvatar} alt={senderName} />
          <AvatarFallback className="text-xs">
            {senderName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={cn(
        "flex flex-col max-w-[85%]",
        isOutgoing && "items-end"
      )}>
        {/* Sender name - show only if not outgoing */}
        {!isOutgoing && (
          <div className="flex items-center gap-1">
            <span className="text-xs font-medium">{senderName}</span>
            {isAI && (
              <span className="text-[10px] bg-tutu-100 text-tutu-700 px-1 py-0.5 rounded">AI Tutor</span>
            )}
          </div>
        )}
        
        {/* Message bubble */}
        <div className={cn(
          "rounded-xl p-3 max-w-full",
          isOutgoing 
            ? "bg-tutu-500 text-black rounded-tr-none" 
            : isAI 
              ? "bg-tutu-50 text-gray-800 border border-tutu-100 rounded-tl-none" 
              : "bg-gray-100 text-gray-800 rounded-tl-none"
        )}>
          <div className={cn(
            "text-sm break-words",
            "prose prose-sm max-w-none",
            isOutgoing && "prose-invert"
          )}>
            {content.includes('\n') || content.includes('**') || content.includes('- ') ? (
              <Markdown>{content}</Markdown>
            ) : (
              <p className="m-0">{content}</p>
            )}
          </div>
        </div>
        
        {/* Timestamp */}
        <span className={cn(
          "text-[10px] text-gray-500 mt-0.5",
          isOutgoing && "text-right"
        )}>
          {formattedTimestamp}
        </span>
      </div>
    </div>
  );
};

export default StudentMessage; 