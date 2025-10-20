
'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './dashboard-layout';
import MainLayout from './main-layout';

const mainLayoutRoutes = ['/', '/upgrade', '/terms-of-service', '/privacy-policy', '/login'];

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Use MainLayout for marketing, legal, and login pages.
  if (mainLayoutRoutes.includes(pathname)) {
    return <MainLayout>{children}</MainLayout>;
  }

  // Use DashboardLayout for all other pages (the app itself).
  return <DashboardLayout>{children}</DashboardLayout>;
}
