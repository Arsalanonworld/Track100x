
'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './main-layout';
import DashboardLayout from './dashboard-layout';

const dashboardRoutes = ['/watchlist', '/feed', '/leaderboard', '/account', '/wallet', '/portfolio'];

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  if (isDashboardRoute) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  return <MainLayout>{children}</MainLayout>;
}
