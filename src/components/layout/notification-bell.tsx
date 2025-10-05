
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

const mockTriggeredAlerts = [
    { id: '1', rule: 'Sent > $1M to CEX', entity: 'PEPE Whale', time: '5 min ago', value: '$1.2M USDT', target: 'Binance' },
    { id: '2', rule: 'Balance Change > 1k ETH', entity: "Vitalik's Main", time: '20 min ago', value: '+1,500 ETH', target: '' },
    { id: '3', rule: 'Price < $2.00', entity: 'WIF', time: '1 hour ago', value: '$1.98', target: '' },
];


export default function NotificationBell() {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-1 right-1 flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96" align="end">
                <div className="grid gap-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">Notifications</h4>
                        <p className="text-sm text-muted-foreground">
                            You have 3 unread messages.
                        </p>
                    </div>
                    <div className="grid gap-2">
                        {mockTriggeredAlerts.map((alert) => (
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
                        ))}
                    </div>
                    <Button variant="link" size="sm" asChild className="w-full mt-2">
                        <Link href="/alerts">View All Alerts</Link>
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
