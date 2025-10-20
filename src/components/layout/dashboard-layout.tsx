
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import Header from './header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
      setIsClient(true);
      const savedState = localStorage.getItem('sidebar-collapsed') === 'true';
      setIsSidebarLocked(savedState);
  }, []);

  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newLockedState));
    }
  };
  
  const mainContentMargin = isClient && !isSidebarLocked ? 'md:ml-60' : 'md:ml-[72px]';

  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex h-full">
        <Sidebar 
          isExpanded={!isSidebarLocked}
          onToggle={handleToggleLock}
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
