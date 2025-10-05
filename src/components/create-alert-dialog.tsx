
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { QuickAlertConfigurator } from './quick-alert-configurator';
import type { Alert } from '@/lib/types';


export const CreateAlertDialog = ({ onOpenChange, entity, alert }: { onOpenChange: (open: boolean) => void, entity?: { type: 'wallet' | 'token', identifier: string }, alert?: Alert }) => {
    
    const handleSubmitted = () => {
        onOpenChange(false);
    }

    const finalEntity = alert ? { type: alert.alertType, identifier: alert.walletId || alert.token || '' } : entity;
    
    return (
    <DialogContent className="max-w-xl">
        <DialogHeader>
            <DialogTitle>{alert ? 'Edit Quick Alert' : 'Create Quick Alert'}</DialogTitle>
            <DialogDescription>
                {finalEntity ? (
                    <>
                    Set up a quick notification for: <span className='font-mono text-foreground'>{finalEntity.identifier}</span>
                    </>
                ) : (
                    "Create a quick alert from scratch to track on-chain activity."
                )}
            </DialogDescription>
        </DialogHeader>
        <div className='pt-6'>
            <QuickAlertConfigurator onSubmitted={handleSubmitted} entity={finalEntity} alert={alert} />
        </div>
    </DialogContent>
    )
};
