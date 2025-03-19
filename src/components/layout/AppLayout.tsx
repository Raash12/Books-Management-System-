
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';
import { AnimatePresence } from 'framer-motion';

export const AppLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar for navigation */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar onOpenMobileSidebar={() => setSidebarOpen(true)} />
        
        <main className={cn(
          "flex-1 overflow-y-auto overflow-x-hidden",
          "transition-all duration-300 ease-out-expo"
        )}>
          <div className="container py-6 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <Outlet />
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
