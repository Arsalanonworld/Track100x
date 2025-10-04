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
import { useAuthDialog } from '@/hooks/use-auth-dialog';

export default function AlertCreatorCard() {
  const { user, isUserLoading } = useUser();
  const { setAuthDialogOpen } = useAuthDialog();

  // In a real app, isPro would come from user entitlements
  const isPro = true; 

  const userId = user?.uid;

  if (isUserLoading) {
      return null;
  }
  
  if (!userId) {
      // Or show a skeleton/placeholder
      return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Alert</CardTitle>
        <CardDescription>
          Build a custom alert to track on-chain activity.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="advanced" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="quick">Quick Alert</TabsTrigger>
            <TabsTrigger value="advanced">Advanced Builder</TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator isPro={isPro} userId={userId} />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            <AlertBuilder onSave={() => {}} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
