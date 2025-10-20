
'use client';

import { usePathname } from 'next/navigation';
import MainLayout from './main-layout';
import DashboardLayout from './dashboard-layout';

const dashboardRoutes = ['/watchlist', '/feed', '/leaderboard', '/account', '/wallet', '/portfolio', '/alerts'];
const publicOnlyRoutes = ['/', '/upgrade', '/terms-of-service', '/privacy-policy', '/login'];

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // If it's one of the core dashboard routes, use DashboardLayout
  const isDashboardRoute = dashboardRoutes.some(route => pathname.startsWith(route));

  if (isDashboardRoute) {
    return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Check if it is a public-only route
  const isPublicOnlyRoute = publicOnlyRoutes.includes(pathname);

  // If it's not a dashboard route and not a known public route, it might be something like /wallet/[address]
  // which we also want to be in the dashboard. This is a catch-all.
  if (!isPublicOnlyRoute) {
     return <DashboardLayout>{children}</DashboardLayout>;
  }

  // Default to MainLayout for homepage, upgrade, legal pages, etc.
  return <MainLayout>{children}</MainLayout>;
}
