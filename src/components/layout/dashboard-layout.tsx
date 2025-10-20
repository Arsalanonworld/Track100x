
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
    setIsSidebarExpanded(!collapsed);
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
        <Sidebar isExpanded={isSidebarExpanded} onToggle={handleSidebarToggle} />
        <div className={cn(
            "pt-14 lg:pt-[60px] transition-all duration-300",
            isSidebarExpanded ? "md:pl-60" : "md:pl-[72px]"
        )}>
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
    </FirebaseClientProvider>
  );
}
