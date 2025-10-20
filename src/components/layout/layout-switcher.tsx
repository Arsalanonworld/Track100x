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
            <Skeleton className="h-14 lg:h-[60px] w-full rounded-none border-b" />
            <main className="flex-1 p-4 lg:p-6">
                <div className="container">
                    <div className="space-y-4">
                        <Skeleton className="h-12 w-1/3" />
                        <Skeleton className="h-96 w-full" />
                    </div>
                </div>
            </main>
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
