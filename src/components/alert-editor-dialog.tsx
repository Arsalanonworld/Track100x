'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { QuickAlertConfigurator } from './quick-alert-configurator';
import AlertBuilder from './alerts/alert-builder';
import type { Alert } from '@/lib/types';
import { useUser } from '@/firebase';
import { Lock, Zap } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';

export const AlertEditorDialog = ({
  onOpenChange,
  entity,
  alert,
}: {
  onOpenChange: (open: boolean) => void;
  entity?: { type: 'wallet' | 'token'; identifier: string };
  alert?: Alert;
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'advanced'>(
    alert?.type || 'quick'
  );
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';

  const handleSubmitted = () => {
    onOpenChange(false);
  };

  const finalEntity = alert
    ? { type: alert.alertType, identifier: alert.walletId || alert.token || '' }
    : entity;

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{alert ? 'Edit Alert' : 'Create Alert'}</DialogTitle>
        <DialogDescription>
          {finalEntity ? (
            <>
              Set up a notification for:{' '}
              <span className="font-mono text-foreground bg-muted p-1 rounded-sm">
                {finalEntity.identifier}
              </span>
            </>
          ) : (
            'Create a new alert to track on-chain activity.'
          )}
        </DialogDescription>
      </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as 'quick' | 'advanced')}
          className="pt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPro}>
              <div className="flex items-center gap-2">
                 {!isPro && <Lock className="h-3 w-3" />}
                <span>Advanced Builder</span>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator
              onSubmitted={handleSubmitted}
              entity={finalEntity}
              alert={alert}
            />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
             {isPro ? (
                 <AlertBuilder 
                    onSave={handleSubmitted}
                    onCancel={() => onOpenChange(false)}
                    entity={finalEntity}
                    alert={alert}
                />
             ) : (
                <Card className="text-center p-8 space-y-4 rounded-lg bg-card border shadow-lg border-primary">
                    <div className='mx-auto bg-primary/10 w-12 h-12 flex items-center justify-center rounded-full'>
                        <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-2xl font-bold">Unlock the Advanced Builder</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto">
                        Create complex, multi-conditional alerts to precisely monitor market events.
                    </p>
                    <Button asChild>
                        <Link href="/upgrade">Upgrade to Pro</Link>
                    </Button>
                </Card>
             )}
          </TabsContent>
        </Tabs>
    </DialogContent>
  );
};
