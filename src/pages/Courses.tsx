import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { motion } from 'framer-motion';
import { getAllSavedSessions, ChatSession } from '@/api/chatService';
import './courses.css';

// Import các component mới tách
import CourseHeader from '@/components/courses/CourseHeader';
import CourseList, { MOCK_COURSES } from '@/components/courses/CourseList';
import CourseDetail from '@/components/courses/CourseDetail';
import AllCourses from '@/components/courses/AllCourses';   
import ChatConversations from '@/components/courses/ChatConversations';
import ManageStudents from '@/components/courses/ManageStudents';
import ManageExercises from '@/components/courses/ManageExercises';
import LearningPath from '@/components/courses/LearningPath';

const Courses = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { setActiveSection, setCurrentCourse, isStudent, isTutor } = useApp();
  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [showAIChats, setShowAIChats] = useState(false);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatSession | null>(null);
  const [viewMode, setViewMode] = useState<'course' | 'students' | 'exercises'>('course');
  
  useEffect(() => {
    // Set active section to 'courses' for highlighting in sidebar
    setActiveSection('courses');
    
    // Nếu có ID trong params, tìm khóa học tương ứng
    if (id) {
      const course = MOCK_COURSES.find(course => course.id === id);
      if (course) {
        setSelectedCourse(course);
        setCurrentCourse(course);
      }
    }
  }, [setActiveSection, id, setCurrentCourse]);

  useEffect(() => {
    if (showAIChats) {
      // Thay thế việc lấy dữ liệu thực bằng dữ liệu mẫu
      setChatSessions(MOCK_CHAT_SESSIONS.filter(session => session.courseId === selectedCourse.id));
    }
  }, [showAIChats, selectedCourse]);

  const handleSelectCourse = (course: any) => {
    setSelectedCourse(course);
    setCurrentCourse(course);
    navigate(`/courses/${course.id}`);
  };
  
  const handleSelectMode = (mode: 'ai' | 'tutor' | 'practice' | 'students' | 'exercises' | 'aiTutorConversation' | 'learningPath') => {
    if (!selectedCourse) return;
    
    if (mode === 'ai' && isTutor) {
      // Chuyển hướng đến trang TutorChat nếu là tutor
      navigate(`/tutor-chat/${selectedCourse.id}`);
      return;
    }
    
    switch (mode) {
      case 'learningPath':
        navigate(`/courses/${selectedCourse.id}/learning-path`);
        break;
      case 'ai':
        navigate(`/courses/${selectedCourse.id}/chat`);
        break;
      case 'aiTutorConversation':
        setShowAIChats(true);
        break;
      case 'tutor':
        navigate(`/courses/${selectedCourse.id}/tutor`);
        break;
      case 'practice':
        localStorage.setItem('practiceCourse', JSON.stringify(selectedCourse));
        navigate('/practice');
        break;
      case 'students':
        setViewMode('students');
        break;
      case 'exercises':
        setViewMode('exercises');
        break;
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', { 
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit', 
      minute: '2-digit'
    });
  };
  
  const formatTimeShort = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays === 1) {
      return 'Yesterday, ' + date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }
  };

  // Hiển thị chi tiết khóa học nếu đã chọn
  if (selectedCourse) {
    // Nếu đang hiển thị các cuộc trò chuyện AI
    if (showAIChats) {
      return (
        <div className="container mx-auto py-6">
          <ChatConversations 
            chatSessions={chatSessions}
            selectedChat={selectedChat}
            onSelectChat={setSelectedChat}
            onGoBack={() => setShowAIChats(false)}
            formatTime={formatTime}
            formatTimeShort={formatTimeShort}
          />
        </div>
      );
    }

    // Nếu đang hiển thị quản lý học viên
    if (viewMode === 'students') {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <button 
              onClick={() => setViewMode('course')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>← Back to course</span>
            </button>
          </div>
          <ManageStudents />
        </div>
      );
    }

    // Nếu đang hiển thị quản lý bài tập
    if (viewMode === 'exercises') {
      return (
        <div className="container mx-auto py-6">
          <div className="mb-6">
            <button 
              onClick={() => setViewMode('course')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <span>← Back to course</span>
            </button>
          </div>
          <ManageExercises />
        </div>
      );
    }

    // Hiển thị chi tiết khóa học
    return (
      <div className="container mx-auto py-6">
        <CourseDetail 
          course={selectedCourse}
          onSelectMode={handleSelectMode}
        />
      </div>
    );
  }

  // Hiển thị danh sách khóa học nếu chưa chọn khóa học nào
  return (
    <div className="container mx-auto py-6">
      <CourseHeader />
      <CourseList onSelectCourse={handleSelectCourse} />
    </div>
  );
};

