
'use client';

import { Bell, Pencil, Trash2, Wallet, Zap, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import QuickAlertEditor from './quick-alert-editor';
import AlertBuilder from './alert-builder';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';
import { mockAlerts } from '@/lib/mock-data';


const iconMap = {
  wallet: <Wallet className="h-4 w-4 text-muted-foreground" />,
  token: <Zap className="h-4 w-4 text-muted-foreground" />,
};

export default function ActiveAlerts() {
    const { toast } = useToast();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const [alerts, setAlerts] = useState(mockAlerts);

    const handleSave = () => {
        if (selectedAlert) {
            toast({
                title: 'Alert Updated!',
                description: 'Your alert has been successfully updated.',
            });
        }
        setIsEditorOpen(false);
        setSelectedAlert(null);
    };

    const handleCancel = () => {
        setIsEditorOpen(false);
        setSelectedAlert(null);
    };


    async function toggleAlert(alertToToggle: Alert) {
        setAlerts(currentAlerts => currentAlerts.map(a => a.id === alertToToggle.id ? {...a, enabled: !a.enabled} : a));
    }

    return (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <Card>
                <CardHeader>
                  <CardTitle>Your Active Alerts</CardTitle>
                  <CardDescription>
                      Manage your saved alerts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {alerts && alerts.length > 0 ? (
                    alerts.map(alert => (
                        <div
                        key={alert.id}
                        className={cn(
                            'p-3 rounded-lg border flex items-center justify-between gap-4',
                            !alert.enabled && 'bg-muted/50'
                        )}
                        >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary rounded-md">
                                {iconMap[alert.type]}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{alert.title}</p>
                                <p className="text-xs text-muted-foreground">
                                    {alert.description}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                            <div className='flex items-center gap-1 mr-2'>
                                <p className='text-sm font-medium'>{alert.enabled ? "Active" : "Inactive"}</p>
                                <Switch
                                    checked={alert.enabled}
                                    onCheckedChange={() => toggleAlert(alert)}
                                    aria-label="Toggle alert"
                                />
                            </div>
                        </div>
                        </div>
                    ))
                    ) : (
                    <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                        <Bell className="h-10 w-10 mb-4" />
                        <p className="font-semibold">No active alerts found.</p>
                        <p className="text-sm">
                        Create an alert to get started with real-time tracking.
                        </p>
                    </div>
                    )}
                </div>
                </CardContent>
            </Card>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                <DialogTitle>
                    Edit Alert
                </DialogTitle>
                </DialogHeader>
                {selectedAlert && ( true ? ( 
                    <AlertBuilder onSave={handleSave} isPro={true}/>
                ) : (
                    <QuickAlertEditor
                        entity={{
                            type: selectedAlert.type === 'wallet' ? 'Wallet' : 'Token',
                            identifier: selectedAlert.title || '',
                            label: selectedAlert.title || ''
                        }}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );
}
