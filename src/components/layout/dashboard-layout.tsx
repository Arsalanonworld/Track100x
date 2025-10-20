
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { FirebaseClientProvider } from '@/firebase/client-provider';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const savedState = localStorage.getItem("sidebar-collapsed");
    const collapsed = savedState === 'true';
    // Ensure sidebar is collapsed on smaller screens by default
    const isMobile = window.innerWidth < 768;
    setIsSidebarExpanded(!collapsed && !isMobile);
  }, []);

  const handleSidebarToggle = () => {
    const newState = !isSidebarExpanded;
    setIsSidebarExpanded(newState);
    localStorage.setItem("sidebar-collapsed", String(!newState));
  };
  
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
            <Sidebar isExpanded={isSidebarExpanded} onToggle={handleSidebarToggle} />
            <main className={cn(
                "flex-1 flex flex-col pt-14 lg:pt-[60px] transition-all duration-300",
                isSidebarExpanded ? "pl-0 md:pl-60" : "pl-0 md:pl-[72px]"
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
