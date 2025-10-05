
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
import { useUser } from '@/firebase';
import { Badge } from './ui/badge';
import Link from 'next/link';
import { Button } from './ui/button';
import { ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';


export const CreateAlertDialog = ({ onOpenChange, entity, alert }: { onOpenChange: (open: boolean) => void, entity?: { type: 'wallet' | 'token', identifier: string }, alert?: Alert }) => {
    const { claims } = useUser();
    const isPro = claims?.plan === 'pro';
    
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
            <TabsTrigger value="advanced" disabled={!isPro}>
                 <div className="flex items-center gap-2">
                    Advanced Builder
                    {!isPro && <Badge variant="secondary">Pro</Badge>}
                </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator onSubmitted={handleSubmitted} entity={finalEntity} alert={alert} />
          </TabsContent>
          <TabsContent value="advanced" className={cn("pt-6", !isPro && 'relative')}>
             {!isPro && (
                <div className="absolute inset-0 z-10 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-lg -m-6">
                    <div className="text-center p-8 space-y-4">
                        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <Lock className="w-8 h-8 text-primary" />
                        </div>
                        <h3 className="text-2xl font-bold">Unlock the Alert Builder</h3>
                        <p className="text-muted-foreground max-w-sm">
                           Create complex, multi-conditional alerts with the advanced builder, exclusive to Pro users.
                        </p>
                        <div className="flex justify-center gap-4 pt-4">
                             <Button asChild>
                                <Link href="/upgrade">Upgrade to Pro <ArrowRight className="ml-2 h-4 w-4"/></Link>
                            </Button>
                        </div>
                    </div>
                </div>
             )}
            <AlertBuilder onSave={handleSubmitted} isPro={isPro} alert={alert}/>
          </TabsContent>
        </Tabs>
    </DialogContent>
    )
};
