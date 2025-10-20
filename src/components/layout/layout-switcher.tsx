'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './dashboard-layout';
import MainLayout from './main-layout';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const { user, loading } = useUser();

  if (loading) {
    // Show a full-page skeleton while determining auth state.
    // This prevents layout flashes and ensures server/client match before a layout is chosen.
    return (
        <div className="min-h-screen w-full bg-background">
            <Skeleton className="h-14 lg:h-[60px] w-full rounded-none border-b" />
            <div className='flex'>
                <Skeleton className="h-[calc(100vh-56px)] w-[72px] hidden md:block rounded-none" />
                <main className="flex-1 p-4 lg:p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-1/3" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </main>
            </div>
        </div>
    )
  }

  // If user is logged in, always show the dashboard layout.
  if (user) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // For guests, show main layout. App pages will be protected by withAuth.
  return <MainLayout>{children}</MainLayout>;
}
