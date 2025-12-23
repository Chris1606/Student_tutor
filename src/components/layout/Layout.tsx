import React from 'react';
import { Outlet } from 'react-router-dom';
import LeftSidebar from './LeftSidebar';
import RightPanel from './RightPanel';
import { useApp } from '@/context/AppContext';
import PageTransition from './PageTransition';
import { AnimatePresence } from 'framer-motion';

interface LayoutProps {
  showRightPanel: boolean;
}

const Layout: React.FC<LayoutProps> = ({ showRightPanel }) => {
  const { isPanelExpanded, togglePanelExpanded } = useApp();

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      {/* Left Sidebar */}
      <LeftSidebar />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto flex flex-col">
        <main className="h-full">
          <AnimatePresence mode="wait">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
      </div>
      
      {/* Right Panel - Always render when showRightPanel is true, regardless of panel state */}
      {showRightPanel && (
        <RightPanel />
      )}
    </div>
  );
};

export default Layout; 