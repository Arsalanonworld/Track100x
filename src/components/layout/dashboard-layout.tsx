
'use client';

import React from 'react';
import { Footer } from './footer';
import Header from './header';
import { cn } from '@/lib/utils';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <div className="flex flex-col w-full">
        <main className="flex-1 p-4 lg:p-6 pt-20 lg:pt-24 min-h-screen container">
            {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
