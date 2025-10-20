'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
        <div className="min-h-screen w-full bg-background">
            <div className="hidden md:block">
                <div className="fixed top-0 left-0 h-full w-[72px] bg-card border-r" />
            </div>
            <div className="flex flex-col md:ml-[72px]">
                <div className="h-14 lg:h-[60px] w-full border-b" />
                <main className="flex-1 p-4 lg:p-6" />
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className="hidden md:block">
        <Sidebar onStateChange={setIsSidebarExpanded} />
      </div>
      <div className={cn(
          "flex flex-col transition-all duration-300",
          isSidebarExpanded ? "md:ml-60" : "md:ml-[72px]"
      )}>
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
