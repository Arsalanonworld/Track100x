
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import { Footer } from './footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    setIsSidebarLocked(savedState === 'true');

    const handleStorageChange = () => {
        const updatedState = localStorage.getItem('sidebar-collapsed');
        setIsSidebarLocked(updatedState === 'true');
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('sidebarToggle', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('sidebarToggle', handleStorageChange);
    };
  }, []);

  const handleToggleLock = () => {
    const newLockedState = !isSidebarLocked;
    setIsSidebarLocked(newLockedState);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sidebar-collapsed', String(newLockedState));
      window.dispatchEvent(new CustomEvent('sidebarToggle'));
    }
  };
  
  return (
    <div className="flex">
        <Sidebar isExpanded={!isSidebarLocked} onToggle={handleToggleLock} />
        <div className={cn(
            "flex flex-col w-full transition-all duration-300",
            isSidebarLocked ? 'md:ml-[72px]' : 'md:ml-60'
        )}>
            <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24 min-h-screen">
                {children}
            </main>
            <Footer />
        </div>
    </div>
  );
}
