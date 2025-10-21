
'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './auth/auth-dialog';

export function FeatureLock() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'signup'>('login');

  const openDialog = (tab: 'login' | 'signup') => {
    setInitialTab(tab);
    setAuthDialogOpen(true);
  }

  return (
    <>
      <div className="absolute inset-0 z-20 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg">
        <div className="text-center p-8 space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-2xl font-bold">Feature Locked</h3>
          <p className="text-muted-foreground max-w-sm">
            This feature requires an account. Please log in or create a free account to continue.
          </p>
          <div className="flex justify-center gap-4 pt-4">
            <Button onClick={() => openDialog('login')}>Log In</Button>
            <Button variant="outline" onClick={() => openDialog('signup')}>
              Sign Up
            </Button>
          </div>
        </div>
      </div>
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        initialTab={initialTab}
      />
    </>
  );
}
