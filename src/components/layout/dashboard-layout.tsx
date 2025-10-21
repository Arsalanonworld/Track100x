
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import Header from './header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);
  
  useEffect(() => {
      const savedState = localStorage.getItem('sidebar-collapsed');
      // If there is a saved state in localStorage, use it. Otherwise, default to not locked (expanded).
      if (savedState !== null) {
        setIsSidebarLocked(savedState === 'true');
      }
  }, []);

  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newLockedState));
    }
  };
  
  return (
    <div className="relative min-h-screen">
      <Header />
      <div className="flex h-full pt-14 lg:pt-[60px]">
        <Sidebar 
          isExpanded={!isSidebarLocked}
          onToggle={handleToggleLock}
        />
        <main className="flex-1 flex flex-col">
          <div className="flex-1 p-4 lg:p-6 pb-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
