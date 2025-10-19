
'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LogOut, User, DollarSign, Star, LayoutDashboard, ArrowRight, Eye } from 'lucide-react';
import { useUser } from '@/firebase';
import { useState, useEffect } from 'react';
import { AuthDialog } from './auth/auth-dialog';
import { Skeleton } from './ui/skeleton';
import { useLogout } from './auth/auth-actions';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

export function UserNav() {
  const { user, claims, loading } = useUser();
  const logout = useLogout();
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);
  const [initialAuthTab, setInitialAuthTab] = useState<'login' | 'signup'>('login');
  const isPro = claims?.plan === 'pro';

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const openAuthDialog = (tab: 'login' | 'signup') => {
    setInitialAuthTab(tab);
    setIsAuthDialogOpen(true);
  };

  if (!isClient || loading) {
    return (
        <div className="flex items-center gap-2">
            <Skeleton className="h-10 w-24 rounded-md" />
            <Skeleton className="h-10 w-10 rounded-full" />
        </div>
    );
  }

  // Guest State
  if (!user) {
    return (
        <>
        <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => openAuthDialog('login')}>
                Login
            </Button>
            <Button asChild>
                <Link href="/upgrade">
                    Upgrade <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
        <AuthDialog 
            open={isAuthDialogOpen} 
            onOpenChange={setIsAuthDialogOpen} 
            initialTab={initialAuthTab}
        />
        </>
    );
  }

  // Logged-in State
  return (
    <div className="flex items-center gap-2">
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button asChild variant="ghost" size="icon">
                        <Link href="/portfolio">
                            <LayoutDashboard className="h-5 w-5" />
                            <span className="sr-only">Portfolio</span>
                        </Link>
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Portfolio</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
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
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
                <Link href="/account">
                  <User className="mr-2 h-4 w-4" />
                  <span>Account</span>
                </Link>
            </DropdownMenuItem>
             <DropdownMenuItem asChild>
              <Link href="/watchlist">
                  <Eye className="mr-2 h-4 w-4" />
                  <span>Watchlist</span>
              </Link>
            </DropdownMenuItem>
            {!isPro && (
                <DropdownMenuItem asChild>
                    <Link href="/upgrade">
                        <Star className="mr-2 h-4 w-4 text-yellow-500" />
                        <span>Upgrade to Pro</span>
                    </Link>
                </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={async () => await logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
