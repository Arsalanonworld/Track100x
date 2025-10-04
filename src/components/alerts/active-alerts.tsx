
'use client';

import { Bell, Pencil, Trash2, Wallet, Zap } from 'lucide-react';
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
import { Badge } from '../ui/badge';
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
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { type Alert } from '@/lib/types';


const iconMap = {
  wallet: <Wallet className="h-5 w-5 text-muted-foreground" />,
  token: <Zap className="h-5 w-5 text-muted-foreground" />,
};

export default function ActiveAlerts() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const alertsRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, `users/${user.uid}/alerts`);
    }, [user, firestore]);

    const { data: alerts } = useCollection<Alert>(alertsRef);
    
    // This is a placeholder. In a real app, this would come from user data.
    const isPro = true; 
    const canAddAlert = () => true;

    async function handleDelete(id: string) {
        if (!user || !firestore) return;
        await deleteDoc(doc(firestore, `users/${user.uid}/alerts`, id));
        toast({
            title: 'Alert Deleted',
            variant: 'destructive',
        });
    }

    const handleEdit = (alert: Alert) => {
        // if (!isPro && !alert.isQuick) {
        //   toast({
        //     title: 'Pro Feature',
        //     description: 'Editing advanced alerts requires a Pro plan.',
        //     action: (
        //       <Button asChild>
        //         <Link href="/upgrade">Upgrade</Link>
        //       </Button>
        //     ),
        //   });
        //   return;
        // }
        setSelectedAlert(alert);
        setIsEditorOpen(true);
    };

    const handleSave = (newRule: string) => {
        if (selectedAlert) {
            // updateAlert(selectedAlert.id, newRule);
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

    const handleAdvancedSave = () => {
        toast({
            title: 'Alert Updated!',
            description: 'Your advanced alert has been updated.',
        });
        setIsEditorOpen(false);
        setSelectedAlert(null);
    };

    async function toggleAlert(alert: Alert) {
        if (!user || !firestore) return;

        const alertRef = doc(firestore, `users/${user.uid}/alerts`, alert.id);
        await updateDoc(alertRef, { enabled: !alert.enabled });
    }

    const activeAlerts = alerts?.filter(a => a.enabled) || [];

    return (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <Card>
                <CardHeader>
                <div className="flex justify-between items-center">
                    <div>
                    <CardTitle>Your Active Alerts</CardTitle>
                    <CardDescription>
                        {isPro
                        ? 'Manage your saved alerts.'
                        : `You are using ${activeAlerts.length} of 3 available active alerts.`}
                    </CardDescription>
                    </div>
                    {!isPro && !canAddAlert() && (
                    <Button asChild size="sm">
                        <Link href="/upgrade">Upgrade for More</Link>
                    </Button>
                    )}
                </div>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {alerts && alerts.length > 0 ? (
                    alerts.map(alert => (
                        <div
                        key={alert.id}
                        className={cn(
                            'p-4 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4',
                            !alert.enabled && 'bg-muted/50'
                        )}
                        >
                        <div className="flex items-center gap-4">
                            <div className="hidden sm:block">{iconMap[alert.alertType]}</div>
                            <div>
                            <p className="font-semibold">{alert.walletId || alert.token}</p>
                            <p className="text-sm text-muted-foreground">
                                {alert.rule}
                            </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                            <Badge
                            variant={alert.enabled ? 'default' : 'outline'}
                            className="hidden sm:inline-flex"
                            >
                            {alert.enabled ? 'Active' : 'Inactive'}
                            </Badge>
                            <Switch
                            checked={alert.enabled}
                            onCheckedChange={() => toggleAlert(alert)}
                            aria-label="Toggle alert"
                            />
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(alert)}
                            >
                            <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(alert.id)}
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
                    {/* {selectedAlert?.isQuick
                    ? 'Edit Quick Alert'
                    : 'Edit Advanced Alert'} */}
                    Edit Alert
                </DialogTitle>
                </DialogHeader>
                {selectedAlert &&
                ( true ? ( // Assuming isQuick for now
                    <QuickAlertEditor
                    entity={{
                        type: selectedAlert.alertType === 'wallet' ? 'Wallet' : 'Token',
                        identifier: selectedAlert.walletId || selectedAlert.token || '',
                        label: selectedAlert.walletId || selectedAlert.token || ''
                    }}
                    onSave={handleSave}
                    onCancel={handleCancel}
                    />
                ) : (
                    <AlertBuilder entity={selectedAlert} onSave={handleAdvancedSave} />
                ))}
            </DialogContent>
        </Dialog>
    );
}
