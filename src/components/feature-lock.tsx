
'use client';

import { useState } from 'react';
import { Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './auth/auth-dialog';
import Link from 'next/link';
import { useUser } from '@/firebase';

export function FeatureLock() {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'signup'>('login');
  const { user } = useUser();

  const openDialog = (tab: 'login' | 'signup') => {
    setInitialTab(tab);
    setAuthDialogOpen(true);
  }

  const UpgradeLock = () => (
     <div className="text-center p-8 space-y-4">
        <Lock className="h-8 w-8 mx-auto text-primary mb-2" />
        <h3 className="text-xl font-bold">This is a Pro Feature</h3>
        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1 mb-4">
            Upgrade your account to unlock this feature and get full access to all our tools.
        </p>
        <Button asChild>
            <Link href="/upgrade">Upgrade to Pro</Link>
        </Button>
    </div>
  )

  const AuthLock = () => (
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
  )

  return (
    <>
      <div className="absolute bottom-0 left-0 right-0 h-96 bg-gradient-to-t from-background via-background/90 to-transparent flex flex-col items-center justify-center">
        <div className="bg-background/80 backdrop-blur-sm p-8 rounded-lg">
          <AuthLock />
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
