
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";

const mockTriggeredAlerts = [
    { id: '1', rule: 'Sent > $1M to CEX', entity: 'PEPE Whale', time: '5 min ago', value: '$1.2M USDT', target: 'Binance' },
    { id: '2', rule: 'Balance Change > 1k ETH', entity: "Vitalik's Main", time: '20 min ago', value: '+1,500 ETH', target: '' },
    { id: '3', rule: 'Price < $2.00', entity: 'WIF', time: '1 hour ago', value: '$1.98', target: '' },
];


export default function AlertHistory() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Alerts Summary</CardTitle>
                <CardDescription>A real-time log of your most recent triggered alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {mockTriggeredAlerts.slice(0, 3).map((alert) => (
                        <div key={alert.id} className="flex items-start gap-4 p-3 border-b last:border-b-0 -mx-3">
                             <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                                <Bell className="w-4 h-4 text-primary" />
                            </div>
                            <div className="flex-1">
                               <div className="flex justify-between items-start">
                                    <div className="font-medium text-sm flex-1 leading-snug">
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
                    {mockTriggeredAlerts.length === 0 && (
                        <div className="text-center text-muted-foreground py-8">
                            <p>No triggered alerts yet.</p>
                            <p className="text-sm">Activity will appear here live.</p>
                        </div>
                    )}
                </div>
                 {mockTriggeredAlerts.length > 0 && <Button variant="link" size="sm" asChild className="w-full mt-4">
                    <Link href="#">View All Alerts</Link>
                </Button>}
            </CardContent>
        </Card>
    );
}
