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
      <div className="flex items-center justify-center h-screen">
          <p>Loading...</p>
      </div>
    );
  }

  return (
      <div className="min-h-screen w-full bg-background">
        <Sidebar onStateChange={setIsSidebarExpanded} />
        <div className={cn(
            "flex flex-col transition-all duration-300",
            isSidebarExpanded ? "md:pl-60" : "md:pl-[72px]"
        )}>
          <Header />
          <main className="flex-1 p-4 lg:p-6">
            {children}
          </main>
        </div>
      </div>
  );
}
