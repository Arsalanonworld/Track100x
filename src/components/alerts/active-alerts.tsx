
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
import { useState, useMemo } from 'react';
import {
  Dialog,
  DialogTrigger,
} from '../ui/dialog';
import { cn } from '@/lib/utils';
import type { Alert } from '@/lib/types';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { collection, query, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CreateAlertDialog } from '../create-alert-dialog';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


const iconMap = {
  wallet: <Wallet className="h-4 w-4 text-muted-foreground" />,
  token: <Zap className="h-4 w-4 text-muted-foreground" />,
};

export default function ActiveAlerts() {
    const { toast } = useToast();
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
    const { user, loading: userLoading } = useUser();
    const firestore = useFirestore();

    const alertsQuery = useMemo(() => {
        if (user && firestore) {
            return query(collection(firestore, `users/${user.uid}/alerts`));
        }
        return null;
    }, [user, firestore]);
    
    const { data: alerts, loading: alertsLoading } = useCollection<Alert>(alertsQuery);
    
    const handleEdit = (alert: Alert) => {
        setSelectedAlert(alert);
        setIsEditorOpen(true);
    };

    const handleCloseEditor = () => {
        setSelectedAlert(null);
        setIsEditorOpen(false);
    }

    async function toggleAlert(alertToToggle: Alert) {
        if (!firestore || !user) return;
        const alertRef = doc(firestore, `users/${user.uid}/alerts`, alertToToggle.id);
        updateDoc(alertRef, { enabled: !alertToToggle.enabled })
        .catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: alertRef.path,
                operation: 'update',
                requestResourceData: { enabled: !alertToToggle.enabled },
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }
    
    async function deleteAlert(alertToDelete: Alert) {
        if (!firestore || !user) return;
        const alertRef = doc(firestore, `users/${user.uid}/alerts`, alertToDelete.id);
        deleteDoc(alertRef)
          .then(() => {
              toast({
                  title: 'Alert Deleted',
                  description: 'The alert has been removed.'
              });
          })
          .catch(async (serverError) => {
              const permissionError = new FirestorePermissionError({
                path: alertRef.path,
                operation: 'delete',
            });
            errorEmitter.emit('permission-error', permissionError);
        });
    }

    const isLoading = userLoading || alertsLoading;

    return (
        <Dialog open={isEditorOpen} onOpenChange={setIsEditorOpen}>
            <Card>
                <CardHeader>
                  <CardTitle>Your Active Alerts</CardTitle>
                  <CardDescription>
                      Manage your saved alerts. You have {alerts?.length || 0} active alerts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                <div className="space-y-4">
                    {isLoading && <p>Loading alerts...</p>}
                    {!isLoading && alerts && alerts.length > 0 ? (
                    alerts.map(alert => (
                        <div
                        key={alert.id}
                        className={cn(
                            'p-3 rounded-lg border flex items-center justify-between gap-4',
                            !alert.enabled && 'bg-muted/50'
                        )}
                        >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="p-2 bg-secondary rounded-md">
                                {iconMap[alert.alertType]}
                            </div>
                            <div className='min-w-0'>
                                <p className="font-semibold text-sm truncate">{alert.walletId || alert.token}</p>
                                <p className="text-xs text-muted-foreground truncate">
                                    Rule: {alert.rule}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center justify-end gap-1">
                             <Switch
                                checked={alert.enabled}
                                onCheckedChange={() => toggleAlert(alert)}
                                aria-label="Toggle alert"
                            />
                            <DialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEdit(alert)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                            </DialogTrigger>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete your alert.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => deleteAlert(alert)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>

                        </div>
                        </div>
                    ))
                    ) : !isLoading && (
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
            {selectedAlert && (
                <CreateAlertDialog 
                    onOpenChange={handleCloseEditor} 
                    alert={selectedAlert}
                />
            )}
        </Dialog>
    );
}
