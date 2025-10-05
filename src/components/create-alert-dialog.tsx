
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


export const CreateAlertDialog = ({ onOpenChange }: { onOpenChange: (open: boolean) => void }) => {
    
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
            <TabsTrigger value="advanced">
                 <div className="flex items-center gap-2">
                    Advanced Builder
                </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="quick" className="pt-6">
            <QuickAlertConfigurator onSubmitted={() => onOpenChange(false)} />
          </TabsContent>
          <TabsContent value="advanced" className="pt-6">
            <AlertBuilder onSave={() => onOpenChange(false)} isPro={true} />
          </TabsContent>
        </Tabs>
    </DialogContent>
    )
};
