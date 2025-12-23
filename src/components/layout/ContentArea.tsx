
import React, { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';

interface ContentAreaProps {
  children: ReactNode;
}

const ContentArea: React.FC<ContentAreaProps> = ({ children }) => {
  const { activeSection, currentCourse } = useApp();
  
  return (
    <div className="flex-1 h-full overflow-y-auto">
      <div className="h-full flex flex-col">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center px-6 bg-white z-10">
          <div className="flex-1">
            <h2 className="text-xl font-medium">
              {currentCourse ? currentCourse.title : (
                activeSection === 'courses' ? 'Discover Courses' :
                activeSection === 'chat' ? 'Conversations' :
                activeSection === 'dashboard' ? 'My Dashboard' : 'My Profile'
              )}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            {/* Any header actions can go here */}
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default ContentArea;
