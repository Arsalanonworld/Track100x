
'use client';

import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Sparkles, Edit, Trash2, Wallet, Tag, History, CheckCircle, PauseCircle, PlayCircle, MoreVertical, Loader2, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { CreateAlertModal } from '@/components/create-alert-modal';

export default function AlertsPage() {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);
  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const alertsRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return collection(firestore, 'users', user.uid, 'alerts');
  }, [firestore, user]);
  const { data: alerts, isLoading: isAlertsLoading } = useCollection(alertsRef);
  
  React.useEffect(() => {
    if (!isUserLoading && !user) {
      router.push('/auth/login?next=/alerts');
    }
  }, [user, isUserLoading, router]);

  const userPlan = userData?.plan || 'free';
  const isPro = userPlan === 'pro';
  
  const activeAlertCount = alerts?.length ?? 0;
  const freeAlertLimit = userData?.entitlements?.alerts?.maxActive ?? 3;
  const canCreateAlert = isPro || activeAlertCount < freeAlertLimit;

  const handleToggleAlert = async (alertId: string, currentStatus: boolean) => {
    if (!firestore || !user) return;
    const alertDocRef = doc(firestore, 'users', user.uid, 'alerts', alertId);
    try {
      await updateDoc(alertDocRef, { enabled: !currentStatus });
      toast({
        title: `Alert ${!currentStatus ? 'resumed' : 'paused'}.`
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error updating alert.' });
    }
  };

  const handleDeleteAlert = async (alertId: string) => {
     if (!firestore || !user) return;
    const alertDocRef = doc(firestore, 'users', user.uid, 'alerts', alertId);
    try {
      await deleteDoc(alertDocRef);
       toast({
        title: `Alert deleted.`
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting alert.' });
    }
  }


  const isLoading = isUserLoading || isUserDataLoading || isAlertsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-200px)]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const recentAlerts: any[] = []; // Placeholder for history

  return (
    <>
      <PageHeader
        title="Your Alerts"
        description="Track whales, wallets, and tokens in real-time. Never miss a big move."
      />
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Alert
                </Button>
            </DialogTrigger>
            {user ? (
                <CreateAlertModal isPro={isPro} canCreateAlert={canCreateAlert} userId={user.uid} />
            ) : (
                 <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Sign Up to Create Alerts</DialogTitle>
                        <DialogDescription>
                            Create a free account to get started with up to {freeAlertLimit} custom alerts.
                        </DialogDescription>
                    </DialogHeader>
                    <Alert>
                        <AlertTitle>Login Required</AlertTitle>
                        <AlertDescription>
                            Please log in or create an account to manage your alerts.
                        </AlertDescription>
                    </Alert>
                    <Button className="w-full" asChild><a href="/auth/login">Login / Sign Up</a></Button>
                 </DialogContent>
            )}
        </Dialog>

        {!isPro && user && (
             <Button variant="secondary" asChild>
                <a href="/upgrade">
                    <Sparkles className="mr-2 h-4 w-4 text-primary" />
                    Upgrade to Unlock Advanced Alerts
                </a>
            </Button>
        )}
      </div>

        <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold font-headline mb-4">
                Active Alerts ({activeAlertCount})
              </h2>
               {!isPro && user && (
                    <Alert className="mb-4 bg-primary/5 border-primary/20 text-primary-foreground">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Upgrade to Pro</AlertTitle>
                        <AlertDescription>
                            You have {Math.max(0, freeAlertLimit - activeAlertCount)} of {freeAlertLimit} free alerts remaining. {' '}
                            <a href="/upgrade" className="font-semibold hover:underline">Upgrade</a> for unlimited alerts & advanced rules.
                        </AlertDescription>
                    </Alert>
                 )}
              
                {user && alerts && alerts.length > 0 ? (
                    <Accordion type="single" collapsible className="space-y-4">
                        {alerts.map((alert) => (
                            <AccordionItem value={alert.id} key={alert.id} className="border-b-0">
                                <Card className="overflow-hidden">
                                    <div className="flex items-center p-4">
                                        <div className="flex-shrink-0">
                                        {alert.alertType === 'wallet' ? <Wallet className="h-6 w-6 text-accent-foreground"/> : <Tag className="h-6 w-6 text-accent-foreground"/>}
                                        </div>
                                        <div className="flex-grow mx-4">
                                            <p className="font-semibold">{alert.title}</p>
                                            <p className="text-sm text-muted-foreground">
                                                {`Notify when ${alert.alertType} ${alert.rule} > $${alert.threshold}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2 ml-4">
                                        <Badge variant={alert.enabled ? 'default' : 'secondary'}>{alert.enabled ? 'Active' : 'Paused'}</Badge>
                                            <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:rotate-90">
                                                <MoreVertical className="h-4 w-4"/>
                                            </AccordionTrigger>
                                        </div>
                                    </div>
                                    <AccordionContent>
                                        <div className="bg-muted/50 px-4 py-3 border-t">
                                            <div className="flex justify-between items-center text-sm">
                                                <div className="text-muted-foreground">
                                                    <p>Last triggered: <span className="text-foreground">Never</span></p>
                                                    <p>Created on: <span className="text-foreground">{alert.createdAt ? new Date(alert.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span></p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => handleToggleAlert(alert.id, alert.enabled)}>
                                                        {alert.enabled ? <PauseCircle className="mr-2" /> : <PlayCircle className="mr-2" />}
                                                        {alert.enabled ? 'Pause' : 'Resume'}
                                                    </Button>
                                                    <Button variant="ghost" size="sm" disabled>
                                                        <Edit className="mr-2"/>
                                                        Edit
                                                    </Button>
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDeleteAlert(alert.id)}>
                                                        <Trash2 className="mr-2"/>
                                                        Delete
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </AccordionContent>
                                </Card>
                        </AccordionItem>
                        ))}
                    </Accordion>
                 ) : (
                    <div className="text-center py-16">
                        <h2 className="text-4xl font-bold font-headline mb-2">Your Market Edge is One Alert Away.</h2>
                        <p className="text-muted-foreground text-lg mb-6">Create a custom alert now and never miss a critical market move again.</p>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="lg">
                                    Create a Free Alert
                                    <ArrowRight className="ml-2" />
                                </Button>
                            </DialogTrigger>
                            {user && (
                                <CreateAlertModal isPro={isPro} canCreateAlert={canCreateAlert} userId={user.uid} />
                            )}
                        </Dialog>
                    </div>
                )}
            </div>

            <div>
                 <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
                    <History className="h-6 w-6" />
                    Alert History
                </h2>
                <Card>
                    <CardContent className="p-0">
                        <ul className="divide-y">
                            {user && recentAlerts.map(item => (
                                <li key={item.id} className="p-4 flex items-start gap-4">
                                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1"/>
                                    <div className="flex-grow">
                                        <p><span className="font-semibold">{item.name}</span> <span className="text-muted-foreground">triggered:</span> {item.description}</p>
                                        <p className="text-xs text-muted-foreground">{item.delivery} &bull; {item.time}</p>
                                    </div>
                                </li>
                            ))}
                             {!user && (
                                <li className="p-8 text-center text-muted-foreground">
                                    Your triggered alert history will appear here.
                                </li>
                            )}
                             {user && recentAlerts.length === 0 && (
                                 <li className="p-8 text-center text-muted-foreground">
                                    No alerts have been triggered recently.
                                 </li>
                             )}
                        </ul>
                    </CardContent>
                </Card>
            </div>
        </div>
    </>
  );
}
