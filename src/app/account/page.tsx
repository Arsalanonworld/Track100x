
'use client';

import PageHeader from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, User, Bell, Link as LinkIcon, Bot, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

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
  const plan = claims?.plan || 'free';
  const isPro = plan === 'pro';

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

      <div className="space-y-8">
        {/* Profile Card */}
        <Card>
            <CardHeader>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>This information is visible to us and used for account purposes.</CardDescription>
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
                  <p className="text-sm font-semibold">Price: <span className="font-normal">$23/month (Billed Annually)</span></p>
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
              <CardDescription>Control how you receive alerts.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                        <Bell className="h-5 w-5 text-muted-foreground" />
                        <p className='font-medium'>In-App Notifications</p>
                    </div>
                     <Switch defaultChecked disabled />
                </div>
                 <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                        <Circle className="h-5 w-5 text-green-500 fill-green-500" />
                        <p className='font-medium'>Email Notifications</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <span className="text-sm text-muted-foreground">{user.email}</span>
                        <Switch defaultChecked />
                    </div>
                </div>
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <p className='font-medium'>Telegram Notifications</p>
                    </div>
                     <Button variant="secondary"><LinkIcon className='h-4 w-4 mr-2'/>Connect</Button>
                </div>
                <div className='flex items-center justify-between p-4 border rounded-lg'>
                    <div className='flex items-center gap-3'>
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <p className='font-medium'>Discord Notifications</p>
                    </div>
                     <Button variant="secondary"><LinkIcon className='h-4 w-4 mr-2'/>Connect</Button>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
