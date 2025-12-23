
import React, { ReactNode } from 'react';
import LeftSidebar from './LeftSidebar';
import ContentArea from './ContentArea';
import RightPanel from './RightPanel';
import { useApp } from '@/context/AppContext';

interface MainLayoutProps {
  children?: ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { panelExpanded, isAuthenticated } = useApp();

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content Area */}
      <ContentArea>
        {children}
      </ContentArea>
      
      {/* Right Panel - Canvas/Drawing Tools */}
      <RightPanel />
    </div>
  );
};

export default MainLayout;
