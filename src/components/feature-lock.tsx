
'use client';

import { useState } from 'react';
import { Lock, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthDialog } from './auth/auth-dialog';
import Link from 'next/link';

export function FeatureLock({ proLock = false }: { proLock?: boolean }) {
  const [isAuthDialogOpen, setAuthDialogOpen] = useState(false);
  const [initialTab, setInitialTab] = useState<'login' | 'signup'>('login');

  const openDialog = (tab: 'login' | 'signup') => {
    setInitialTab(tab);
    setAuthDialogOpen(true);
  };

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
  );
  
  const ProLock = () => (
    <div className="text-center p-8 space-y-4">
       <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
           <Star className="w-8 h-8 text-primary" />
       </div>
       <h3 className="text-2xl font-bold">Pro Feature</h3>
       <p className="text-muted-foreground max-w-sm">
           This feature is only available on the Pro plan. Upgrade your account to gain access.
       </p>
       <div className="flex justify-center gap-4 pt-4">
       <Button asChild>
            <Link href="/upgrade">Upgrade to Pro</Link>
        </Button>
       </div>
   </div>
 );


  return (
    <>
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
        {proLock ? <ProLock /> : <AuthLock />}
      </div>
      <AuthDialog 
        open={isAuthDialogOpen} 
        onOpenChange={setAuthDialogOpen} 
        initialTab={initialTab}
      />
    </>
  );
}
