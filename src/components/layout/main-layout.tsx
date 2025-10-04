
'use client';

import React from 'react';
import Header from './header';
import { TickerBar } from './ticker-bar';
import { Footer } from './footer';
import AuthDialog from '../auth-dialog';
import { useAuth } from '@/hooks/use-auth';
import { AlertsProvider } from '@/hooks/use-alerts';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { authDialogOpen, setAuthDialogOpen } = useAuth();
  return (
    <div className="relative flex min-h-screen flex-col">
      <AlertsProvider>
        <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
        <TickerBar />
        <Header />
        <main className="flex-1">
          <div className="container py-8">
              {children}
          </div>
        </main>
        <Footer />
      </AlertsProvider>
    </div>
  );
}
