
import React from 'react';
import { useApp } from '@/context/AppContext';
import LoginForm from '@/components/auth/LoginForm';
import CourseList from '@/components/courses/CourseList';
import ChatInterface from '@/components/chat/ChatInterface';
import { BookOpen, Users, Award, BarChart3 } from 'lucide-react';

const Index = () => {
  const { isAuthenticated, activeSection, currentCourse } = useApp();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-white to-illuma-100 p-4">
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 animate-fade-in text-illuma-800">ILLUMA</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto animate-fade-in" style={{ animationDelay: '100ms' }}>
            Connect with tutors, learn with AI, excel in your studies
          </p>
        </div>
        
        <div className="w-full max-w-md animate-fade-in" style={{ animationDelay: '200ms' }}>
          <LoginForm />
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl w-full">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="w-12 h-12 rounded-full bg-illuma-100 flex items-center justify-center text-illuma-700 mb-4">
              <BookOpen size={20} />
            </div>
            <h3 className="font-semibold mb-2">Expert Tutors</h3>
            <p className="text-sm text-muted-foreground">Learn from professional tutors in your field of study</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '400ms' }}>
            <div className="w-12 h-12 rounded-full bg-illuma-100 flex items-center justify-center text-illuma-700 mb-4">
              <BarChart3 size={20} />
            </div>
            <h3 className="font-semibold mb-2">AI-Powered</h3>
            <p className="text-sm text-muted-foreground">Get instant help and personalized practice problems</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-border flex flex-col items-center text-center animate-fade-in" style={{ animationDelay: '500ms' }}>
            <div className="w-12 h-12 rounded-full bg-illuma-100 flex items-center justify-center text-illuma-700 mb-4">
              <Award size={20} />
            </div>
            <h3 className="font-semibold mb-2">Track Progress</h3>
            <p className="text-sm text-muted-foreground">Monitor your learning journey with detailed analytics</p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated and viewing courses
  if (activeSection === 'courses' && !currentCourse) {
    return <CourseList />;
  }
  
  // If authenticated and in a chat
  if (currentCourse) {
    return <ChatInterface />;
  }

  // Fallback (should not reach here but just in case)
  return <CourseList />;
};

export default Index;
