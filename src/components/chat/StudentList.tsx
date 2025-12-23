import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, AlertCircle, CheckCircle2, Bot, LoaderCircle } from 'lucide-react';
import { UserAvatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { MOCK_STUDENTS } from './TutorChat';

// Thêm animation styles
const animationStyles = `
@keyframes pendingPulse {
  0% { background-color: rgba(239, 68, 68, 0.1); }
  50% { background-color: rgba(239, 68, 68, 0.2); }
  100% { background-color: rgba(239, 68, 68, 0.1); }
}

@keyframes processingGlow {
  0% { border-color: rgba(250, 204, 21, 0.3); }
  50% { border-color: rgba(250, 204, 21, 0.8); }
  100% { border-color: rgba(250, 204, 21, 0.3); }
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
`;

// Helper function to convert timestamp strings to comparable values
const getTimestampValue = (timestamp: string): number => {
  if (timestamp === 'Just now') return Date.now();
  
  if (timestamp.includes('minutes ago') || timestamp.includes('minute ago')) {
    const minutes = parseInt(timestamp);
    return Date.now() - minutes * 60 * 1000;
  }
  
  if (timestamp.includes('hour ago') || timestamp.includes('hours ago')) {
    const hours = parseInt(timestamp);
    return Date.now() - hours * 60 * 60 * 1000;
  }
  
  if (timestamp === 'Yesterday') {
    return Date.now() - 24 * 60 * 60 * 1000;
  }
  
  if (timestamp.includes('days ago')) {
    const days = parseInt(timestamp);
    return Date.now() - days * 24 * 60 * 60 * 1000;
  }
  
  // For timestamps like "10:32 AM" - assume it's today
  if (timestamp.includes('AM') || timestamp.includes('PM')) {
    const now = new Date();
    const [time, period] = timestamp.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    let hours = hour;
    if (period === 'PM' && hour !== 12) {
      hours += 12;
    } else if (period === 'AM' && hour === 12) {
      hours = 0;
    }
    
    now.setHours(hours, minute, 0, 0);
    return now.getTime();
  }
  
  return 0; // fallback
};

// Extended mock data to include more students
export const EXTENDED_MOCK_STUDENTS = [
  // Digital Logic course (course1) - Extended to 15 students
  {
    id: 'student1',
    name: 'Emily Johnson',
    avatar: 'https://i.pravatar.cc/150?img=1',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I need help with Boolean algebra simplification',
    timestamp: '10:32 AM',
    online: true,
    unread: 2,
    needsResponse: true
  },
  {
    id: 'student2',
    name: 'Michael Chen',
    avatar: 'https://i.pravatar.cc/150?img=2',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'How do I implement a 4-bit adder?',
    timestamp: '9:15 AM',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student3',
    name: 'Sarah Williams',
    avatar: 'https://i.pravatar.cc/150?img=3',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'The Karnaugh map exercise is challenging',
    timestamp: 'Yesterday',
    online: false,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student4',
    name: 'James Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=4',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I completed the binary conversion assignment',
    timestamp: 'Yesterday',
    online: false,
    unread: 1,
    needsResponse: false
  },
  {
    id: 'student5',
    name: 'Emma Thompson',
    avatar: 'https://i.pravatar.cc/150?img=5',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'Could you review my final project proposal?',
    timestamp: '2 days ago',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student16',
    name: 'Lucas Wright',
    avatar: 'https://i.pravatar.cc/150?img=16',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I\'m confused about the difference between SR and JK flip-flops',
    timestamp: '3:45 PM',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student17',
    name: 'Charlotte Davies',
    avatar: 'https://i.pravatar.cc/150?img=17',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'Do we need to implement the circuit in hardware for the final assignment?',
    timestamp: '2 hours ago',
    online: false,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student18',
    name: 'Alexander Harris',
    avatar: 'https://i.pravatar.cc/150?img=18',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'When is the deadline for the circuit design homework?',
    timestamp: '4 days ago',
    online: false,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student25',
    name: 'Olivia Parker',
    avatar: 'https://i.pravatar.cc/150?img=25',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I\'m having trouble with sequential circuit analysis',
    timestamp: '1 hour ago',
    online: true,
    unread: 1,
    needsResponse: true
  },
  {
    id: 'student26',
    name: 'Ethan Nguyen',
    avatar: 'https://i.pravatar.cc/150?img=26',
    lastMessage: "Could you explain the concept of metastability in flip-flops? I'm working on cross-domain clock designs and need to understand it better.",
    timestamp: '10 minutes ago',
    course: 'Digital Logic Design',
    courseId: 'course1',
    unread: 1,
    online: true,
    needsResponse: true
  },
  {
    id: 'student27',
    name: 'Sophia Martinez',
    avatar: 'https://i.pravatar.cc/150?img=27',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I need help debugging my logic circuit simulation',
    timestamp: '45 minutes ago',
    online: true,
    unread: 2,
    needsResponse: true
  },
  {
    id: 'student28',
    name: 'William Jackson',
    avatar: 'https://i.pravatar.cc/150?img=28',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'Can you review my truth table for correctness?',
    timestamp: '3 hours ago',
    online: false,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student29',
    name: 'Ava Wilson',
    avatar: 'https://i.pravatar.cc/150?img=29',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'I\'m struggling with minimizing Boolean expressions',
    timestamp: 'Yesterday',
    online: false,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student30',
    name: 'Benjamin Davis',
    avatar: 'https://i.pravatar.cc/150?img=30',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'How do I implement a 4-to-1 multiplexer using NAND gates?',
    timestamp: '5 hours ago',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student31',
    name: 'Mia Thompson',
    avatar: 'https://i.pravatar.cc/150?img=31',
    courseId: 'course1',
    course: 'Digital Logic',
    lastMessage: 'Can we discuss my project on state machines tomorrow?',
    timestamp: '2 days ago',
    online: true,
    unread: 1,
    needsResponse: true
  },
  
  // Digital Systems course (course2)
  {
    id: 'student6',
    name: 'David Patel',
    avatar: 'https://i.pravatar.cc/150?img=6',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'Questions about sequential circuit design',
    timestamp: '11:45 AM',
    online: true,
    unread: 3,
    needsResponse: true
  },
  {
    id: 'student7',
    name: 'Olivia Garcia',
    avatar: 'https://i.pravatar.cc/150?img=7',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'My circuit simulation is not working properly',
    timestamp: 'Yesterday',
    online: false,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student8',
    name: 'Ethan Wilson',
    avatar: 'https://i.pravatar.cc/150?img=8',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'How do registers work in a CPU architecture?',
    timestamp: '3 days ago',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student9',
    name: 'Ava Brown',
    avatar: 'https://i.pravatar.cc/150?img=9',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'Submitted my microcontroller programming exercise',
    timestamp: 'Yesterday',
    online: false,
    unread: 1,
    needsResponse: false
  },
  {
    id: 'student10',
    name: 'Noah Martinez',
    avatar: 'https://i.pravatar.cc/150?img=10',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'Thank you for explaining the state machine concept',
    timestamp: '4 days ago',
    online: true,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student19',
    name: 'Zoe Campbell',
    avatar: 'https://i.pravatar.cc/150?img=19',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'Can you help me debug my assembly code for the interrupt handler?',
    timestamp: '1:20 PM',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student20',
    name: 'Henry Mitchell',
    avatar: 'https://i.pravatar.cc/150?img=20',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'I don\'t understand how memory addressing works in our lab project',
    timestamp: 'Just now',
    online: true,
    unread: 1,
    needsResponse: true
  },
  {
    id: 'student21',
    name: 'Grace Roberts',
    avatar: 'https://i.pravatar.cc/150?img=21',
    courseId: 'course2',
    course: 'Digital Systems',
    lastMessage: 'Is the quiz going to cover memory-mapped I/O?',
    timestamp: '5 hours ago',
    online: false,
    unread: 0,
    needsResponse: true
  },
  
  // FPGA & Verilog course (course3)
  {
    id: 'student11',
    name: 'Sophia Lee',
    avatar: 'https://i.pravatar.cc/150?img=11',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'Help debugging my Verilog code for the ALU',
    timestamp: '8:20 AM',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student12',
    name: 'William Taylor',
    avatar: 'https://i.pravatar.cc/150?img=12',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'How can I optimize my FPGA design?',
    timestamp: 'Yesterday',
    online: false,
    unread: 2,
    needsResponse: false
  },
  {
    id: 'student13',
    name: 'Isabella Anderson',
    avatar: 'https://i.pravatar.cc/150?img=13',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'My testbench isn\'t verifying the module correctly',
    timestamp: '5 days ago',
    online: true,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student14',
    name: 'Benjamin Thomas',
    avatar: 'https://i.pravatar.cc/150?img=14',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'Completed the UART implementation assignment',
    timestamp: 'Yesterday',
    online: true,
    unread: 0,
    needsResponse: false
  },
  {
    id: 'student15',
    name: 'Mia Hernandez',
    avatar: 'https://i.pravatar.cc/150?img=15',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'Can we discuss my final project on image processing?',
    timestamp: '2 days ago',
    online: false,
    unread: 1,
    needsResponse: true
  },
  {
    id: 'student22',
    name: 'Daniel Kim',
    avatar: 'https://i.pravatar.cc/150?img=22',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'I\'m getting timing constraint errors on my FPGA implementation',
    timestamp: '30 minutes ago',
    online: true,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student23',
    name: 'Lily Zhang',
    avatar: 'https://i.pravatar.cc/150?img=23',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'How do I properly pipeline my design for better performance?',
    timestamp: '11:05 AM',
    online: false,
    unread: 0,
    needsResponse: true
  },
  {
    id: 'student24',
    name: 'Jake Rodriguez',
    avatar: 'https://i.pravatar.cc/150?img=24',
    courseId: 'course3',
    course: 'FPGA & Verilog',
    lastMessage: 'My synthesis tool is giving strange warnings about my code',
    timestamp: '6 hours ago',
    online: true,
    unread: 2,
    needsResponse: true
  }
];

interface StudentListProps {
  courseId: string;
  selectedStudent: string | null;
  onSelectStudent: (id: string) => void;
  isMobileView: boolean;
  aiTutorCloned?: boolean; // New prop to indicate AI Tutor was cloned
  onConversationUpdate?: (conversations: Record<string, {studentMessage: string, aiResponse: string, timestamp: string}[]>) => void;
  aiResponses?: Record<string, {message: string, timestamp: string}>;
  answeredStudents?: string[];
  processingStudents?: string[];
}

const StudentList: React.FC<StudentListProps> = ({
  courseId,
  selectedStudent,
  onSelectStudent,
  isMobileView,
  aiTutorCloned = false,
  onConversationUpdate,
  aiResponses: propAiResponses,
  answeredStudents: propAnsweredStudents,
  processingStudents: propProcessingStudents
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredStudents, setFilteredStudents] = useState(EXTENDED_MOCK_STUDENTS);
  const [filter, setFilter] = useState<'all' | 'needsResponse'>('all');
  const [processingStudents, setProcessingStudents] = useState<string[]>(propProcessingStudents || []);
  const [answeredStudents, setAnsweredStudents] = useState<string[]>(propAnsweredStudents || []);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiResponses, setAiResponses] = useState<Record<string, {message: string, timestamp: string}>>(propAiResponses || {});
  const [aiConversations, setAiConversations] = useState<Record<string, {
    studentMessage: string,
    aiResponse: string,
    timestamp: string
  }[]>>({});
  
  const aiResponseTemplates = useMemo(() => [
    "I have explained this concept in detail in the document.",
    "I have sent a guide to solving this problem.",
    "I have answered the question and sent additional reference materials.",
    "I have analyzed the problem and proposed a suitable solution.",
    "I have sent a method of solving and some practical examples.",
    "I have guided the steps of implementation in detail.",
    "I have answered the question with an example.",
    "I have explained and sent a link to additional documents.",
    "I have solved the problem and provided similar exercises.",
    "I have provided a comprehensive solution to this problem."
  ], []);
  
  useEffect(() => {
    if (propAiResponses) {
      setAiResponses(propAiResponses);
    }
  }, [propAiResponses]);

  useEffect(() => {
    if (propAnsweredStudents) {
      setAnsweredStudents(propAnsweredStudents);
    }
  }, [propAnsweredStudents]);

  useEffect(() => {
    if (propProcessingStudents) {
      setProcessingStudents(propProcessingStudents);
    }
  }, [propProcessingStudents]);
  
  useEffect(() => {
    if (aiTutorCloned && !isProcessing) {
      // Sử dụng cả state nội bộ và props từ TutorChat
      const allAnsweredStudents = [...answeredStudents, ...(propAnsweredStudents || [])];
      
      // Lọc sinh viên cần phản hồi mà chưa được trả lời
      const pendingStudents = filteredStudents
        .filter(student => student.needsResponse && !allAnsweredStudents.includes(student.id))
        .map(student => student.id);
      
      console.log("Pending students:", pendingStudents);
      console.log("All answered students:", allAnsweredStudents);
      
      // Giới hạn số lượng sinh viên được trả lời mỗi lần (tối đa 3 sinh viên)
      const studentsToProcess = pendingStudents.slice(0, 3);
      
      if (studentsToProcess.length > 0) {
        setIsProcessing(true);
        
        let currentIndex = 0;
        const maxProcessingTime = 5000; // Thời gian tối đa cho mỗi sinh viên (5 giây)
        
        const processNextStudent = () => {
          if (currentIndex < studentsToProcess.length) {
            const studentId = studentsToProcess[currentIndex];
            
            // Bỏ qua student26 (Ethan Nguyen) vì đã được xử lý đặc biệt trong handleCloneComplete
            if (studentId === 'student26') {
              console.log("Skipping student26 as it's handled separately");
              currentIndex++;
              processNextStudent();
              return;
            }
            
            setProcessingStudents([studentId]);
            
            const student = filteredStudents.find(s => s.id === studentId);
            const studentMessage = student ? student.lastMessage : "";
            
            // Giới hạn thời gian xử lý để tránh vòng lặp vô tận
            setTimeout(() => {
              setProcessingStudents([]);
              
              const randomResponse = aiResponseTemplates[Math.floor(Math.random() * aiResponseTemplates.length)];
              
              setAiResponses(prev => {
                const newResponses = {
                  ...prev,
                  [studentId]: {
                    message: randomResponse,
                    timestamp: "Just now"
                  }
                };
                console.log("Added AI response for student:", studentId);
                return newResponses;
              });
              
              setAiConversations(prev => {
                const updatedConversations = {
                  ...prev,
                  [studentId]: [
                    ...(prev[studentId] || []),
                    {
                      studentMessage: studentMessage,
                      aiResponse: randomResponse,
                      timestamp: new Date().toISOString()
                    }
                  ]
                };
                
                // Gọi callback để cập nhật dữ liệu lên component cha
                if (onConversationUpdate) {
                  onConversationUpdate(updatedConversations);
                }
                
                return updatedConversations;
              });
              
              setAnsweredStudents(prev => [...prev, studentId]);
              currentIndex++;
              
              // Gọi đệ quy với timeout nhỏ để tránh đệ quy không giới hạn
              setTimeout(processNextStudent, 500);
            }, Math.random() * 1500 + 500); // Ngẫu nhiên từ 0.5s đến 2s
          } else {
            setIsProcessing(false);
            console.log("Completed processing AI responses for pending students");
            
            // Không tự động xử lý thêm sinh viên nữa nếu đã xử lý hết, tránh vòng lặp
            if (pendingStudents.length <= studentsToProcess.length) {
              console.log("All pending students have been processed, stopping auto-response");
            }
          }
        };
        
        processNextStudent();
      }
    }
  }, [aiTutorCloned, filteredStudents, isProcessing, answeredStudents, aiResponseTemplates, onConversationUpdate, propAnsweredStudents, propProcessingStudents]);
  
  useEffect(() => {
    let effectiveCourseId = courseId;
    
    if (!courseId) {
      effectiveCourseId = "course1";
    } else if (courseId === "1") {
      effectiveCourseId = "course1";
    } else if (courseId === "2") {
      effectiveCourseId = "course2";
    } else if (courseId === "3") {
      effectiveCourseId = "course3";
    }
    
    let studentsInCourse = EXTENDED_MOCK_STUDENTS
      .filter(student => student.courseId === effectiveCourseId);
    
    if (filter === 'needsResponse') {
      studentsInCourse = studentsInCourse.filter(student => student.needsResponse);
    }
    
    if (searchTerm.trim()) {
      const searchResults = studentsInCourse.filter(student => 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      setFilteredStudents(searchResults);
    } else {
      setFilteredStudents(studentsInCourse);
    }
    
    setFilteredStudents(prev => 
      [...prev].sort((a, b) => {
        const timeA = getTimestampValue(a.timestamp);
        const timeB = getTimestampValue(b.timestamp);
        return timeB - timeA;
      })
    );
  }, [searchTerm, courseId, filter]);

  useEffect(() => {
    if (onConversationUpdate && Object.keys(aiConversations).length > 0) {
      onConversationUpdate(aiConversations);
    }
  }, [aiConversations, onConversationUpdate]);

  const toggleFilter = () => {
    setFilter(filter === 'all' ? 'needsResponse' : 'all');
  };

  const needsResponseCount = filteredStudents.filter(student => 
    student.needsResponse && !answeredStudents.includes(student.id)
  ).length;

  const getStudentStatus = useCallback((student: typeof EXTENDED_MOCK_STUDENTS[0]) => {
    if (processingStudents.includes(student.id)) {
      return 'processing';
    } else if (answeredStudents.includes(student.id)) {
      return 'answered';
    } else if (student.needsResponse) {
      return 'pending';
    }
    return 'normal';
  }, [processingStudents, answeredStudents]);

  const getStudentMessageInfo = useCallback((student: typeof EXTENDED_MOCK_STUDENTS[0]) => {
    const status = getStudentStatus(student);
    
    if (status === 'answered' && aiResponses[student.id]) {
      return {
        message: aiResponses[student.id].message,
        timestamp: aiResponses[student.id].timestamp
      };
    }
    
    return {
      message: student.lastMessage,
      timestamp: student.timestamp
    };
  }, [getStudentStatus, aiResponses]);

  return (
    <>
      <style>{animationStyles}</style>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: #9CA3AF;
        }
      `}</style>
      
      <div className={`w-full md:w-80 border-r border-border flex flex-col h-full overflow-hidden bg-gray-50 ${isMobileView ? 'absolute inset-0 z-20 bg-white' : ''}`}>
        <div className="p-3 border-b border-border sticky top-0 bg-white z-10">
          <div className="relative mb-2">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search student..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 py-1.5 h-9 text-sm"
            />
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div>
              <span className="font-medium mr-1">Course:</span>
              {(() => {
                switch(courseId) {
                  case 'course1': return 'Digital Logic';
                  case 'course2': return 'Digital Systems';
                  case 'course3': return 'FPGA & Verilog';
                  case '1': return 'Digital Logic';
                  case '2': return 'Digital Systems';
                  case '3': return 'FPGA & Verilog';
                  default: return 'All';
                }
              })()}
              <Badge className="ml-2 bg-tutu-100 text-tutu-800 text-[10px]">
                {filteredStudents.length} students
              </Badge>
              {needsResponseCount > 0 && (
                <Badge className="ml-1 bg-red-100 text-red-800 text-[10px]">
                  {needsResponseCount} pending
                </Badge>
              )}
              {isProcessing && (
                <Badge className="ml-1 bg-amber-100 text-amber-800 text-[10px] animate-pulse">
                  <span className="typing-animation">AI answering</span>
                </Badge>
              )}
              {answeredStudents.length > 0 && !isProcessing && (
                <Badge className="ml-1 bg-green-100 text-green-800 text-[10px]"
                       style={{animation: 'successFadeIn 0.5s ease-out forwards'}}>
                  {answeredStudents.length} answered
                </Badge>
              )}
            </div>
            
            <Button 
              variant="ghost" 
              size="sm" 
              className={`h-7 px-2 ${filter === 'needsResponse' ? 'bg-red-50 text-red-600' : 'text-gray-500'}`}
              onClick={toggleFilter}
            >
              <Filter size={14} className="mr-1" />
              <span className="text-xs">{filter === 'all' ? 'All' : 'Pending'}</span>
            </Button>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]" style={{
          scrollbarWidth: 'thin',
          scrollbarColor: '#9CA3AF transparent'
        }}>
          <style>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f1f1f1;
              border-radius: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background-color: #9CA3AF;
              border-radius: 8px;
              border: 2px solid #f1f1f1;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background-color: #6B7280;
            }
            .custom-scrollbar {
              padding-right: 4px;
            }
          `}</style>
          {filteredStudents.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {filteredStudents.map(student => {
                const status = getStudentStatus(student);
                const { message, timestamp } = getStudentMessageInfo(student);
                
                return (
                  <div
                    key={student.id}
                    className={cn(
                      "py-2 px-3 hover:bg-gray-100 cursor-pointer transition-colors relative",
                      selectedStudent === student.id && "bg-tutu-50 hover:bg-tutu-50 border-l-2 border-tutu-400 pl-2",
                      status === 'processing' && "border border-amber-300",
                      status === 'answered' && "bg-green-50 hover:bg-green-50"
                    )}
                    style={{
                      animation: status === 'pending' ? 'pendingPulse 2s infinite' : 
                                status === 'processing' ? 'processingGlow 1.5s infinite' : 
                                status === 'answered' ? 'slideInUp 0.5s ease-out' : 'none'
                    }}
                    onClick={() => onSelectStudent(student.id)}
                  >
                    <div className="flex items-start gap-2.5">
                      <UserAvatar 
                        src={student.avatar}
                        alt={student.name}
                        size="sm"
                        online={student.online}
                      />
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <h4 className="font-medium text-sm truncate">{student.name}</h4>
                            {status === 'pending' && (
                              <div className="ml-1.5 w-2 h-2 rounded-full bg-red-500" title="Awaiting response"></div>
                            )}
                            {status === 'processing' && (
                              <div className="ml-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse" title="AI is answering"></div>
                            )}
                            {status === 'answered' && (
                              <div className="ml-1.5 w-2 h-2 rounded-full bg-green-500" title="Answered by AI"></div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{timestamp}</span>
                        </div>
                        
                        <p className="text-xs text-gray-600 truncate mt-0.5">
                          {status === 'pending' && (
                            <span className="mr-1 inline-block">
                              <AlertCircle size={10} className="inline text-red-500 mr-1" />
                            </span>
                          )}
                          {status === 'processing' && (
                            <span className="mr-1 inline-block">
                              <LoaderCircle size={10} className="inline text-amber-500 mr-1 animate-spin" />
                            </span>
                          )}
                          {status === 'answered' && (
                            <span className="mr-1 inline-block">
                              <CheckCircle2 size={10} className="inline text-green-500 mr-1" />
                            </span>
                          )}
                          {message}
                        </p>
                        
                        {status === 'processing' && (
                          <div className="mt-1 text-[10px] text-amber-600 flex items-center gap-1">
                            <Bot size={10} className="text-amber-500" />
                            <span className="typing-animation">AI tutor answering</span>
                          </div>
                        )}
                        
                        {status === 'answered' && (
                          <div className="mt-1 text-[10px] text-green-600 flex items-center gap-1" 
                               style={{animation: 'successFadeIn 0.5s ease-out forwards'}}>
                            <Bot size={10} className="text-green-500" />
                            <span>Answered by AI tutor</span>
                          </div>
                        )}
                      </div>
                      
                      {student.unread > 0 && (
                        <Badge variant="default" className="bg-tutu-500 text-white rounded-full h-5 min-w-5 flex items-center justify-center text-[10px]">
                          {student.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-4 text-center">
              <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center mb-3">
                <Search size={18} className="text-gray-400" />
              </div>
              <h4 className="font-medium text-sm mb-1">No students found</h4>
              <p className="text-xs text-gray-500">
                {filter === 'needsResponse' 
                  ? "No students awaiting response in this course." 
                  : "No students match your search."}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default StudentList; 