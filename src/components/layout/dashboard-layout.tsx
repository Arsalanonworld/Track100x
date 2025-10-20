
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // On mobile, the sidebar is not shown, so we don't need to check for collapsed state
    if (window.innerWidth >= 768) {
        const savedState = localStorage.getItem("sidebar-collapsed");
        setIsSidebarExpanded(savedState === 'true');
    }
  }, []);

  const handleMouseEnter = () => {
    if (localStorage.getItem("sidebar-collapsed") !== 'true') {
        setIsSidebarExpanded(true);
    }
  };

  const handleMouseLeave = () => {
     if (localStorage.getItem("sidebar-collapsed") !== 'true') {
        setIsSidebarExpanded(false);
    }
  };
  
  const handleToggleLock = () => {
    const isCurrentlyLockedOpen = localStorage.getItem("sidebar-collapsed") === 'true';
    if (isCurrentlyLockedOpen) {
        // Unlock and allow hover behavior
        localStorage.setItem("sidebar-collapsed", 'false');
        setIsSidebarExpanded(true); // Stay expanded when unlocking
    } else {
        // Lock open
        localStorage.setItem("sidebar-collapsed", 'true');
        setIsSidebarExpanded(true);
    }
  }


  // Render a skeleton or null on the server and during the initial client render
  // to prevent hydration mismatches.
  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <FirebaseClientProvider>
      <div className="min-h-screen w-full bg-background">
        <Header />
        <div className="flex h-full">
            <Sidebar 
              isExpanded={isSidebarExpanded} 
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onToggleLock={handleToggleLock}
            />
            <main className={cn(
                "flex-1 flex flex-col transition-all duration-300 pt-14 lg:pt-[60px]",
                "pl-0 md:pl-[72px]",
                isSidebarExpanded && "md:pl-60"
            )}>
              <div className="flex-1 p-4 lg:p-6">
                {children}
              </div>
            </main>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
