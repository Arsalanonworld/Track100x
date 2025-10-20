
'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import Sidebar from './sidebar';
import Header from './header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';
import { cn } from '@/lib/utils';
import { TickerBar } from './ticker-bar';

function DashboardSkeleton() {
    return (
        <div className="min-h-screen w-full">
            <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block border-r bg-card md:w-[220px] lg:w-[280px]">
                 <div className="flex h-full max-h-screen flex-col">
                    <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6 justify-between">
                        <Skeleton className="h-7 w-32" />
                        <Skeleton className="h-8 w-8" />
                    </div>
                     <div className="flex-1 overflow-y-auto">
                        <nav className="grid items-start px-2 text-sm font-medium lg:px-4 py-4 gap-1">
                            <Skeleton className="h-9" />
                            <Skeleton className="h-9" />
                            <Skeleton className="h-9" />
                            <Skeleton className="h-9" />
                        </nav>
                    </div>
                     <div className="mt-auto border-t p-4 space-y-4">
                        <Skeleton className="h-32" />
                    </div>
                 </div>
            </div>
            <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
                <Skeleton className='h-10' />
                <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
                   <div className="w-full flex-1">
                        <Skeleton className="h-9 w-full max-w-sm" />
                   </div>
                   <div className="flex items-center gap-2">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <Skeleton className="h-9 w-9" />
                   </div>
                </header>
                <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                    <Skeleton className="h-96 w-full" />
                </main>
            </div>
        </div>
    )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useUser();
    const router = useRouter();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // This logic can be removed if pages handle their own auth redirects/skeletons
    // useEffect(() => {
    //     if (!loading && !user) {
    //         router.replace('/login');
    //     }
    // }, [loading, user, router]);

    if (loading && !user) { // Only show skeleton on initial load for non-logged in users
        return <DashboardSkeleton />;
    }

  return (
    <div className="min-h-screen w-full">
      <div className={cn("hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block transition-all duration-300")}>
        <Sidebar 
            isCollapsed={isCollapsed}
            onCollapseToggle={() => setIsCollapsed(!isCollapsed)}
        />
      </div>
      <div className={cn("flex flex-col transition-all duration-300", isCollapsed ? "md:pl-[72px]" : "md:pl-60")}>
        <TickerBar />
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 animate-fade-in-up">
          {children}
        </main>
      </div>
    </div>
  );
}
