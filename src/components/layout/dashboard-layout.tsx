
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
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <Sidebar />
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col p-0">
              <Sidebar />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            {/* Can add search bar here */}
          </div>
          <Header />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
