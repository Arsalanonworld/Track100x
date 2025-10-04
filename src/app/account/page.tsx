
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Badge } from '@/components/ui/badge';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useTestUser } from '@/firebase/client-provider';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { isTestUser, setIsTestUser } = useTestUser();
  const router = useRouter();
  const firestore = useFirestore();
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user && !isTestUser) {
      router.push('/auth/login');
    }
  }, [user, isUserLoading, isTestUser, router]);

  const handleLogout = async () => {
    if (isTestUser) {
        setIsTestUser(false);
    } else {
        await logout();
    }
    router.push('/');
  };
  
  const isLoading = isUserLoading || isUserDataLoading;
  
  const displayUser = isTestUser ? {
    email: 'test.user@example.com',
    uid: 'test-user-uid',
    displayName: 'Test User'
  } : user;

  const displayUserData = isTestUser ? {
    username: 'testuser',
    plan: 'pro'
  } : userData;


  if (isLoading && !isTestUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!displayUser || !displayUserData) {
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
                    <p className="text-primary-foreground">{displayUser.email}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="w-24 font-semibold text-muted-foreground">Username</p>
                    <p className="text-primary-foreground">{displayUserData.username}</p>
                </div>
                <div className="flex items-center gap-4">
                    <p className="w-24 font-semibold text-muted-foreground">User ID</p>
                    <p className="font-mono text-sm text-muted-foreground">{displayUser.uid}</p>
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
                        You are currently on the {displayUserData.plan} plan.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 rounded-lg border bg-card-nested p-4">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Current Plan</h4>
                            <Badge variant={displayUserData.plan === 'pro' ? 'default' : 'secondary'} className="capitalize">{displayUserData.plan}</Badge>
                        </div>
                        {displayUserData.plan === 'free' && (
                            <>
                                <p className="text-muted-foreground">
                                    Upgrade to Pro to unlock unlimited alerts, real-time data, and advanced features.
                                </p>
                                <Button className="w-full" asChild>
                                    <Link href="/upgrade">Upgrade to Pro</Link>
                                </Button>
                            </>
                        )}
                        {displayUserData.plan === 'pro' && (
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
