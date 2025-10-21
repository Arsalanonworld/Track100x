
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';
import { Footer } from './footer';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);

  useEffect(() => {
    // On mount, read the saved state from localStorage
    const savedState = localStorage.getItem('sidebar-collapsed');
    setIsSidebarLocked(savedState === 'true');

    // Also listen for changes from other tabs
    const handleStorageChange = () => {
        const updatedState = localStorage.getItem('sidebar-collapsed');
        setIsSidebarLocked(updatedState === 'true');
    };
    window.addEventListener('storage', handleStorageChange);
    
    // Listen for custom event from the sidebar toggle button
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
      // Dispatch a custom event that other components (like Header) can listen to
      window.dispatchEvent(new CustomEvent('sidebarToggle'));
    }
  };

  const mainContentMargin = isSidebarLocked ? 'md:ml-[72px]' : 'md:ml-60';
  
  return (
    <div className="relative min-h-screen">
      <Sidebar isExpanded={!isSidebarLocked} onToggle={handleToggleLock} />
      <div className={cn("flex flex-col flex-1 transition-all duration-300", mainContentMargin)}>
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24">
            {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
