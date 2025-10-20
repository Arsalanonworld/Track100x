
'use client';

import React from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import Header from './header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = React.useState(false);

  React.useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed') === 'true';
    if (window.innerWidth >= 768) {
      setIsSidebarLocked(savedState);
    } else {
      setIsSidebarLocked(false);
    }
  }, []);

  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    localStorage.setItem('sidebar-collapsed', String(newLockedState));
  };
  
  const mainContentMargin = isSidebarLocked ? 'md:ml-60' : 'md:ml-[72px]';

  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex h-full">
        <Sidebar 
          isExpanded={isSidebarLocked}
          onToggleLock={handleToggleLock}
        />
        <main className={cn("flex-1 flex flex-col transition-all duration-300 pt-14 lg:pt-[60px]", mainContentMargin)}>
          <div className="flex-1 p-4 lg:p-6 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
