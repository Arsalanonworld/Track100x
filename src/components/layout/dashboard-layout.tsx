'use client';

import React, { useState } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

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
