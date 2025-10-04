'use client';

import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset, SidebarRail } from '@/components/ui/sidebar';
import SidebarNav from './sidebar-nav';
import { UserNav } from '@/components/user-nav';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarNav />
      </Sidebar>
      <SidebarRail />
      <SidebarInset>
        <div className="p-4 sm:p-6 lg:p-8">
          <div className="flex justify-end mb-4">
            <UserNav />
          </div>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
