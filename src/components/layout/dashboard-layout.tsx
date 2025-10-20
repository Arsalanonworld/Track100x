
'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  
  const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);

  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState) {
        setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  const handleToggle = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
    localStorage.setItem('sidebar-collapsed', String(collapsed));
  }

  const showExpandedSidebar = isHovered || !isSidebarCollapsed;

  return (
    <div className="min-h-screen w-full bg-background">
      <div 
        className={cn("hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block transition-all duration-300")}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Sidebar 
            isCollapsed={!showExpandedSidebar}
            onCollapseToggle={handleToggle}
        />
      </div>
      <div className={cn("flex flex-col transition-all duration-300", showExpandedSidebar ? "md:pl-60" : "md:pl-[72px]")}>
        <Header onSidebarToggle={() => handleToggle(!isSidebarCollapsed)} />
        <main className={cn(
            "flex flex-1 flex-col",
            isAppPage && "gap-4 p-4 lg:gap-6 lg:p-6"
        )}>
          {children}
        </main>
      </div>
    </div>
  );
}

    