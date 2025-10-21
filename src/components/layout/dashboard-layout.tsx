
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import Header from './header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem('sidebar-collapsed');
    setIsSidebarLocked(savedState === 'true');
  }, []);

  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newLockedState));
    }
  };

  const mainContentMargin = isSidebarLocked ? 'md:ml-[72px]' : 'md:ml-60';
  
  return (
    <div className="min-h-screen">
      <Header />
      <Sidebar isExpanded={!isSidebarLocked} onToggle={handleToggleLock} />
      <main className={cn("transition-all duration-300 pt-14 lg:pt-[60px]", mainContentMargin)}>
          <div className="p-4 lg:p-6 pb-16">
            {children}
          </div>
      </main>
    </div>
  );
}
