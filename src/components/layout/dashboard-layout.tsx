
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
  
  if (!isClient) {
    return (
        <div className="flex min-h-screen">
             <div className="hidden md:block w-[72px] h-screen" />
             <div className="flex-1 flex flex-col">
                <div className="h-14 lg:h-[60px] w-full" />
                <main className="flex-1 p-4 lg:p-6 pb-16">{children}</main>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Sidebar isExpanded={!isSidebarLocked} onToggle={handleToggleLock} />
      <div className={cn("transition-all duration-300", isSidebarLocked ? "md:ml-[72px]" : "md:ml-60")}>
        <Header />
        <main className="p-4 lg:p-6 pb-16 pt-14 lg:pt-[60px]">
          {children}
        </main>
      </div>
    </div>
  );
}
