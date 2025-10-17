
'use client';

import { useState } from 'react';
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QuickAlertConfigurator } from './quick-alert-configurator';
import AlertBuilder from './alerts/alert-builder';
import type { Alert } from '@/lib/types';
import { useUser } from '@/firebase';
import { Lock, Zap, ArrowLeftRight } from 'lucide-react';
import { Button } from './ui/button';
import Link from 'next/link';

export const AlertEditorDialog = ({
  onOpenChange,
  entity,
  alert,
}: {
  onOpenChange: (open: boolean) => void;
  entity?: { type: 'wallet' | 'token'; identifier: string };
  alert?: Alert;
}) => {
  // Default to 'advanced' if the alert being edited is of that type, otherwise 'quick'
  const [mode, setMode] = useState<'quick' | 'advanced'>(
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

  const canSwitchToAdvanced = isPro;

  const toggleMode = () => {
    setMode(prev => prev === 'quick' ? 'advanced' : 'quick');
  }

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{alert ? 'Edit Alert' : 'Create New Alert'}</DialogTitle>
        <DialogDescription>
          {finalEntity ? (
            <>
              Set up a notification for:{' '}
              <span className="font-mono text-foreground bg-muted p-1 rounded-sm">
                {finalEntity.identifier}
              </span>
            </>
          ) : (
            'Create an alert to track on-chain activity.'
          )}
        </DialogDescription>
      </DialogHeader>

      <div className="pt-4 space-y-6">
        {mode === 'quick' ? (
          <QuickAlertConfigurator
            onSubmitted={handleSubmitted}
            entity={finalEntity}
            alert={alert}
          />
        ) : (
          <AlertBuilder 
              onSave={handleSubmitted}
              onCancel={() => onOpenChange(false)}
              entity={finalEntity}
              alert={alert}
              onSwitchToQuick={toggleMode}
          />
        )}
        
        <div className="flex justify-center pt-2">
           {canSwitchToAdvanced ? (
             <Button variant="link" onClick={toggleMode} className="text-muted-foreground">
                <ArrowLeftRight className="mr-2 h-4 w-4" />
                Switch to {mode === 'quick' ? 'Advanced Builder' : 'Quick Alert'}
            </Button>
           ) : (
            mode === 'quick' && (
              <Button variant="link" asChild className="text-muted-foreground">
                  <Link href="/upgrade">
                    <Lock className="mr-2 h-3 w-3" />
                    Unlock Advanced Builder with Pro
                  </Link>
              </Button>
            )
           )}
        </div>
      </div>
    </DialogContent>
  );
};
