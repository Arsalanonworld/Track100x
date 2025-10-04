'use client';

import React from 'react';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Wallet,
  Tag,
  Edit,
  Trash2,
  PauseCircle,
  PlayCircle,
  MoreVertical,
  Loader2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUser, useFirestore, useMemoFirebase, useCollection, useDoc } from '@/firebase';
import { collection, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateAlertModal } from '../create-alert-modal';

export default function ActiveAlerts() {
  const { user, isUserLoading } = useUser();
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
        title: `Alert ${!currentStatus ? 'resumed' : 'paused'}.`,
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
        title: `Alert deleted.`,
      });
    } catch (error) {
      toast({ variant: 'destructive', title: 'Error deleting alert.' });
    }
  };

  const isLoading = isUserLoading || isUserDataLoading || isAlertsLoading;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-48">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4">
        Active Alerts ({activeAlertCount})
      </h2>
      {!isPro && user && (
        <Alert className="mb-4 bg-primary/5 border-primary/20 text-primary-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <AlertTitle className="text-primary">Upgrade to Pro</AlertTitle>
          <AlertDescription>
            You have {Math.max(0, freeAlertLimit - activeAlertCount)} of{' '}
            {freeAlertLimit} free alerts remaining.{' '}
            <a
              href="/upgrade"
              className="font-semibold hover:text-primary/90 transition-colors"
            >
              Upgrade
            </a>{' '}
            for unlimited alerts & advanced rules.
          </AlertDescription>
        </Alert>
      )}

      {user && alerts && alerts.length > 0 ? (
        <Accordion type="single" collapsible className="space-y-4">
          {alerts.map((alert: any) => (
            <AccordionItem value={alert.id} key={alert.id} className="border-b-0">
              <Card className="overflow-hidden hover:shadow-md hover:-translate-y-px">
                <div className="flex items-center p-4">
                  <div className="flex-shrink-0">
                    {alert.alertType === 'wallet' ? (
                      <Wallet className="h-6 w-6 text-accent-foreground" />
                    ) : (
                      <Tag className="h-6 w-6 text-accent-foreground" />
                    )}
                  </div>
                  <div className="flex-grow mx-4">
                    <p className="font-semibold">{alert.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {`Notify when ${alert.alertType} ${alert.rule} > $${alert.threshold}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={alert.enabled ? 'default' : 'secondary'}>
                      {alert.enabled ? 'Active' : 'Paused'}
                    </Badge>
                    <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:rotate-90">
                      <MoreVertical className="h-4 w-4" />
                    </AccordionTrigger>
                  </div>
                </div>
                <AccordionContent>
                  <div className="bg-muted/50 px-4 py-3 border-t">
                    <div className="flex justify-between items-center text-sm">
                      <div className="text-muted-foreground">
                        <p>
                          Last triggered:{' '}
                          <span className="text-foreground">Never</span>
                        </p>
                        <p>
                          Created on:{' '}
                          <span className="text-foreground">
                            {alert.createdAt
                              ? new Date(
                                  alert.createdAt.seconds * 1000
                                ).toLocaleDateString()
                              : 'N/A'}
                          </span>
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleToggleAlert(alert.id, alert.enabled)
                          }
                        >
                          {alert.enabled ? (
                            <PauseCircle className="mr-2" />
                          ) : (
                            <PlayCircle className="mr-2" />
                          )}
                          {alert.enabled ? 'Pause' : 'Resume'}
                        </Button>
                        <Button variant="ghost" size="sm" disabled>
                          <Edit className="mr-2" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="mr-2" />
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
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <h3 className="text-xl font-bold font-headline mb-2">No Active Alerts</h3>
            <p className="text-muted-foreground text-sm mb-4">Create an alert to get started.</p>
        </div>
      )}
    </div>
  );
}
