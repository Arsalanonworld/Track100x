
'use client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, ArrowRight } from "lucide-react";
import { Badge } from "../ui/badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { useState, useEffect } from "react";
import { Skeleton } from "../ui/skeleton";

type TriggeredAlert = {
    id: string;
    rule: string;
    entity: string;
    time: string;
    value: string;
    target?: string;
};


export default function AlertHistory() {
    const [triggeredAlerts, setTriggeredAlerts] = useState<TriggeredAlert[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // API call to fetch alert history would go here.
        setLoading(true);
        const timer = setTimeout(() => {
            // Example: fetch('/api/alerts/history').then(res => res.json()).then(setTriggeredAlerts);
            setTriggeredAlerts([]); // Set to empty array as we have no API yet.
            setLoading(false);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);


    return (
        <div className="space-y-4">
            {loading ? (
                 <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-start gap-4 p-3 border-b last:border-b-0 -mx-3">
                            <Skeleton className="w-8 h-8 rounded-full shrink-0 mt-1" />
                            <div className="flex-1 space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : triggeredAlerts.length > 0 ? (
                triggeredAlerts.slice(0, 5).map((alert) => (
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
                ))
            ) : (
                <div className="text-center text-muted-foreground py-8">
                    <p>No triggered alerts yet.</p>
                    <p className="text-sm">Activity will appear here live.</p>
                </div>
            )}
        </div>
    );
}
