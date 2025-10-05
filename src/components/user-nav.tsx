
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
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, DollarSign, Star } from 'lucide-react';
import { AnimatedButton } from './ui/animated-button';
import { useUser } from '@/firebase';
import { logout } from '@/app/auth/actions';
import { useState } from 'react';
import { AuthDialog } from './auth/auth-dialog';

export function UserNav() {
  const { user, claims, loading } = useUser();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const plan = claims?.plan || 'free';

  if (loading) {
    return <div className="h-10 w-24 rounded-md bg-muted animate-pulse" />;
  }

  // Guest State
  if (!user) {
    return (
      <>
        <Button onClick={() => setIsAuthDialogOpen(true)}>
          Login / Sign Up
        </Button>
        <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
      </>
    );
  }

  // Logged-in State
  return (
    <div className="flex items-center gap-4">
      {plan === 'free' && (
        <Link href="/upgrade" passHref>
          <AnimatedButton>
            <Star className="mr-2 h-4 w-4" />
            Upgrade
          </AnimatedButton>
        </Link>
      )}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
              <AvatarFallback>
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.displayName ?? 'User'}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem disabled>
              <User className="mr-2 h-4 w-4" />
              <span>Account</span>
          </DropdownMenuItem>
          {plan === 'pro' && (
            <DropdownMenuItem disabled>
                 <Link href="/account/billing">
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span>Manage Subscription</span>
                </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
