
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

export default function AlertCreatorCard() {
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
                    <TabsTrigger value="advanced">
                        Advanced Builder
                    </TabsTrigger>
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
