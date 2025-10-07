

'use client';
import { useState, useMemo, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from '../ui/label';
import { Plus, Bot, X, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Alert, AlertCondition, WatchlistItem } from '@/lib/types';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { doc, updateDoc, addDoc, collection, serverTimestamp, query } from 'firebase/firestore';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Combobox } from '../ui/combobox';
import { Card } from '../ui/card';
import Link from 'next/link';

const triggerTypes = [
  // Wallet-centric
  { value: "transactionValue", label: "Transaction Value", group: "Wallet", pro: false },
  { value: "repeatedLargeTransfers", label: "Repeated Large Transfers", group: "Wallet", pro: true },
  { value: "balanceChange", label: "Balance Change", group: "Wallet", pro: false },
  { value: "netWorthChange", label: "Net Worth Change", group: "Wallet", pro: true },
  { value: "dormancy", label: "Dormancy / Activation", group: "Wallet", pro: false },
  { value: "firstTimeTokenInteraction", label: "First-time Token Interaction", group: "Wallet", pro: true },
  { value: "exchangeInteraction", label: "Exchange Interaction (CEX)", group: "Wallet", pro: false },
  { value: "bridgeActivity", label: "Bridge/Cross-Chain Activity", group: "Wallet", pro: true },
  { value: "contractInteraction", label: "Contract Interaction", group: "Wallet", pro: true },
  { value: "counterpartyPair", label: "Counterparty Pair Alert", group: "Wallet", pro: true },
  // Token-centric
  { value: "priceChange", label: "Price Change", group: "Token", pro: false },
  { value: "newWhaleTransaction", label: "New Whale Transaction", group: "Token", pro: false },
  { value: "multipleWhaleEntries", label: "Multiple Whale Entries", group: "Token", pro: true },
  { value: "liquidityPoolChange", label: "Liquidity Pool Change", group: "Token", pro: false },
  { value: "tokenSupplyEvents", label: "Token Supply Events", group: "Token", pro: true },
  { value: "exchangeFlowSurge", label: "Exchange Flow Surge", group: "Token", pro: true },
  { value: "newHolderSpike", label: "New Holder Spike", group: "Token", pro: true },
  { value: "rugHoneypotDetector", label: "Rug/Honeypot Detector", group: "Token", pro: true },
];


