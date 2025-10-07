
'use client';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "../ui/button";
import { Bell, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { useState, useEffect } from "react";
import { triggeredAlerts as mockAlerts, type TriggeredAlert } from '@/lib/mock-data';


export default function NotificationBell() {
    const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API call to fetch recent triggered alerts would go here.
        setLoading(true);
        const timer = setTimeout(() => {
            // Example: fetch('/api/alerts/triggered').then(res => res.json()).then(setAlerts);
            setAlerts(mockAlerts);
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    const hasUnread = !loading && alerts.length > 0;

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {hasUnread && (
                        <span className="absolute top-1 right-1 flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            {loading ? "Checking for new alerts..." : hasUnread ? `You have ${alerts.length} unread alerts.` : "No new alerts."}
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {loading ? (
                            <div className="space-y-3 py-2">
                                <div className="flex items-start gap-4"><div className="w-8 h-8 rounded-full bg-muted shrink-0 mt-1"></div><div className="w-full space-y-1"><div className="h-4 w-full rounded-md bg-muted"></div><div className="h-4 w-3/4 rounded-md bg-muted"></div></div></div>
                                <div className="flex items-start gap-4"><div className="w-8 h-8 rounded-full bg-muted shrink-0 mt-1"></div><div className="w-full space-y-1"><div className="h-4 w-full rounded-md bg-muted"></div><div className="h-4 w-3/4 rounded-md bg-muted"></div></div></div>
                            </div>
                        ) : hasUnread ? (
                            alerts.map((alert) => (
                               <div key={alert.id} className="flex items-start gap-4 p-2 -mx-2 rounded-lg hover:bg-muted">
                                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                       <Bell className="w-4 h-4 text-primary" />
                                   </div>
                                   <div className="flex-1">
                                      <div className="flex justify-between items-start">
                                           <div className="font-medium text-sm flex-1">
                                           <Link href="#" className="font-bold hover:underline">{alert.entity}</Link> triggered rule <Badge variant="secondary" className="mx-1">{alert.rule}</Badge>
                                           </div>
                                           <p className="text-xs text-muted-foreground mt-0.5 ml-2 shrink-0">{alert.time}</p>
                                      </div>
                                      <p className="text-sm text-muted-foreground mt-1">
                                           {alert.value} {alert.target && <><ArrowRight className="inline h-3 w-3 mx-1"/> {alert.target}</>}
                                      </p>
                                   </div>
                               </div>
                            ))
                        ) : (
                            <div className="text-center text-sm text-muted-foreground py-8">
                                <p>You're all caught up!</p>
                            </div>
                        )}
                    </div>
                    {hasUnread && (
                        <Button variant="link" size="sm" asChild className="w-full mt-2">
                            <Link href="/watchlist">View All Alerts</Link>
                        </Button>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    )
}
