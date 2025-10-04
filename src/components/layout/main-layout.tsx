'use client';

import React from 'react';
import Header from './header';
import { TickerBar } from './ticker-bar';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <TickerBar />
      <Header />
      <main className="flex-1">
        <div className="container py-8">
            {children}
        </div>
      </main>
    </div>
  );
}
