
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
import { useUser } from '@/firebase';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { Button } from '../ui/button';
import { ArrowRight, Lock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import type { Alert } from '@/lib/types';


export default function AlertCreatorCard() {
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';
  const [key, setKey] = useState(Date.now()); // Used to reset form

  const handleSubmitted = () => {
    // Reset the forms by changing the key of the containing element
    setKey(Date.now());
  };

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
                    <TabsTrigger value="advanced" disabled={!isPro}>
                        <div className="flex items-center gap-2">
                            Advanced Builder
                            {!isPro && <Badge variant="secondary">Pro</Badge>}
                        </div>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="quick" className="pt-6">
                    <QuickAlertConfigurator onSubmitted={handleSubmitted} />
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
                    <AlertBuilder onSave={handleSubmitted} isPro={isPro}/>
                </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
  );
}
