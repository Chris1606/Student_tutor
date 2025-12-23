import React, { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Bot, Sparkles, LoaderCircle, Check, AlertCircle, CheckCircle2, ChevronsUp, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

// Custom CSS animation for border glow and message animations
const animationStyles = `
@keyframes borderGlow {
  0%, 100% { box-shadow: 0 0 0px #f59e0b; }
  50% { box-shadow: 0 0 10px #f59e0b; }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes pendingPulse {
  0% { background-color: rgba(239, 68, 68, 0.2); }
  50% { background-color: rgba(239, 68, 68, 0.4); }
  100% { background-color: rgba(239, 68, 68, 0.2); }
}

@keyframes successFadeIn {
  0% { 
    opacity: 0; 
    transform: scale(0.8);
  }
  70% {
    transform: scale(1.05);
  }
  100% { 
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes typingDots {
  0%, 20% {
    content: ".";
  }
  40%, 60% {
    content: "..";
  }
  80%, 100% {
    content: "...";
  }
}

.typing-animation::after {
  content: "";
  animation: typingDots 1.5s infinite;
}
`;

// Mock pending messages data
const MOCK_PENDING_MESSAGES = [
  {
    id: 'msg1',
    studentName: 'Emily Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    message: 'I need help with Boolean algebra simplification',
  },
  {
    id: 'msg2',
    studentName: 'Ethan Nguyen',
    avatar: 'https://i.pravatar.cc/150?img=26',
    message: 'Could you explain the concept of metastability in flip-flops?',
  },
  {
    id: 'msg3',
    studentName: 'Sophia Martinez',
    avatar: 'https://i.pravatar.cc/150?img=27',
    message: 'I need help debugging my logic circuit simulation',
  },
  {
    id: 'msg4',
    studentName: 'William Jackson',
    avatar: 'https://i.pravatar.cc/150?img=28',
    message: 'Can you review my truth table for correctness?',
  },
];

interface PendingMessageProps {
  message: {
    id: string;
    studentName: string;
    avatar: string;
    message: string;
  };
  index: number;
  answeredMessages: string[];
}

const PendingMessage: React.FC<PendingMessageProps> = ({ message, index, answeredMessages }) => {
  const isAnswered = answeredMessages.includes(message.id);
  const isAnswering = answeredMessages.length === index;
  
  return (
    <div 
      className={`p-3 border rounded-lg mb-2 transition-all duration-300 flex items-start gap-3`}
      style={{
        animation: `slideIn 0.3s ease-out forwards ${index * 0.15}s`,
        opacity: 0,
        backgroundColor: isAnswered ? 'rgba(74, 222, 128, 0.1)' : 
                        isAnswering ? 'rgba(250, 204, 21, 0.1)' : 
                        'rgba(239, 68, 68, 0.15)',
        borderColor: isAnswered ? 'rgba(74, 222, 128, 0.5)' : 
                     isAnswering ? 'rgba(250, 204, 21, 0.5)' : 
                     'rgba(239, 68, 68, 0.3)',
        animationDelay: `${index * 0.15}s`,
      }}
    >
      <div className="flex-shrink-0 w-8 h-8 rounded-full overflow-hidden">
        <img src={message.avatar} alt={message.studentName} className="w-full h-full object-cover" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-medium">{message.studentName}</span>
          <div className={`text-[10px] px-1.5 py-0.5 rounded-full ${
            isAnswered ? 'bg-green-100 text-green-800' : 
            isAnswering ? 'bg-amber-100 text-amber-800' : 
            'bg-red-100 text-red-800'
          }`}>
            {isAnswered ? 'Answered' : isAnswering ? (
              <span className="typing-animation">Answering</span>
            ) : 'Pending'}
          </div>
        </div>
        
        <p className="text-xs text-gray-700 truncate">{message.message}</p>
        
        {isAnswered && (
          <div className="mt-1.5 flex items-center gap-1.5 text-green-600 text-[10px]" 
               style={{animation: 'successFadeIn 0.5s ease-out forwards'}}>
            <Check size={12} />
            <span>AI tutor answered this question</span>
          </div>
        )}
        
        {isAnswering && (
          <div className="mt-1.5 flex items-center gap-1.5 text-amber-600 text-[10px]">
            <LoaderCircle size={12} className="animate-spin" />
            <span className="typing-animation">AI tutor answering</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface CloneAITutorProps {
  courseId: string;
  courseName: string;
  courseMessages?: Array<{
    id: string;
    content: string;
    timestamp: string;
    sender: 'student' | 'tutor' | 'ai';
    senderName: string;
    senderAvatar: string;
  }>;
  onCloneComplete?: (tutorId: string) => void;
}

const CloneAITutor: React.FC<CloneAITutorProps> = ({
  courseId,
  courseName,
  courseMessages = [],
  onCloneComplete
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCloning, setIsCloning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState<'analyzing' | 'training' | 'finalizing'>('analyzing');
  const [cloneComplete, setCloneComplete] = useState(false);
  const [tutorId, setTutorId] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [buttonHover, setButtonHover] = useState(false);

  // Memoize the clone process to prevent unnecessary re-renders
  const handleClone = useCallback(() => {
    setIsCloning(true);
    setProgress(0);
    setCurrentStep('analyzing');
    setError(null);
    
    try {
      // Simulated analysis process
      const analyzeTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(analyzeTimer);
            setCurrentStep('training');
            
            // Start training phase
            const trainingTimer = setInterval(() => {
              setProgress(prev => {
                if (prev >= 100) {
                  clearInterval(trainingTimer);
                  setCurrentStep('finalizing');
                  
                  // Finalize process
                  const finalizingTimer = setInterval(() => {
                    setProgress(prev => {
                      if (prev >= 100) {
                        clearInterval(finalizingTimer);
                        const newTutorId = `tutor-${courseId}-${Date.now()}`;
                        setTutorId(newTutorId);
                        
                        // Complete the cloning without processing messages
                        setTimeout(() => {
                          setCloneComplete(true);
                          if (onCloneComplete) {
                            onCloneComplete(newTutorId);
                          }
                        }, 1000);
                        
                        return 100;
                      }
                      return prev + 5;
                    });
                  }, 100);
                  
                  return 0;
                }
                return prev + 3;
              });
            }, 200);
            
            return 0;
          }
          return prev + 2;
        });
      }, 150);
      
      // Clean up timers if component unmounts
      return () => {
        clearInterval(analyzeTimer);
      };
    } catch (err) {
      setError("An error occurred during the cloning process. Please try again.");
      setIsCloning(false);
    }
  }, [courseId, onCloneComplete]);

  // Reset state when dialog closes
  const handleClose = useCallback(() => {
    if (!isCloning || cloneComplete) {
      setIsOpen(false);
    }
  }, [isCloning, cloneComplete]);

  // Reset all states
  const resetState = useCallback(() => {
    setIsCloning(false);
    setProgress(0);
    setCurrentStep('analyzing');
    setCloneComplete(false);
    setTutorId('');
    setError(null);
  }, []);

  // Create a new clone after completion
  const handleNewClone = useCallback(() => {
    resetState();
    setIsOpen(true);
  }, [resetState]);

  // Cleanup all timers when component unmounts
  useEffect(() => {
    return () => {
      // Cleanup function for any running timers
      resetState();
    };
  }, [resetState]);

  return (
    <>
      {/* Add custom animation */}
      <style>
        {animationStyles}
      </style>

      <Button 
        variant="ghost"
        size="sm"
        className={cn(
          "h-7 text-amber-600 hover:bg-amber-50 hover:text-amber-700 gap-1",
          buttonHover && "bg-amber-50"
        )}
        onMouseEnter={() => setButtonHover(true)}
        onMouseLeave={() => setButtonHover(false)}
        onClick={() => setIsOpen(true)}
      >
        <Bot size={14} />
        <span className="text-xs">Clone AI Tutor</span>
      </Button>

      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md overflow-hidden border-amber-200 rounded-xl shadow-lg">
          <DialogHeader className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-t-lg">
            <DialogTitle className="flex items-center gap-2 text-amber-800">
              <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                <Bot size={18} className="text-amber-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span>Clone AI Tutor</span>
                  <Badge className="bg-amber-200 text-amber-800 text-[10px]">
                    {courseMessages.length} messages
                  </Badge>
                </div>
                <p className="text-xs text-amber-600 font-normal mt-0.5">
                  {courseName}
                </p>
              </div>
            </DialogTitle>
            <p className="text-sm text-amber-700 mt-2">
              Create an AI tutor that can answer student questions based on 
              your teaching patterns and conversation history.
            </p>
          </DialogHeader>
          
          <div className="py-4 px-5">
            <div className="space-y-4">
              {isCloning && !cloneComplete && !error && (
                <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                      <LoaderCircle size={20} className="text-amber-600 animate-spin" />
                    </div>
                    <div>
                      <h4 className="font-medium text-amber-800">
                        {currentStep === 'analyzing' && 'Analyzing course data...'}
                        {currentStep === 'training' && 'Training AI on your teaching style...'}
                        {currentStep === 'finalizing' && 'Finalizing AI Tutor...'}
                      </h4>
                      <div className="flex items-center gap-2">
                        <Progress 
                          value={progress} 
                          className="h-1.5 w-36 bg-amber-100" 
                        />
                        <span className="text-xs text-amber-600">{Math.round(progress)}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2">
                    <div className={`p-3 rounded-lg text-center ${currentStep === 'analyzing' 
                      ? 'bg-amber-100 text-amber-800 shadow-sm' 
                      : currentStep === 'training' || currentStep === 'finalizing' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">Step 1</span>
                        <span className="text-xs">Analyzing</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${currentStep === 'training' 
                      ? 'bg-amber-100 text-amber-800 shadow-sm' 
                      : currentStep === 'finalizing' 
                        ? 'bg-green-50 text-green-600 border border-green-100' 
                        : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">Step 2</span>
                        <span className="text-xs">Training</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg text-center ${currentStep === 'finalizing' 
                      ? 'bg-amber-100 text-amber-800 shadow-sm' 
                      : 'bg-gray-50 text-gray-400 border border-gray-100'}`}>
                      <div className="flex flex-col items-center gap-1">
                        <span className="text-xs font-medium">Step 3</span>
                        <span className="text-xs">Finalizing</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {error && (
                <div className="p-5 bg-red-50 rounded-xl border border-red-200">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={20} className="text-red-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-red-800 mb-1">Error during cloning</h4>
                      <p className="text-sm text-red-600 mb-3">{error}</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        onClick={resetState}
                      >
                        Try Again
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              {!isCloning && !cloneComplete && !error && (
                <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
                  <h4 className="text-sm font-medium mb-4 text-amber-800">AI Tutor will learn from:</h4>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm text-amber-700 p-2 rounded-lg hover:bg-amber-100">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <Sparkles size={14} className="text-amber-700" />
                      </div>
                      <span>Your teaching style and explanation methods</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-amber-700 p-2 rounded-lg hover:bg-amber-100">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <Sparkles size={14} className="text-amber-700" />
                      </div>
                      <span>Answers to common student questions</span>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-amber-700 p-2 rounded-lg hover:bg-amber-100">
                      <div className="w-8 h-8 rounded-full bg-amber-200 flex items-center justify-center">
                        <Sparkles size={14} className="text-amber-700" />
                      </div>
                      <span>All conversations from the {courseName} course</span>
                    </li>
                  </ul>
                </div>
              )}
              
              {cloneComplete && (
                <div className="p-5 bg-green-50 rounded-xl border border-green-200">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                      <CheckCircle2 size={24} className="text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-green-800">AI Tutor is ready!</h4>
                      <p className="text-sm text-green-700">
                        AI Tutor can answer student questions 24/7
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <div className="p-3 bg-green-100 rounded-lg text-green-800 text-sm flex items-center gap-2 mb-2">
                      <MessageSquare size={16} className="text-green-600" />
                      <span>{MOCK_PENDING_MESSAGES.length} pending messages answered</span>
                    </div>
                  </div>
                  
                  <div className="rounded-xl border border-green-200 bg-white p-4 mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Bot size={16} className="text-green-600" />
                        <span className="text-sm font-medium text-green-800">AI Tutor ID</span>
                      </div>
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </div>
                    <div className="text-xs font-mono text-gray-700 select-all overflow-x-auto whitespace-nowrap bg-gray-50 p-2 rounded-md">
                      {tutorId}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-green-700 flex items-center gap-2">
                      <Check size={16} className="text-green-500" />
                      <span>Added to your course</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 text-xs">
                      <ChevronsUp size={14} />
                      <span>Active</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter className="bg-gradient-to-r from-amber-50 to-amber-100 p-5 rounded-b-lg">
            <Button 
              variant="outline"
              onClick={handleClose}
              disabled={isCloning}
              className="mr-2 border-amber-200 text-amber-700 hover:bg-amber-50"
            >
              {cloneComplete ? 'Close' : 'Cancel'}
            </Button>
            
            {!cloneComplete ? (
              <Button 
                onClick={handleClone} 
                disabled={isCloning}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow"
              >
                {isCloning ? (
                  <>
                    <LoaderCircle size={16} className="mr-2 animate-spin" />
                    <span>Cloning...</span>
                  </>
                ) : (
                  <>
                    <span>Clone AI Tutor</span>
                    <Bot size={16} className="ml-2" />
                  </>
                )}
              </Button>
            ) : (
              <Button 
                onClick={handleNewClone}
                className="bg-amber-500 hover:bg-amber-600 text-white shadow"
              >
                <span>Create New AI Tutor</span>
                <Bot size={16} className="ml-2" />
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CloneAITutor; 