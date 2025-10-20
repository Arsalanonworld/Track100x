
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
    if (window.innerWidth >= 768) {
        const savedState = localStorage.getItem("sidebar-collapsed") === 'true';
        setIsSidebarLocked(savedState);
        setIsSidebarExpanded(savedState);
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
    // Keep it expanded when locking, allow hover behavior when unlocking
    setIsSidebarExpanded(newLockedState ? true : false);
  }

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FirebaseClientProvider>
        <Header />
        <div className="flex-1">
            <div className="flex h-full pt-14 lg:pt-[60px]">
                <Sidebar 
                  isExpanded={isSidebarExpanded} 
                  isLocked={isSidebarLocked}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onToggleLock={handleToggleLock}
                />
                <main className={cn(
                    "flex-1 flex flex-col transition-all duration-300",
                    "pl-0 md:pl-[72px]",
                    isSidebarExpanded && "md:pl-60"
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
