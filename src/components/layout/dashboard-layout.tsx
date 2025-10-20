
'use client';

import React from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarExpanded, setIsSidebarExpanded] = React.useState(true);
  const pathname = usePathname();
  
  const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);

  return (
    <div className="min-h-screen w-full bg-background">
      <Header />
      <div className="flex h-full">
        <div className="hidden md:fixed md:top-14 lg:top-[60px] md:bottom-0 md:left-0 md:z-40 md:block transition-all duration-300">
          <Sidebar onStateChange={setIsSidebarExpanded} />
        </div>
        <main className={cn(
            "flex flex-1 flex-col transition-all duration-300",
            isSidebarExpanded ? "md:pl-60" : "md:pl-[72px]",
            isAppPage ? "gap-4 p-4 lg:gap-6 lg:p-6" : ""
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
