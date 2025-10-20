
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';

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

  const sidebarWidthClass = isSidebarExpanded ? 'md:grid-cols-[240px,1fr]' : 'md:grid-cols-[72px,1fr]';

  if (!isClient) {
    return (
        <div className="grid md:grid-cols-[72px,1fr] h-full">
            <aside className="hidden md:block border-r"></aside>
            <main className="flex-1 flex flex-col transition-all duration-300 overflow-y-auto">
                <div className="flex-1 p-4 lg:p-6 pb-16"></div>
            </main>
        </div>
    );
  }

  return (
    <div className={cn("grid h-full transition-all duration-300", sidebarWidthClass)}>
        <Sidebar 
          isExpanded={isSidebarExpanded} 
          isLocked={isSidebarLocked}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onToggleLock={handleToggleLock}
        />
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="flex-1 p-4 lg:p-6 pb-16">
            {children}
          </div>
        </main>
    </div>
  );
}
