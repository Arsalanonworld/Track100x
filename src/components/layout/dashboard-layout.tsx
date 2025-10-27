
'use client';

import React from 'react';
import { Footer } from './footer';
import Header from './header';
import { cn } from '@/lib/utils';
import { TickerBar } from './ticker-bar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TickerBar />
      <Header />
      <div className="flex flex-col w-full">
        <main className="flex-1 p-4 lg:p-6 pt-24 lg:pt-[104px] min-h-screen container">
            {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
