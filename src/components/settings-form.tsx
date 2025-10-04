
"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Tooltip, TooltipProvider, TooltipTrigger, TooltipContent } from "./ui/tooltip";
import { Lock } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/use-auth";

const SettingsForm = () => {
  const { isPro } = useAuth();
  
  return (
    <div className="space-y-8">
      {/* Alert Preferences Section */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Preferences</CardTitle>
          <CardDescription>Choose how you receive notifications.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-3">
            <Label htmlFor="email-notifications" className="flex flex-col space-y-1">
              <span>Email Notifications</span>
              <span className="font-normal leading-snug text-muted-foreground text-xs sm:text-sm">
                Get alerts delivered to your inbox.
              </span>
            </Label>
            <Switch id="email-notifications" defaultChecked/>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="flex items-center justify-between rounded-lg border p-3" data-disabled={!isPro}>
                    <Label htmlFor="telegram-notifications" className="flex flex-col space-y-1 text-left">
                      <span>Telegram Notifications</span>
                    </Label>
                    <div className="flex items-center gap-2">
                        {!isPro && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <Switch id="telegram-notifications" disabled={!isPro} />
                    </div>
                </div>
              </TooltipTrigger>
              {!isPro && (
                <TooltipContent>
                  <p>Upgrade to Pro to enable Telegram notifications.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
           <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="flex items-center justify-between rounded-lg border p-3" data-disabled={!isPro}>
                    <Label htmlFor="discord-notifications" className="flex flex-col space-y-1 text-left">
                      <span>Discord Notifications</span>
                    </Label>
                     <div className="flex items-center gap-2">
                        {!isPro && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <Switch id="discord-notifications" disabled={!isPro} />
                    </div>
                </div>
               </TooltipTrigger>
              {!isPro && (
                <TooltipContent>
                  <p>Upgrade to Pro to enable Discord notifications.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger className="w-full">
                <div className="flex items-center justify-between rounded-lg border p-3" data-disabled={!isPro}>
                    <Label htmlFor="whatsapp-notifications" className="flex flex-col space-y-1 text-left">
                      <span>WhatsApp Notifications</span>
                    </Label>
                     <div className="flex items-center gap-2">
                        {!isPro && <Lock className="h-4 w-4 text-muted-foreground" />}
                        <Switch id="whatsapp-notifications" disabled={!isPro} />
                    </div>
                </div>
               </TooltipTrigger>
              {!isPro && (
                <TooltipContent>
                  <p>Upgrade to Pro to enable WhatsApp notifications.</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </CardContent>
         {!isPro && (
            <CardFooter>
                 <Button variant="link" asChild className="p-0">
                    <Link href="/upgrade">Unlock more delivery options with Pro</Link>
                </Button>
            </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default SettingsForm;
