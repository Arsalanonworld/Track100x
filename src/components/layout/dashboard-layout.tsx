
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarLocked, setIsSidebarLocked] = useState(false);

  useEffect(() => {
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

  return (
    <div className="flex h-full">
      <Sidebar isExpanded={!isSidebarLocked} onToggle={handleToggleLock} />
      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          isSidebarLocked ? "md:ml-[72px]" : "md:ml-60"
        )}
      >
        <div className="flex-1 p-4 lg:p-6 pb-16 pt-14 lg:pt-[60px]">
          {children}
        </div>
      </main>
    </div>
  );
}
