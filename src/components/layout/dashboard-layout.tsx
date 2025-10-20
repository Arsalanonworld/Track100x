
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const pathname = usePathname();
  
  // A simple way to determine if we are on a "marketing" or "app" page
  // to decide whether to add extra padding/container.
  const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
        setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  const handleToggle = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  }

  return (
    <div className="min-h-screen w-full bg-background">
      <div className={cn("hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block transition-all duration-300")}>
        <Sidebar 
            isCollapsed={isSidebarCollapsed}
            onCollapseToggle={handleToggle}
        />
      </div>
      <div className={cn("flex flex-col transition-all duration-300", isSidebarCollapsed ? "md:pl-[72px]" : "md:pl-60")}>
        <Header onSidebarToggle={handleToggle} />
        <main className={cn(
            "flex flex-1 flex-col",
            isAppPage && "gap-4 p-4 lg:gap-6 lg:p-6" // Add padding only for app pages
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}
