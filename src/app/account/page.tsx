
'use client';

import PageHeader from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Star, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { FeatureLock } from '@/components/feature-lock';

function AccountSkeleton() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 space-y-8">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-4 w-48" />
                    </div>
                </div>
                 <div>
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-8 w-full mt-2" />
                  </div>
            </CardContent>
          </Card>
        </div>
         <div className="lg:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-2/3" />
                </CardHeader>
                <CardContent className="space-y-6">
                     <Skeleton className="h-10 w-32" />
                     <Skeleton className="h-5 w-48" />
                     <Skeleton className="h-10 w-40 mt-4" />
                </CardContent>
            </Card>
         </div>
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
        <div className="relative min-h-[60vh]">
            <div aria-hidden="true" className="pointer-events-none blur-sm">
                <AccountSkeleton />
            </div>
            <FeatureLock />
        </div>
    );
  }

  return (
    <div>
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
        </div>
      </div>
    </div>
  );
}
