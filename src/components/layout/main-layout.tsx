
'use client';

import React from 'react';
import Header from './header';
import { TickerBar } from './ticker-bar';
import { Footer } from './footer';
import AuthDialog from '../auth-dialog';
import { AuthDialogProvider, useAuthDialog } from '@/hooks/use-auth-dialog';
import { FirebaseErrorListener } from '@/components/FirebaseErrorListener';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

function MainLayoutContent({ children }: { children: React.ReactNode }) {
  const { authDialogOpen, setAuthDialogOpen } = useAuthDialog();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <>
      <AuthDialog open={authDialogOpen} onOpenChange={setAuthDialogOpen} />
      <TickerBar />
      <Header />
      <main className="flex-1">
        <div className={cn(!isHomePage && "container py-8 sm:py-12")}>
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
        <AuthDialogProvider>
          <FirebaseErrorListener/>
          <MainLayoutContent>{children}</MainLayoutContent>
        </AuthDialogProvider>
    </div>
  );
}
