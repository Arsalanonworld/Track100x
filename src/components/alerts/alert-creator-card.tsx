
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

export default function AlertCreatorCard() {

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Alert</CardTitle>
        <CardDescription>
          Build a custom alert to track on-chain activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quick" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced">
                 <div className="flex items-center gap-2">
                    Advanced Builder
                </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            <AlertBuilder onSave={() => {}} isPro={true} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
