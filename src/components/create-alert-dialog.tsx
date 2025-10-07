
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
import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export const CreateAlertDialog = ({
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

      {isPro ? (
        <Tabs
          value={activeTab}
          onValueChange={value => setActiveTab(value as 'quick' | 'advanced')}
          className="pt-4"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced">
              <div className="flex items-center gap-2">
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
            <AlertBuilder 
                onSave={handleSubmitted}
                onCancel={() => onOpenChange(false)}
                entity={finalEntity}
                alert={alert}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <div className="pt-6">
          <QuickAlertConfigurator
            onSubmitted={handleSubmitted}
            entity={finalEntity}
            alert={alert}
          />
        </div>
      )}
    </DialogContent>
  );
};
