
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Lock, Sparkles } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { QuickAlertConfigurator } from './quick-alert-configurator';
import AlertBuilder from './alerts/alert-builder';
import { Button } from './ui/button';
import { DialogClose } from './ui/dialog';


export const CreateAlertDialog = ({ isPro, canCreateAlert, userId, onOpenChange }: { isPro: boolean, canCreateAlert: boolean, userId: string, onOpenChange: (open: boolean) => void }) => {
    
    return (
    <DialogContent className="max-w-2xl">
        <DialogHeader>
            <DialogTitle>Create a New Alert</DialogTitle>
            <DialogDescription>
                Set up a notification for on-chain events.
            </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced" disabled={!isPro}>
                 <div className="flex items-center gap-2">
                    {!isPro && <Lock className="h-3 w-3" />}
                    Advanced Builder
                </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            {!canCreateAlert ? (
                     <Alert className="bg-primary/5 border-primary/20 text-primary-foreground text-center">
                        <Sparkles className="h-4 w-4 text-primary" />
                        <AlertTitle className="text-primary">Free Alert Limit Reached</AlertTitle>
                        <AlertDescription>
                            You have used all your available alerts. {' '}
                            <a href="/upgrade" className="font-semibold hover:underline">Upgrade to Pro</a> for unlimited alerts.
                        </AlertDescription>
                    </Alert>
                ) : (
                    <QuickAlertConfigurator isPro={isPro} userId={userId} onSubmitted={() => onOpenChange(false)} />
                )}
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            {isPro ? (
                <AlertBuilder onSave={() => onOpenChange(false)} />
            ) : (
                <Card className="relative overflow-hidden border-dashed border-2">
                    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm p-8 text-center">
                        <Lock className="h-10 w-10 text-primary mb-4" />
                        <h3 className="text-xl font-bold font-headline mb-2">Unlock the Advanced Builder</h3>
                        <p className="text-muted-foreground mb-4">
                            Build powerful, multi-condition rules and unlock more delivery channels.
                        </p>
                        <DialogClose asChild>
                            <Button asChild>
                                <a href="/upgrade">
                                    <Sparkles className="mr-2 h-4 w-4" />
                                    Upgrade to Pro
                                </a>
                            </Button>
                        </DialogClose>
                    </div>
                    <CardHeader>
                      <CardTitle>Advanced Builder</CardTitle>
                       <CardDescription>
                        Build complex, multi-condition alert rules.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Conditions</label>
                        <div className="p-4 border rounded-md bg-muted/50 text-muted-foreground h-24">
                            (IF Transaction Value {'>'} $1,000,000) AND (Counterparty is "Binance")
                        </div>
                      </div>
                    </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
    </DialogContent>
    )
};
