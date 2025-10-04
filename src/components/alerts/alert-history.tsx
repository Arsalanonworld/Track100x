'use client';
import { Card, CardContent } from '@/components/ui/card';
import { useUser } from '@/firebase';
import { CheckCircle, History } from 'lucide-react';
import React from 'react';

export default function AlertHistory() {
  const { user } = useUser();
  const recentAlerts: any[] = []; // Placeholder for history

  return (
    <div>
      <h2 className="text-2xl font-bold font-headline mb-4 flex items-center gap-2">
        <History className="h-6 w-6" />
        Alert History
      </h2>
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {user &&
              recentAlerts.map((item) => (
                <li key={item.id} className="p-4 flex items-start gap-4">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                  <div className="flex-grow">
                    <p>
                      <span className="font-semibold">{item.name}</span>{' '}
                      <span className="text-muted-foreground">triggered:</span>{' '}
                      {item.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {item.delivery} &bull; {item.time}
                    </p>
                  </div>
                </li>
              ))}
            {!user && (
              <li className="p-8 text-center text-muted-foreground">
                Your triggered alert history will appear here.
              </li>
            )}
            {user && recentAlerts.length === 0 && (
              <li className="p-8 text-center text-muted-foreground">
                No alerts have been triggered recently.
              </li>
            )}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
