
'use client';

import PageHeader from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, User, Bell, Link as LinkIcon, Bot, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';

function AccountSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-64" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
         <Card>
            <CardHeader><Skeleton className="h-6 w-1/4" /></CardHeader>
            <CardContent><Skeleton className="h-10 w-full" /></CardContent>
        </Card>
      </div>
    </div>
  );
}


export default function AccountPage() {
  const { user, claims, loading } = useUser();
  const { toast } = useToast();
  const plan = claims?.plan || 'free';
  const isPro = plan === 'pro';

  const handleConnectTelegram = () => {
    toast({
        title: "Coming Soon!",
        description: "Telegram integration is not yet available.",
    })
  }

  if (loading) {
    return <AccountSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please log in to view your account.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="My Account"
        description="Manage your profile, subscription, and application settings."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-8">
          {/* Profile Card */}
          <Card>
              <CardHeader>
                <CardTitle>Your Profile</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                  <div className="flex items-center gap-4">
                      <Avatar className="h-20 w-20 border">
                          <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                          <AvatarFallback>
                              {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                          </AvatarFallback>
                      </Avatar>
                      <div className="space-y-1">
                          <p className="text-2xl font-semibold">{user.displayName || 'User'}</p>
                          <p className="text-muted-foreground">{user.email}</p>
                      </div>
                  </div>
                  <div>
                      <p className="font-semibold text-sm text-muted-foreground">User ID</p>
                      <p className="font-mono text-xs bg-muted/50 rounded-sm px-2 py-1 mt-1 inline-block">{user.uid}</p>
                  </div>
              </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Subscription Card */}
          <Card>
              <CardHeader>
                <CardTitle>Subscription Plan</CardTitle>
                <CardDescription>Manage your billing and subscription details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isPro ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="text-base py-1 px-3 bg-green-600 hover:bg-green-700">
                        <Star className="h-4 w-4 mr-2" />
                        Pro Plan
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2">You have full access to all Track100x features.</p>
                    <Separator className="my-6" />
                    <p className="text-sm font-semibold">Next billing date: <span className="font-normal">January 1, 2025</span></p>
                    <p className="text-sm font-semibold">Price: <span className="font-normal">$79/year (Billed Annually)</span></p>
                    <Button variant="outline" className="mt-4" disabled>Manage Subscription</Button>
                     <p className="text-xs text-muted-foreground mt-2">Redirect to Stripe/LemonSqueezy not implemented.</p>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-base py-1 px-3">
                        <User className="h-4 w-4 mr-2" />
                        Free Plan
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mt-2">You are currently on the Free plan. Upgrade to unlock all features.</p>
                    <Button asChild className="mt-4">
                      <Link href="/upgrade">Upgrade to Pro</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
          </Card>

          {/* Settings Card */}
          <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Connect your accounts to receive alerts.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  <div className='flex items-center justify-between p-4 border rounded-lg'>
                      <div className='flex items-center gap-3'>
                          <Bot className="h-5 w-5 text-muted-foreground" />
                          <div className="space-y-1">
                              <p className='font-medium'>Telegram Alerts</p>
                              <p className='text-xs text-muted-foreground'>Receive instant whale alerts in Telegram.</p>
                          </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                <LinkIcon className="h-4 w-4 mr-2" />
                                Connect
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem onClick={handleConnectTelegram}>
                                Connect Account
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <a href="#" target="_blank" rel="noopener noreferrer">Learn More</a>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
