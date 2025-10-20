
'use client';

import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { Sidebar } from './sidebar';
import Header from './header';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { Skeleton } from '../ui/skeleton';

function DashboardSkeleton() {
    return (
        <div className="flex min-h-screen w-full">
            <div className="hidden md:block md:w-64 border-r">
                <div className="flex h-full max-h-screen flex-col gap-2 p-4">
                     <Skeleton className="h-8 w-32 mb-4" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                     <Skeleton className="h-10 w-full" />
                </div>
            </div>
            <div className="flex flex-col flex-1">
                <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-6">
                    <Skeleton className="h-8 w-8 md:hidden" />
                    <Skeleton className="h-8 w-48" />
                    <div className="ml-auto flex items-center gap-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <Skeleton className="h-10 w-10" />
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
    
    React.useEffect(() => {
        if (!loading && !user) {
            router.replace('/login');
        }
    }, [loading, user, router]);

    if (loading || !user) {
        return <DashboardSkeleton />;
    }

  return (
    <div className="min-h-screen w-full">
      <div className="hidden md:fixed md:inset-y-0 md:left-0 md:z-50 md:block md:w-[220px] lg:w-[280px] border-r bg-muted/40">
        <Sidebar />
      </div>
      <div className="flex flex-col md:pl-[220px] lg:pl-[280px]">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
