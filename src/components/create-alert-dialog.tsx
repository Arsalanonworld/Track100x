
'use client';

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


export const CreateAlertDialog = ({ onOpenChange, entity, alert }: { onOpenChange: (open: boolean) => void, entity?: { type: 'wallet' | 'token', identifier: string }, alert?: Alert }) => {
    
    const handleSubmitted = () => {
        onOpenChange(false);
    }

    const finalEntity = alert ? { type: alert.alertType, identifier: alert.walletId || alert.token || '' } : entity;
    
    return (
    <DialogContent className="max-w-2xl">
        <DialogHeader>
            <DialogTitle>{alert ? 'Edit Alert' : 'Create a New Alert'}</DialogTitle>
            <DialogDescription>
                {finalEntity ? (
                    <>
                    Set up a notification for: <span className='font-mono text-foreground'>{finalEntity.identifier}</span>
                    </>
                ) : (
                    "Build a custom alert from scratch to track on-chain activity."
                )}
            </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced">
                Advanced Builder
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator onSubmitted={handleSubmitted} entity={finalEntity} alert={alert} />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            <AlertBuilder onSave={handleSubmitted} alert={alert}/>
          </TabsContent>
        </Tabs>
    </DialogContent>
    )
};
