
'use client';

import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Wallet, Tag } from 'lucide-react';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import type { Alert } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Combobox } from './ui/combobox';
import { mockWhaleTxs } from '@/lib/mock-data';

const uniqueTokens = Array.from(new Set(mockWhaleTxs.map(tx => tx.token.symbol.toUpperCase())));
const tokenOptions = uniqueTokens.map(symbol => ({ label: symbol, value: symbol }));


export const QuickAlertConfigurator = ({ onSubmitted, entity, alert }: { onSubmitted?: () => void, entity?: { type: 'wallet' | 'token', identifier: string }, alert?: Alert }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>(entity?.type || alert?.alertType || 'wallet');
  const [tokenValue, setTokenValue] = React.useState(entity?.identifier || alert?.token || '');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  React.useEffect(() => {
    const newType = entity?.type || alert?.alertType;
    if (newType) {
      setAlertType(newType);
    }
  }, [entity, alert]);

  React.useEffect(() => {
    if (entity?.type === 'token') {
      setTokenValue(entity.identifier);
    }
     if (alert?.token) {
      setTokenValue(alert.token);
    }
  }, [entity, alert]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user || !firestore) {
        toast({ variant: 'destructive', title: 'Not logged in', description: 'You must be logged in to create an alert.' });
        return;
    }

    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    const data = Object.fromEntries(formData.entries());

    const alertData: any = {
        alertType: data.alertType,
        rule: data.rule,
        threshold: data.threshold ? Number(data.threshold) : null,
        enabled: true,
        userId: user.uid,
    };

    if (data.alertType === 'wallet') {
        alertData.walletId = data.walletId;
    } else {
        alertData.token = tokenValue;
    }

    if (alert) {
        const alertRef = doc(firestore, `users/${user.uid}/alerts`, alert.id);
        updateDoc(alertRef, alertData)
        .then(() => {
            toast({
                title: "Alert updated!",
                description: "Your alert has been saved.",
            });
            if (onSubmitted) onSubmitted();
        })
        .catch(async (serverError) => {
            const permissionError = new FirestorePermissionError({
                path: alertRef.path,
                operation: 'update',
                requestResourceData: alertData,
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => setIsSubmitting(false));
    } else {
        alertData.createdAt = serverTimestamp();
        const collectionRef = collection(firestore, `users/${user.uid}/alerts`);
        addDoc(collectionRef, alertData)
        .then(() => {
            toast({
                title: "Alert created!",
                description: "Your new alert has been saved.",
            });
            if (onSubmitted) onSubmitted();
        })
        .catch(async (serverError) => {
             const permissionError = new FirestorePermissionError({
                path: collectionRef.path,
                operation: 'create',
                requestResourceData: { ...alertData, createdAt: 'Server-side timestamp' },
            });
            errorEmitter.emit('permission-error', permissionError);
        })
        .finally(() => setIsSubmitting(false));
    }
  };

  const SubmitButton = () => (
    <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : alert ? "Save Changes" : "Create Alert"}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="token" value={tokenValue} />
        <div className="space-y-2">
            <Label>Alert Type</Label>
            <Select onValueChange={(v: 'wallet' | 'token') => setAlertType(v)} defaultValue={alertType} name="alertType" disabled={!!entity || !!alert}>
                <SelectTrigger>
                    <SelectValue placeholder="Select alert type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="wallet">
                        <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Wallet Activity</div>
                    </SelectItem>
                    <SelectItem value="token">
                        <div className="flex items-center gap-2"><Tag className="h-4 w-4" /> Token Events</div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        {alertType === 'wallet' && (
          <>
            <div className="space-y-2">
              <Label htmlFor="wallet-address">Wallet Address or ENS</Label>
              <Input
                id="wallet-address"
                name="walletId"
                placeholder="e.g., 0x... or vitalik.eth"
                required
                defaultValue={entity?.identifier || alert?.walletId || ''}
                readOnly={!!(entity || alert)}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-rule">Rule</Label>
               <Select name="rule" required defaultValue={alert?.rule}>
                <SelectTrigger id="wallet-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx-value">Transaction Value</SelectItem>
                  <SelectItem value="balance-change">
                    Token Balance Change
                  </SelectItem>
                   <SelectItem value="pnl-change">
                    7d PnL Change
                  </SelectItem>
                   <SelectItem value="dormancy">
                    Dormancy Status
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-threshold">Threshold</Label>
               <Select name="threshold" defaultValue={alert?.threshold?.toString()}>
                <SelectTrigger id="wallet-threshold">
                  <SelectValue placeholder="Select a threshold..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">Exceeds $10,000</SelectItem>
                  <SelectItem value="50000">Exceeds $50,000</SelectItem>
                  <SelectItem value="100000">Exceeds $100,000</SelectItem>
                  <SelectItem value="1000000">
                    Exceeds $1,000,000
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )}
        
        {alertType === 'token' && (
            <>
            <div className="space-y-2">
              <Label htmlFor="token-symbol">Token Symbol</Label>
               <Combobox
                  options={tokenOptions}
                  value={tokenValue}
                  onChange={setTokenValue}
                  placeholder="Select token..."
                  emptyMessage="No tokens found."
                />
            </div>
             <div className="space-y-2">
              <Label htmlFor="token-rule">Rule</Label>
               <Select name="rule" required defaultValue={alert?.rule}>
                <SelectTrigger id="token-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-change">Price Change %</SelectItem>
                  <SelectItem value="new-whale-tx">New Whale Transaction</SelectItem>
                  <SelectItem value="liquidity-shift">
                    Liquidity Shift %
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            </>
        )}
        
         <div className="space-y-2">
            <Label>Delivery Channel</Label>
            <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm font-medium">In-App</p>
                    <Switch defaultChecked disabled/>
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm font-medium">Email</p>
                    <Switch />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm font-medium">Telegram</p>
                    <Switch />
                </div>
                <div className="flex items-center justify-between rounded-md border p-3">
                    <p className="text-sm font-medium">Discord</p>
                    <Switch />
                </div>
             </div>
          </div>
        <SubmitButton />
    </form>
  );
};
