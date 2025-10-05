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

export default function AccountPage() {
  const { user, claims, loading } = useUser();
  const plan = claims?.plan || 'free';

  const AccountSkeleton = () => (
    <div className="space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-6 w-2/3" />
      </div>
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
    </div>
  );

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
        description="Manage your profile, settings, and subscription."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src={user.photoURL ?? ''} alt="User avatar" />
                        <AvatarFallback>
                            {user.displayName ? user.displayName.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-semibold">{user.displayName || 'User'}</p>
                        <p className="text-muted-foreground">{user.email}</p>
                    </div>
                </div>
                <div>
                    <p className="font-semibold text-muted-foreground">User ID</p>
                    <p className="font-mono text-xs break-all">{user.uid}</p>
                </div>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Subscription Plan</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {plan === 'pro' ? (
                <div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-base py-1 px-3 bg-green-600 hover:bg-green-700">
                      <Star className="h-4 w-4 mr-2" />
                      Pro Plan
                    </Badge>
                  </div>
                  <p className="text-muted-foreground mt-2">You have full access to all features.</p>
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
                  <p className="text-muted-foreground mt-2">You are currently on the Free plan.</p>
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
