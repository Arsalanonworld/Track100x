'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './dashboard-layout';
import MainLayout from './main-layout';
import { useUser } from '@/firebase';
import { Skeleton } from '../ui/skeleton';

const mainLayoutRoutes = ['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'];

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useUser();

  if (loading) {
    // Show a basic layout skeleton while determining auth state
    return (
        <div className="min-h-screen w-full bg-background">
            <div className="hidden md:block">
                <Skeleton className="fixed top-0 left-0 h-full w-[72px] rounded-none" />
            </div>
            <div className="flex flex-col md:ml-[72px]">
                <Skeleton className="h-14 lg:h-[60px] w-full rounded-none" />
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

  // For guests, show main layout for marketing pages, and dashboard for app pages.
  if (mainLayoutRoutes.includes(pathname)) {
    return <MainLayout>{children}</MainLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
