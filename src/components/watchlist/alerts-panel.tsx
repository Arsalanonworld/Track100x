
'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import ActiveAlerts from '@/components/alerts/active-alerts';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import type { Alert } from '@/lib/types';
import Link from 'next/link';
import { ArrowRight, Lock, BellPlus } from 'lucide-react';

const ALERT_LIMIT_FREE = 5;

export function AlertsPanel({ onNewAlert }: { onNewAlert: () => void }) {
  const { user, claims, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const isPro = claims?.plan === 'pro';

  const alertsQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/alerts`));
    }
    return null;
  }, [user, firestore]);

  const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
  const isLoading = userLoading || alertsLoading;
  const alertCount = alerts?.length || 0;
  const alertsAtLimit = !isPro && alerts && alerts.length >= ALERT_LIMIT_FREE;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Manage Alerts</CardTitle>
            <CardDescription>
              {isPro
                ? `You have ${alertCount} active alerts.`
                : `You are using ${alertCount} of ${ALERT_LIMIT_FREE} alerts.`}
            </CardDescription>
          </div>
          <Button size="sm" onClick={onNewAlert} disabled={alertsAtLimit}>
            <BellPlus className="h-4 w-4 mr-2" />
            New Alert
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {alertsAtLimit && (
          <div className="p-4 rounded-lg bg-secondary border border-primary/50 text-center space-y-3 mb-6">
            <Lock className="w-6 h-6 text-primary mx-auto" />
            <h3 className="text-lg font-semibold">Alert Limit Reached</h3>
            <p className="text-muted-foreground text-sm">
              Upgrade to create unlimited alerts.
            </p>
            <Button size="sm" asChild>
              <Link href="/upgrade">Upgrade to Pro <ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
          </div>
        )}
        <ActiveAlerts onNewAlert={onNewAlert} />
      </CardContent>
    </Card>
  );
}
