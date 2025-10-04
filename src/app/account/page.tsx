
'use client';

import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { doc, DocumentData } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  
  const userDocRef = user ? doc(firestore, 'users', user.uid) : null;
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, router]);

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };
  
  const isLoading = isUserLoading || isUserDataLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !userData) {
    return null;
  }


  return (
    <>
      <PageHeader
        title="My Account"
        description="Manage your profile, subscription, and settings."
      />
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
            <Card>
                <CardHeader>
                <CardTitle>Profile Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div className="flex items-center gap-4">
                    <p className="w-24 font-semibold text-muted-foreground">Email</p>
                    <p className="text-primary-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="w-24 font-semibold text-muted-foreground">Username</p>
                    <p className="text-primary-foreground">{userData.username}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="w-24 font-semibold text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm text-muted-foreground">{user.uid}</p>
                </div>
                <Button variant="destructive" onClick={handleLogout}>
                    Log Out
                </Button>
                </CardContent>
            </Card>
        </div>
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>
                        You are currently on the {userData.plan} plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 rounded-lg border bg-card-nested p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Current Plan</h4>
                            <Badge variant={userData.plan === 'pro' ? 'default' : 'secondary'} className="capitalize">{userData.plan}</Badge>
                        </div>
                        {userData.plan === 'free' && (
                            <>
                                <p className="text-muted-foreground">
                                    Upgrade to Pro to unlock unlimited alerts, real-time data, and advanced features.
                                </p>
                                <Button className="w-full" asChild>
                                    <Link href="/upgrade">Upgrade to Pro</Link>
                                </Button>
                            </>
                        )}
                        {userData.plan === 'pro' && (
                             <p className="text-muted-foreground">
                                You have access to all Pro features. Manage your subscription and billing details below.
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
