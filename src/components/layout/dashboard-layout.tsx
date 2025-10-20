'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();
  const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);

  useEffect(() => {
    // This effect runs only on the client, after the initial render.
    setIsClient(true);
  }, []);

  // On the server and during the initial client render, we don't render the layout
  // to prevent hydration mismatch caused by the sidebar state from localStorage.
  if (!isClient) {
    return null;
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
        <main className={cn(
            "flex-1",
            isAppPage ? "gap-4 p-4 lg:gap-6 lg:p-6" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
