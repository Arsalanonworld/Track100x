
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { triggeredAlerts as mockAlerts, type TriggeredAlert } from '@/lib/mock-data';

export function AlertHistory() {
    const [alerts, setAlerts] = useState<TriggeredAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API call to fetch historical triggered alerts would go here.
        setLoading(true);
        const timer = setTimeout(() => {
            // Using the same mock data as the notification bell for now.
            setAlerts(mockAlerts);
            setLoading(false);
        }, 1000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <Card>
            <CardHeader>
                <CardTitle>Alert History</CardTitle>
                <CardDescription>A log of your most recent triggered alerts.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {loading ? (
                         <div className="space-y-3 py-2">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-start gap-4 p-2">
                                    <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-1" />
                                    <div className="w-full space-y-2">
                                        <Skeleton className="h-4 w-full" />
                                        <Skeleton className="h-4 w-2/3" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : alerts.length > 0 ? (
                        alerts.map((alert) => (
                           <div key={alert.id} className="flex items-start gap-4 p-2 -mx-2 rounded-lg border">
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
                        <div className="text-center text-sm text-muted-foreground py-16 border-2 border-dashed rounded-lg">
                            <Bell className="mx-auto h-8 w-8 mb-2" />
                            <p className="font-semibold text-base text-foreground">No alerts have been triggered recently.</p>
                            <p>Your alert history will appear here once your conditions are met.</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}
