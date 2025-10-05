'use client';

import React from 'react';
import Header from './header';
import { TickerBar } from './ticker-bar';
import { Footer } from './footer';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <div className="relative flex min-h-screen flex-col">
       <TickerBar />
       <Header />
       <main className="flex-1">
        <div className={cn(!isHomePage && "container py-8 sm:py-12")}>
          {children}
        </div>
       </main>
       <Footer />
    </div>
  );
}
