
'use client';

import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { logout } from '@/lib/actions';
import { doc, setDoc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import { Badge } from '@/components/ui/badge';
import { Bell, Mail, MessageSquare, Loader2, User as UserIcon, CreditCard, Shield } from 'lucide-react';
import Link from 'next/link';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { AnimatedButton } from '@/components/ui/animated-button';
import { useToast } from '@/hooks/use-toast';

export default function AccountPage() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();
  const [isCancelling, setIsCancelling] = useState(false);
  
  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  
  const { data: userData, isLoading: isUserDataLoading, refetch } = useDoc(userDocRef);

  useEffect(() => {
    if (!isUserLoading && !user) {
        setAuthDialogOpen(true);
        router.push('/');
    }
  }, [user, isUserLoading, router, setAuthDialogOpen]);

  const handleLogout = async () => {
    await logout();
  };

  const handleManageSubscription = async () => {
    if (!userDocRef) return;
    setIsCancelling(true);
    try {
      await setDoc(userDocRef, {
        plan: "free",
        entitlements: {
            alerts: { maxActive: 1, channels: ["in-app"] },
            feed: { delayMinutes: 2 },
            leaderboard: { topN: 10 },
            apiAccess: false
        },
      }, { merge: true });
      
      toast({
        title: "Subscription Cancelled",
        description: "Your Pro plan has been cancelled. You now have Free plan features.",
      });
      refetch();
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Error",
            description: "Could not update your subscription.",
        });
    } finally {
        setIsCancelling(false);
    }
  };
  
  const isLoading = isUserLoading || isUserDataLoading;
  
  if (isLoading || !user || !userData) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  const isPro = userData?.plan === 'pro';

  return (
    <>
      <PageHeader
        title="Settings"
        description="Manage your profile, subscription, and notification preferences."
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Profile</CardTitle>
                    <CardDescription>Your personal information.</CardDescription>
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

            <Card>
                <CardHeader>
                    <CardTitle>Notification Channels</CardTitle>
                    <CardDescription>Connect your accounts to receive real-time alerts on your favorite platforms.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-center gap-4">
                            <Mail className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Email Notifications</p>
                                <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                        </div>
                        <Button variant="secondary" disabled>Connected</Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                         <div className="flex items-center gap-4">
                            <MessageSquare className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Telegram</p>
                                <p className="text-sm text-muted-foreground">Receive alerts via Telegram bot</p>
                            </div>
                        </div>
                         <Button variant="outline" disabled={!isPro}>
                          {isPro ? 'Connect' : 'Pro Feature'}
                         </Button>
                    </div>
                    <div className="flex items-center justify-between rounded-lg border p-4">
                         <div className="flex items-center gap-4">
                            <Bell className="h-6 w-6 text-muted-foreground" />
                            <div>
                                <p className="font-semibold">Discord</p>
                                <p className="text-sm text-muted-foreground">Receive alerts via Discord webhook</p>
                            </div>
                        </div>
                         <Button variant="outline" disabled={!isPro}>
                          {isPro ? 'Connect' : 'Pro Feature'}
                         </Button>
                    </div>
                    {!isPro && (
                      <p className="text-sm text-center text-muted-foreground pt-2">
                         <Link href="/upgrade" className="text-primary hover:underline font-semibold">Upgrade to Pro</Link> to unlock Telegram and Discord notifications.
                      </p>
                    )}
                </CardContent>
            </Card>
        </div>

        <div className="md:col-span-1">
             <Card>
                <CardHeader>
                    <CardTitle>Subscription</CardTitle>
                    <CardDescription>You are currently on the <span className="font-bold">{userData.plan}</span> plan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4 rounded-lg border bg-muted/50 p-6">
                        <div className="flex justify-between items-center">
                            <h4 className="text-lg font-semibold">Current Plan</h4>
                            <Badge variant={isPro ? 'default' : 'secondary'} className="capitalize">{userData.plan}</Badge>
                        </div>
                        {isPro ? (
                            <>
                            <p className="text-muted-foreground">You have access to all Pro features.</p>
                                <Button className="w-full" onClick={handleManageSubscription} disabled={isCancelling || isLoading}>
                                {isCancelling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Cancel Subscription
                                </Button>
                            </>
                        ) : (
                            <>
                                <p className="text-muted-foreground">Upgrade to Pro to unlock unlimited alerts, real-time data, and advanced features.</p>
                                <AnimatedButton className="w-full" asChild>
                                    <Link href="/upgrade">Upgrade to Pro</Link>
                                </AnimatedButton>
                            </>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </>
  );
}