// Dữ liệu mẫu cho các cuộc trò chuyện với AI Tutor
const MOCK_CHAT_SESSIONS: ChatSession[] = [
  {
    id: 'chat-1',
    title: 'Understanding basic logic circuits',
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 giờ trước
    courseId: '1',
    studentId: 'student-1',
    studentName: 'Nguyen Van A',
    messages: [
      {
        id: 'msg-1-1',
        content: 'Hello AI Tutor, can you explain to me how the AND and OR gates work?',
        sender: 'student',
        senderName: 'Nguyen Van A',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'msg-1-2',
        content: 'Hello, I am very happy to explain the AND and OR gates.\n\nThe AND gate (AND gate):\n- The output is only 1 when ALL inputs are 1\n- In all other cases, the output is 0\n- Formula: Y = A.B (with 2 inputs)\n\nThe OR gate (OR gate):\n- The output is 1 when AT LEAST ONE input is 1\n- The output is 0 only when ALL inputs are 0\n- Formula: Y = A+B (with 2 inputs)\n\nDo you want to learn more about their practical applications?',
        sender: 'ai',
        senderName: 'AI Tutor',
        timestamp: new Date(Date.now() - 3600000 * 2 + 60000).toISOString()
      },
      {
        id: 'msg-1-3',
        content: 'Thank you very much. So what about the XOR gate? How is it different from OR?',
        sender: 'student',
        senderName: 'Nguyen Van A',
        timestamp: new Date(Date.now() - 3600000 * 2 + 120000).toISOString()
      },
      {
        id: 'msg-1-4',
        content: 'That is a very good question! The XOR gate (Exclusive OR - OR gate) is different from the OR gate as follows:\n\nThe XOR gate:\n- The output is 1 when the number of inputs with a value of 1 is ODD\n- With 2 inputs: The output is 1 when A is different from B (one is 0, the other is 1)\n- Formula: Y = A⊕B = A.B̅ + Ā.B\n\nDifference from OR:\n- OR: The output is 1 when AT LEAST ONE input is 1\n- XOR: The output is 1 when the number of inputs with a value of 1 is ODD\n\nExample with 2 inputs:\nA=0, B=0: OR=0, XOR=0\nA=0, B=1: OR=1, XOR=1\nA=1, B=0: OR=1, XOR=1\nA=1, B=1: OR=1, XOR=0 (difference here!)\n\nXOR is used in many synchronous circuits, comparison circuits, and binary calculations.',
        sender: 'ai',
        senderName: 'AI Tutor',
        timestamp: new Date(Date.now() - 3600000 * 2 + 240000).toISOString()
      },
    ]
  },
  {
    id: 'chat-2',
    title: 'Sequential circuit design with D Flip-Flop',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(), // 1 ngày trước
    courseId: '1',
    studentId: 'student-2',
    studentName: 'Tran Thi B',
    messages: [
      {
        id: 'msg-2-1',
        content: 'I am having difficulty designing sequential circuits using D Flip-Flops. How can I create a 4-bit binary counter?',
        sender: 'student',
        senderName: 'Tran Thi B',
        timestamp: new Date(Date.now() - 3600000 * 24).toISOString()
      },
      {
        id: 'msg-2-2',
        content: 'Hello, to design a 4-bit binary counter using D Flip-Flops, we need 4 Flip-Flops (each FF represents 1 bit). Here are the steps:\n\n1. Connect 4 D Flip-Flops in series, call the outputs Q0, Q1, Q2, Q3 (Q0 is the LSB)\n\n2. For the first FF (Q0):\n   - Connect D0 = ~Q0 (the inverse of Q0)\n   - This FF will toggle its state on each clock pulse\n\n3. For the remaining FFs:\n   - Connect D1 = Q0 & ~Q1 | ~Q0 & Q1\n   - Connect D2 = Q2 & ~(Q0 & Q1) | ~Q2 & (Q0 & Q1)\n   - Connect D3 = Q3 & ~(Q0 & Q1 & Q2) | ~Q3 & (Q0 & Q1 & Q2)\n\nA simpler way is to use T or JK FFs or connect the clock input of the next FF to the output of the previous FF (create an asynchronous counter).\n\nDo you want me to draw a specific circuit diagram?',
        sender: 'ai',
        senderName: 'AI Tutor',
        timestamp: new Date(Date.now() - 3600000 * 24 + 180000).toISOString()
      },
      {
        id: 'msg-2-3',
        content: 'Yes, I understand. But what if I want to create a counter with a different period? For example, a counter from 0 to 9?',
        sender: 'student',
        senderName: 'Tran Thi B',
        timestamp: new Date(Date.now() - 3600000 * 24 + 300000).toISOString()
      },
      {
        id: 'msg-2-4',
        content: 'That is a very good question! To create a counter from 0 to 9 (decimal counter), we need to modify the 4-bit counter by adding logic to detect when it reaches 10 (1010 in binary) and reset the counter. Here is how to do it:\n\n1. Use the previous 4 D Flip-Flops (Q0, Q1, Q2, Q3)\n\n2. Add a detection circuit for the state 1010 (number 10):\n   - Create a detection circuit: RESET = Q1 & Q3 (when Q1=1 and Q3=1, the number is 1010 = 10)\n\n3. Modify the connections:\n   - D0 = ~Q0 & ~RESET\n   - D1 = (Q0 & ~Q1 | ~Q0 & Q1) & ~RESET\n   - D2 = (Q2 & ~(Q0 & Q1) | ~Q2 & (Q0 & Q1)) & ~RESET\n   - D3 = (Q3 & ~(Q0 & Q1 & Q2) | ~Q3 & (Q0 & Q1 & Q2)) & ~RESET\n\nA simpler way is:\n1. Build a normal binary counter\n2. Add a detection circuit for number 10 (an AND circuit with the appropriate inputs)\n3. Connect the output of the detection circuit to the RESET or CLEAR input of the FFs\n\nThis will allow the counter to count from 0 to 9, then automatically reset to 0.',
        sender: 'ai',
        senderName: 'AI Tutor',
        timestamp: new Date(Date.now() - 3600000 * 24 + 480000).toISOString()
      },
      {
        id: 'msg-2-5',
        content: 'Thank you very much! Now I understand how to create a counter with a custom period.',
        sender: 'student',
        senderName: 'Tran Thi B',
        timestamp: new Date(Date.now() - 3600000 * 24 + 600000).toISOString()
      }
    ]
  },
  {
    id: 'chat-3',
    title: 'Analysis of Karnaugh circuits and optimization',
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(), // 2 ngày trước
    courseId: '1',
    studentId: 'student-3',
    studentName: 'Pham Van C',
    messages: [
      {
        id: 'msg-3-1',
        content: 'Hello AI Tutor, I want to learn about Karnaugh maps. How can I optimize a Boolean function with multiple variables?',
        sender: 'student',
        senderName: 'Phạm Văn C',
        timestamp: new Date(Date.now() - 3600000 * 48).toISOString()
      },
      {
        id: 'msg-3-2',
        content: 'Hello, the Karnaugh map (K-map) is a very useful graphical tool for optimizing Boolean functions. Here is the process of optimizing a function with multiple variables:\n\n1. Draw the K-map with the appropriate size:\n   - 2 variables: 2×2 map\n   - 3 variables: 2×4 map\n   - 4 variables: 4×4 map\n   - 5 variables: 4×8 (or 2 4×4 maps)\n\n2. Fill in the values 1 in the cells corresponding to the minterms in the function.\n\n3. Group the cells with a value of 1 into groups of size 2, 4, 8, 16, etc.\n   - Larger groups are better\n   - Groups can overlap\n   - Try to cover all cells with a value of 1\n\n4. Each group will correspond to a product (term) in the simplified expression\n   - Variables that do not change in the group will appear in the product\n   - Variables that change in the group will be eliminated\n\nExample: if you have a group of 4 cells with a value of 1 where A and C do not change (both are 1) but B changes, this group will create the product A.C in the simplified expression.\n\nDo you want to try an example to understand better?',
        sender: 'ai',
        senderName: 'AI Tutor',
        timestamp: new Date(Date.now() - 3600000 * 48 + 120000).toISOString()
      },
      {
        id: 'msg-3-3',
        content: 'Yes, I want to try an example. Suppose we have the function F(A,B,C,D) = Σm(0,1,2,4,5,6,8,9,12,13,14). How can we optimize it?',
        sender: 'student',
        senderName: 'Pham Van C',
        timestamp: new Date(Date.now() - 3600000 * 48 + 240000).toISOString()
      }
    ]
  }
];

export default Courses; 