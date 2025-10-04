
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
import Link from 'next/link';
import { useUser, useFirestore, useCollection, useMemoFirebase, updateDocumentNonBlocking, deleteDocumentNonBlocking, useDoc } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { type Alert } from '@/lib/types';


const iconMap = {
  wallet: <Wallet className="h-4 w-4 text-muted-foreground" />,
  token: <Zap className="h-4 w-4 text-muted-foreground" />,
};

export default function ActiveAlerts() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const userDocRef = useMemoFirebase(() => {
      if (!firestore || !user) return null;
      return doc(firestore, 'users', user.uid);
    }, [firestore, user]);
    const { data: userData } = useDoc(userDocRef);
    const isPro = userData?.plan === 'pro';

    const alertsRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/alerts`);
    }, [user, firestore]);

    const { data: alerts } = useCollection<Alert>(alertsRef);
    
    async function handleDelete(id: string) {
        if (!user || !firestore) return;
        const alertDocRef = doc(firestore, `users/${user.uid}/alerts`, id);
        deleteDocumentNonBlocking(alertDocRef);
        toast({
            title: 'Alert Deleted',
            variant: 'destructive',
        });
    }

    const handleEdit = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsEditorOpen(true);
    };

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


    async function toggleAlert(alert: Alert) {
        if (!user || !firestore) return;
        const alertRef = doc(firestore, `users/${user.uid}/alerts`, alert.id);
        updateDocumentNonBlocking(alertRef, { enabled: !alert.enabled });
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
                                {iconMap[alert.alertType]}
                            </div>
                            <div>
                                <p className="font-semibold text-sm">{alert.walletId || alert.token}</p>
                                <p className="text-xs text-muted-foreground">
                                    {alert.rule}
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
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(alert)}
                            className="h-8 w-8"
                            >
                            <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(alert.id)}
                            className="h-8 w-8"
                            >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
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
                {selectedAlert && ( isPro ? ( 
                    <AlertBuilder onSave={handleSave} />
                ) : (
                    <QuickAlertEditor
                        entity={{
                            type: selectedAlert.alertType === 'wallet' ? 'Wallet' : 'Token',
                            identifier: selectedAlert.walletId || selectedAlert.token || '',
                            label: selectedAlert.walletId || selectedAlert.token || ''
                        }}
                        onSave={handleSave}
                        onCancel={handleCancel}
                    />
                ))}
            </DialogContent>
        </Dialog>
    );
}
