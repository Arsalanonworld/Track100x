
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { useUser, useFirestore, useDoc, useMemoFirebase } from '@/firebase';
import { logout } from '@/lib/actions';
import { useRouter } from 'next/navigation';
import { Skeleton } from './ui/skeleton';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { doc } from 'firebase/firestore';
import { Zap, Sparkles } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';

export function UserNav() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);
  const isPro = userData?.plan === 'pro';
  const isFree = user && !isPro;
  const isLoading = isUserLoading || isUserDataLoading;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  if (isLoading) {
    return <Skeleton className="h-9 w-20 rounded-md" />;
  }
  
  if (!user) {
    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setAuthDialogOpen(true)}>Log In</Button>
            <AnimatedButton onClick={() => setAuthDialogOpen(true)}>
                Sign Up
            </AnimatedButton>
        </div>
    );
  }

  const userInitial = user.email ? user.email.charAt(0).toUpperCase() : '?';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
            <AvatarFallback>{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.displayName || userData?.username || 'User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/account">Account</Link>
        </DropdownMenuItem>
        
        {isPro ? (
           <DropdownMenuItem>
              Manage Subscription
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/upgrade" className="flex items-center justify-between">
              Upgrade to Pro <Zap className="h-4 w-4 text-primary" />
            </Link>
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
