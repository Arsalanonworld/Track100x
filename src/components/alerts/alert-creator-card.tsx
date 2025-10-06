
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickAlertConfigurator } from '../quick-alert-configurator';
import AlertBuilder from './alert-builder';
import { useState, useMemo } from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { Lock, ArrowRight } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import { Button } from '../ui/button';
import { collection, query } from 'firebase/firestore';
import type { Alert } from '@/lib/types';


const ALERT_LIMIT_FREE = 1;

export default function AlertCreatorCard() {
  const [key, setKey] = useState(Date.now()); // Used to reset form
  const { user, claims } = useUser();
  const isPro = claims?.plan === 'pro';
  const firestore = useFirestore();

  const alertsQuery = useMemo(() => {
    if (user && firestore) {
        return query(collection(firestore, `users/${user.uid}/alerts`));
    }
    return null;
  }, [user, firestore]);

  const { data: alerts } = useCollection<Alert>(alertsQuery);

  const atLimit = !isPro && alerts && alerts.length >= ALERT_LIMIT_FREE;

  const handleSubmitted = () => {
    // Reset the forms by changing the key of the containing element
    setKey(Date.now());
  };

  const AdvancedTabTrigger = isPro ? (
     <TabsTrigger value="advanced">
        Advanced Builder
    </TabsTrigger>
  ) : (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger asChild>
                <TabsTrigger value="advanced" disabled>
                    <Lock className="h-4 w-4 mr-2" />
                    Advanced Builder
                </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
                <p className="font-semibold">Pro Feature</p>
                <p className="text-muted-foreground">Upgrade to Pro to unlock the Advanced Alert Builder.</p>
                 <Button asChild size="sm" className="mt-2">
                    <Link href="/upgrade">Upgrade</Link>
                </Button>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )

  if (atLimit) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Create New Alert</CardTitle>
                 <CardDescription>
                    Build a custom alert to track on-chain activity from scratch.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                    <Lock className="w-8 h-8 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold">Alert Limit Reached</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        You've reached the limit of {ALERT_LIMIT_FREE} active alert for the Free plan. Upgrade for unlimited alerts.
                    </p>
                    <Button asChild>
                        <Link href="/upgrade">Upgrade to Pro <ArrowRight className='w-4 h-4 ml-2'/></Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
  }


  return (
      <Card>
        <CardHeader>
          <CardTitle>Create New Alert</CardTitle>
          <CardDescription>
            Build a custom alert to track on-chain activity from scratch.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Tabs defaultValue="quick" className="w-full" key={key}>
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="quick">Quick Alert</TabsTrigger>
                    {AdvancedTabTrigger}
                </TabsList>
                <TabsContent value="quick" className="pt-6">
                    <QuickAlertConfigurator onSubmitted={handleSubmitted} />
                </TabsContent>
                <TabsContent value="advanced" className="pt-6">
                    <AlertBuilder onSave={handleSubmitted} />
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
  );
}

    