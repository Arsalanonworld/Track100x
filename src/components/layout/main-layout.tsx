
'use client';

import React from 'react';
import Header from './header';
import { TickerBar } from './ticker-bar';
import { Footer } from './footer';
import AuthDialog from '../auth-dialog';
import { useAuth, AuthProvider } from '@/hooks/use-auth';
import { AlertsProvider } from '@/hooks/use-alerts';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { authDialogOpen, setAuthDialogOpen } = useAuth();
  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <TickerBar />
      <Header />
      <main className="flex-1">
        <div className="container py-8">
            {children}
        </div>
      </main>
      <Footer />
    </>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col">
      <AuthProvider>
        <AlertsProvider>
          <MainLayoutContent>{children}</MainLayoutContent>
        </AlertsProvider>
      </AuthProvider>
    </div>
  );
}