const Condition = ({ index, onRemove, condition, updateCondition, entityType, isPro }: { index: number, onRemove: (index: number) => void, condition: any, updateCondition: (index: number, newCondition: any) => void, entityType: 'wallet' | 'token', isPro: boolean }) => {
    
    const relevantTriggers = triggerTypes.filter(t => t.group.toLowerCase() === entityType);

    return (
        <div className="p-4 border rounded-lg space-y-4 relative bg-background">
             <Button variant="ghost" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => onRemove(index)}>
                <X className="h-4 w-4 text-muted-foreground" />
             </Button>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label>Trigger Type</Label>
                    <Select value={condition.type} onValueChange={(val) => updateCondition(index, {...condition, type: val})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a trigger..." />
                        </SelectTrigger>
                        <SelectContent>
                            {relevantTriggers.map(type => 
                            <SelectItem key={type.value} value={type.value} disabled={type.pro && !isPro}>
                                <div className='flex items-center gap-2'>
                                  {type.label} {type.pro && !isPro && <Lock className='h-3 w-3' />}
                                </div>
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
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="space-y-2">
                <Label>Value</Label>
                <Input placeholder="e.g., 1000000 for USD, 10 for %" value={condition.threshold} onChange={(e) => updateCondition(index, {...condition, threshold: e.target.value})}/>
            </div>
        </div>
    );
};


export default function AlertBuilder({ onSave, onCancel, alert, entity }: { onSave: () => void, onCancel?: () => void, alert?: Alert, entity?: { type: 'wallet' | 'token', identifier: string } }) {
    const [conditions, setConditions] = useState<AlertCondition[]>(alert?.conditions || [{ type: '', threshold: 1000000 }]);
    const [logicalOperator, setLogicalOperator] = useState<'AND' | 'OR'>(alert?.logicalOperator || 'AND');
    const { user, claims } = useUser();
    const isPro = claims?.plan === 'pro';
    const firestore = useFirestore();
    const { toast } = useToast();
    const [identifier, setIdentifier] = useState(alert?.walletId || alert?.token || entity?.identifier || '');
    const [alertType, setAlertType] = useState<'wallet' | 'token'>(alert?.alertType || entity?.type || 'wallet');
    const [name, setName] = useState(alert?.name || '');

    useEffect(() => {
        const initialType = alert?.alertType || entity?.type || 'wallet';
        setAlertType(initialType);
        const firstRule = triggerTypes.find(t => t.group.toLowerCase() === initialType)?.value || '';
        setConditions(alert?.conditions || [{ type: firstRule, threshold: 1000000 }]);
        setIdentifier(alert?.walletId || alert?.token || entity?.identifier || '');
    }, [alert, entity]);


    const watchlistQuery = useMemo(() => {
        if (user && firestore) {
          return query(collection(firestore, `users/${user.uid}/watchlist`));
        }
        return null;
      }, [user, firestore]);
    
    const { data: watchlistItems } = useCollection<WatchlistItem>(watchlistQuery);

    const comboboxOptions = useMemo(() => {
        const filteredItems = watchlistItems?.filter(item => item.type === alertType) || [];
        return filteredItems.map(item => ({
            value: item.identifier,
            label: item.name ? `${item.name} (${item.identifier.slice(0, 6)}...${item.identifier.slice(-4)})` : item.identifier,
        })) || [];
    }, [watchlistItems, alertType]);
    
    const addCondition = () => {
        const firstRuleForType = triggerTypes.find(t => t.group.toLowerCase() === alertType)?.value || '';
        setConditions([...conditions, { type: firstRuleForType, threshold: 1000000 }]);
    };

    const removeCondition = (index: number) => {
        setConditions(conditions.filter((_, i) => i !== index));
    }

    const updateCondition = (index: number, newCondition: AlertCondition) => {
        const newConditions = [...conditions];
        newConditions[index] = newCondition;
        setConditions(newConditions);
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

        const newOrUpdatedAlert: Omit<Alert, 'id' | 'createdAt'> = {
            type: 'advanced',
            alertType: alertType,
            rule: 'Advanced Rule',
            enabled: true,
            userId: user.uid,
            conditions,
            logicalOperator,
            name,
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
            const dataToSave = { ...newOrUpdatedAlert, createdAt: serverTimestamp() };
            addDoc(alertsCol, dataToSave)
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
                    requestResourceData: { ...dataToSave, createdAt: 'Server-side timestamp' },
                });
                errorEmitter.emit('permission-error', permissionError);
            });
        }
    }

    const linkedIdentifier = entity?.identifier;

    const rulePreview = conditions.map(c => `(${(triggerTypes.find(t => t.value === c.type)?.label || '...')})`).join(` ${logicalOperator} `);

    if (!isPro) {
        return (
            <Card className="text-center p-8 space-y-4">
                <Lock className="w-8 h-8 text-primary mx-auto" />
                <h3 className="text-2xl font-bold">Advanced Alerts are a Pro Feature</h3>
                <p className="text-muted-foreground max-w-sm mx-auto">
                   To create multi-conditional alerts with the advanced builder, please upgrade your plan.
                </p>
                <Button asChild>
                    <Link href="/upgrade">Upgrade to Pro</Link>
                </Button>
            </Card>
        )
    }

    return (
        <div className="space-y-6">
            <div className='space-y-2'>
                <Label>Alert Name (Optional)</Label>
                <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g., Monitor Vitalik's ETH sales" />
            </div>
            
            {!linkedIdentifier && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Target Type</Label>
                    <Select value={alertType} onValueChange={(v) => {
                        setAlertType(v as 'wallet' | 'token');
                        setIdentifier('');
                    }}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="wallet">Wallet</SelectItem>
                            <SelectItem value="token">Token</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label>{alertType === 'wallet' ? 'Wallet Address' : 'Token Symbol'}</Label>
                    <Combobox
                        options={comboboxOptions}
                        value={identifier}
                        onChange={setIdentifier}
                        placeholder={alertType === 'wallet' ? 'Select from watchlist or paste...' : 'Select or type...'}
                        emptyMessage="No matching items in watchlist."
                    />
                </div>
            </div>
            )}
            
            <div className="space-y-4">
                <Label>Conditions</Label>
                {conditions.map((c, index) => (
                    <div key={index} className='space-y-4'>
                        <Condition index={index} onRemove={removeCondition} condition={c} updateCondition={updateCondition} entityType={alertType} isPro={isPro} />
                        {index < conditions.length - 1 && (
                            <div className="flex items-center justify-center">
                               <div className="relative">
                                  <div className='absolute inset-0 flex items-center'>
                                        <span className='w-full border-t'></span>
                                  </div>
                                   <div className='relative flex justify-center'>
                                        <Button 
                                            variant="secondary" 
                                            size="sm"
                                            onClick={() => setLogicalOperator(logicalOperator === 'AND' ? 'OR' : 'AND')}
                                            className="font-mono text-xs h-6 px-2"
                                        >
                                            {logicalOperator}
                                        </Button>
                                   </div>
                               </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <Button variant="outline" onClick={addCondition}>
                <Plus className="h-4 w-4 mr-2" />
                Add Condition
            </Button>

            <div className="p-4 border rounded-lg space-y-2 bg-muted/50">
                 <h3 className="font-semibold text-sm text-muted-foreground">Rule Preview</h3>
                 <p className="text-sm text-foreground bg-background p-3 rounded-md font-mono">
                    ALERT IF {rulePreview}
                 </p>
            </div>

            <div className="space-y-2">
                <Label>Delivery Channel</Label>
                <Card>
                    <div className='flex items-center justify-between p-3'>
                        <div className='flex items-center gap-3'>
                            <Bot className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <p className='font-medium'>Telegram Alerts</p>
                                <p className='text-xs text-muted-foreground'>Instant notifications</p>
                            </div>
                        </div>
                        {isPro ? (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/account">Manage</Link>
                            </Button>
                        ) : (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/upgrade">
                                    <Lock className="h-3 w-3 mr-2"/>
                                    Upgrade to Pro
                                </Link>
                            </Button>
                        )}
                    </div>
                </Card>
            </div>


            <div className="flex justify-end gap-2 pt-4 border-t">
                {onCancel && <Button variant="ghost" onClick={onCancel}>Cancel</Button>}
                <Button onClick={handleSave}>Save Alert</Button>
            </div>
        </div>
    );
}
