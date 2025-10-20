
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem("sidebar-collapsed") === 'true';
    if (window.innerWidth >= 768) {
        setIsSidebarLocked(savedState);
        setIsSidebarExpanded(savedState);
    } else {
        setIsSidebarLocked(false);
        setIsSidebarExpanded(false);
    }
  }, []);

  const handleMouseEnter = () => {
    if (!isSidebarLocked) {
        setIsSidebarExpanded(true);
    }
  };

  const handleMouseLeave = () => {
     if (!isSidebarLocked) {
        setIsSidebarExpanded(false);
    }
  };
  
  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    localStorage.setItem("sidebar-collapsed", String(newLockedState));
    setIsSidebarExpanded(newLockedState);
  }

  if (!isClient) {
    // Return a skeleton or loading state that matches the layout
    return (
        <div className="relative min-h-screen">
            <header className="fixed top-0 left-0 right-0 z-30 w-full bg-background/95 backdrop-blur-sm border-b h-14 lg:h-[60px]"></header>
            <div className="flex h-full pt-14 lg:pt-[60px]">
                <aside className="hidden md:flex fixed top-0 left-0 h-full flex-col z-20 border-r pt-14 lg:pt-[60px] w-[72px]"></aside>
                <main className="flex-1 flex flex-col transition-all duration-300 md:ml-[72px]">
                    <div className="flex-1 p-4 lg:p-6 pb-16"></div>
                </main>
            </div>
        </div>
    );
  }

  return (
    <FirebaseClientProvider>
      <div className="relative min-h-screen">
        <Header />
        <div className="flex h-full">
          <Sidebar 
            isExpanded={isSidebarExpanded} 
            isLocked={isSidebarLocked}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onToggleLock={handleToggleLock}
          />
          <main className={cn(
              "flex-1 flex flex-col transition-all duration-300 pt-14 lg:pt-[60px]",
              isSidebarExpanded ? "md:ml-60" : "md:ml-[72px]"
          )}>
            <div className="flex-1 p-4 lg:p-6 pb-16">
              {children}
            </div>
          </main>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
