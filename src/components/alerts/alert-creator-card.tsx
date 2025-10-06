
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
import { useState } from 'react';
import { useUser } from '@/firebase';
import { Lock } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from 'next/link';
import { Button } from '../ui/button';

export default function AlertCreatorCard() {
  const [key, setKey] = useState(Date.now()); // Used to reset form
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';

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
