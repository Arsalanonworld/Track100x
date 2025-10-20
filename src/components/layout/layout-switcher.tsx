'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './dashboard-layout';
import MainLayout from './main-layout';

const mainLayoutRoutes = ['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'];

export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (mainLayoutRoutes.includes(pathname)) {
    return <MainLayout>{children}</MainLayout>;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
}
