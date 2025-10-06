
'use client';
import { useState, useMemo } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from '../ui/label';
import { Plus, Bot } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Alert, WatchlistItem } from '@/lib/types';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp, query } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Combobox } from '../ui/combobox';
import { Card } from '../ui/card';

const triggerTypes = [
  { value: "Large Transaction", pro: false },
  { value: "Balance/Value Change", pro: false },
  { value: "Counterparty Interaction", pro: false },
  { value: "Price Change", pro: false },
];


const Condition = ({ index, onRemove }: { index: number, onRemove: (index: number) => void}) => {
    return (
        <div className="p-4 border rounded-lg space-y-4 relative bg-background">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a trigger..." />
                        </SelectTrigger>
                        <SelectContent>
                            {triggerTypes.map(type => 
                            <SelectItem key={type.value} value={type.value}>
                                {type.value}
                            </SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                     <Label>Condition</Label>
                    <Select>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a condition..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="greater_than">Is greater than</SelectItem>
                            <SelectItem value="less_than">Is less than</SelectItem>
                            <SelectItem value="equals">Equals</SelectItem>
                            <SelectItem value="contains">Contains</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Value</Label>
                <Input placeholder="e.g., 10 for %, 1000 for $, or a wallet address" />
            </div>
        </div>
    );
};


export default function AlertBuilder({ onSave, onCancel, alert, entity }: { onSave: () => void, onCancel?: () => void, alert?: Alert, entity?: { type: 'wallet' | 'token', identifier: string } }) {
    const [conditions, setConditions] = useState([{}]);
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [identifier, setIdentifier] = useState(alert?.walletId || alert?.token || entity?.identifier || '');
    const [alertType, setAlertType] = useState<'wallet' | 'token'>(alert?.alertType || entity?.type || 'wallet');

    const watchlistQuery = useMemo(() => {
        if (user && firestore) {
          return query(collection(firestore, `users/${user.uid}/watchlist`));
        }
        return null;
      }, [user, firestore]);
    
    const { data: watchlistItems } = useCollection<WatchlistItem>(watchlistQuery);

    const walletOptions = useMemo(() => {
        return watchlistItems?.filter(item => item.type === 'wallet').map(item => ({
            value: item.identifier,
            label: item.name ? `${item.name} (${item.identifier.slice(0, 6)}...${item.identifier.slice(-4)})` : item.identifier,
        })) || [];
    }, [watchlistItems]);


    const addCondition = () => {
        setConditions([...conditions, {}]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    }
    
    const handleSave = () => {
        if (!user || !firestore) return;
        if(!identifier) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please select or enter a wallet address or token.'
            });
            return;
        }

        const newOrUpdatedAlert: any = {
            alertType: alertType,
            rule: 'Advanced Rule',
            threshold: 1000000,
            enabled: true,
            userId: user.uid,
        };

        if (alertType === 'wallet') {
            newOrUpdatedAlert.walletId = identifier;
        } else {
            newOrUpdatedAlert.token = identifier;
        }
        
        if (alert) { // Update existing alert
            const alertRef = doc(firestore, `users/${user.uid}/alerts`, alert.id);
            updateDoc(alertRef, newOrUpdatedAlert)
            .then(() => {
                toast({
                    title: 'Alert Updated',
                    description: 'Your advanced alert has been updated.'
                });
                onSave();
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: alertRef.path,
                    operation: 'update',
                    requestResourceData: newOrUpdatedAlert,
                });
                errorEmitter.emit('permission-error', permissionError);
            });

        } else { // Create new alert
            const alertsCol = collection(firestore, `users/${user.uid}/alerts`);
            addDoc(alertsCol, { ...newOrUpdatedAlert, createdAt: serverTimestamp() })
            .then(() => {
                toast({
                    title: 'Alert Saved',
                    description: 'Your new advanced alert has been created.'
                });
                onSave();
            })
            .catch(async (serverError) => {
                const permissionError = new FirestorePermissionError({
                    path: alertsCol.path,
                    operation: 'create',
                    requestResourceData: { ...newOrUpdatedAlert, createdAt: 'Server-side timestamp' },
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }
    }

    const linkedIdentifier = alert?.walletId || alert?.token || entity?.identifier;

    return (
        <div className="space-y-6">
            {!linkedIdentifier && (
                <div className="space-y-2">
                    <Label>Target Wallet or Token</Label>
                    <Combobox
                        options={walletOptions}
                        value={identifier}
                        onChange={setIdentifier}
                        placeholder="Select from watchlist or paste address..."
                        emptyMessage="No wallets in watchlist."
                    />
                </div>
            )}

            {linkedIdentifier && (
                <div>
                    <h3 className="font-semibold text-sm text-muted-foreground">Linked Entity</h3>
                    <p className="text-foreground text-sm font-mono bg-muted px-2 py-1 rounded-md mt-1 inline-block">{linkedIdentifier}</p>
                </div>
            )}
            
            <div className="space-y-4">
                {conditions.map((_, index) => (
                    <div key={index}>
                         <Condition index={index} onRemove={removeCondition}/>
                    </div>
                ))}
            </div>

            <Button variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition (AND/OR)
            </Button>

            <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                 <h3 className="font-semibold text-sm text-muted-foreground">Rule Preview</h3>
                 <p className="text-sm text-foreground bg-background p-3 rounded-md font-mono">
                    ALERT IF (Large Transaction is greater than $1,000,000)
                 </p>
            </div>

            <Card className="p-4">
                 <h3 className="font-semibold mb-2">Delivery Channel</h3>
                 <div className='flex items-center justify-between p-3 border rounded-lg bg-background'>
                    <div className='flex items-center gap-3'>
                        <Bot className="h-5 w-5 text-muted-foreground" />
                        <p className='font-medium'>Telegram</p>
                    </div>
                     <p className='text-sm text-muted-foreground'>Connect in Account</p>
                </div>
            </Card>


            <div className="flex justify-end gap-2 pt-4 border-t">
                {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
                <Button onClick={handleSave}>Save Alert</Button>
            </div>
        </div>
    );
}
