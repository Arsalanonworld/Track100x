'use client';

import { usePathname } from 'next/navigation';
import DashboardLayout from './dashboard-layout';

// All pages will now use DashboardLayout by default.
// The MainLayout has been removed for a unified app experience.
export function LayoutSwitcher({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Any pages that should NOT have the dashboard layout can be conditionally
  // rendered here in the future, but for now, we use it everywhere.
  return <DashboardLayout>{children}</DashboardLayout>;
}
