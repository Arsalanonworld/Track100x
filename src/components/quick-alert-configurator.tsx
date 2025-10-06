
'use client';

import { useToast } from '@/hooks/use-toast';
import React, { useMemo } from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Wallet, Tag, Bot } from 'lucide-react';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useUser, useFirestore, useCollection } from '@/firebase';
import { addDoc, collection, doc, serverTimestamp, updateDoc, query } from 'firebase/firestore';
import type { Alert, WatchlistItem } from '@/lib/types';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';
import { Combobox } from './ui/combobox';
import { tokenLibrary } from '@/lib/tokens';
import { Card } from './ui/card';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Input } from './ui/input';

const uniqueTokens = Object.keys(tokenLibrary);
const tokenOptions = uniqueTokens.map(symbol => ({ label: symbol, value: symbol }));

type ThresholdType = 'VALUE' | 'PERCENTAGE';

interface Rule {
  value: string;
  label: string;
  thresholdType: ThresholdType;
}

const walletRules: Rule[] = [
    { value: 'large-transaction', label: 'Large Transaction', thresholdType: 'VALUE' },
];

const tokenRules: Rule[] = [
    { value: 'price-change', label: 'Price Change', thresholdType: 'PERCENTAGE' },
    { value: 'large-trade-volume', label: 'Large Trade Volume', thresholdType: 'VALUE' },
];

const thresholds = {
    VALUE: [
        { value: '10000', label: '> $10,000' },
        { value: '50000', label: '> $50,000' },
        { value: '100000', label: '> $100,000' },
        { value: '1000000', label: '> $1,000,000' },
    ],
    PERCENTAGE: [
        { value: '5', label: 'moves by 5%' },
        { value: '10', label: 'moves by 10%' },
        { value: '25', label: 'moves by 25%' },
        { value: '50', label: 'moves by 50%' },
    ]
};


export const QuickAlertConfigurator = ({ onSubmitted, entity, alert }: { onSubmitted?: () => void, entity?: { type: 'wallet' | 'token', identifier: string }, alert?: Alert }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>(entity?.type || alert?.alertType || 'wallet');
  const [targetIdentifier, setTargetIdentifier] = React.useState(entity?.identifier || alert?.walletId || alert?.token || '');
  const [selectedRule, setSelectedRule] = React.useState<string | undefined>(alert?.rule);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const { toast } = useToast();
  const { user } = useUser();
  const firestore = useFirestore();

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  }, [user, firestore]);

  const { data: watchlistItems } = useCollection<WatchlistItem>(watchlistQuery);

  const walletOptions = useMemo(() => {
    const items = watchlistItems?.filter(i => i.type === 'wallet').map(item => ({
      value: item.identifier,
      label: item.name ? `${item.name} (${item.identifier.slice(0, 6)}...${item.identifier.slice(-4)})` : item.identifier,
    })) || [];
    
    if (entity?.type === 'wallet' && !items.some(i => i.value === entity.identifier)) {
        items.unshift({ value: entity.identifier, label: entity.identifier });
    } else if (alert?.walletId && !items.some(i => i.value === alert.walletId)) {
        items.unshift({ value: alert.walletId, label: alert.walletId });
    }

    return items;
  }, [watchlistItems, entity, alert]);
  
  const tokenOptionsFromWatchlist = useMemo(() => {
    const items = watchlistItems?.filter(i => i.type === 'token').map(item => ({
      value: item.identifier,
      label: item.identifier,
    })) || [];

    const allTokens = [...items];
    tokenOptions.forEach(opt => {
        if (!allTokens.some(item => item.value === opt.value)) {
            allTokens.push(opt);
        }
    });

    if (entity?.type === 'token' && !allTokens.some(i => i.value === entity.identifier)) {
        allTokens.unshift({ value: entity.identifier, label: entity.identifier });
    } else if (alert?.token && !allTokens.some(i => i.value === alert.token)) {
        allTokens.unshift({ value: alert.token, label: alert.token });
    }

    return allTokens;
  }, [watchlistItems, entity, alert]);

  const comboboxOptions = alertType === 'wallet' ? walletOptions : tokenOptionsFromWatchlist;


  const currentRules = alertType === 'wallet' ? walletRules : tokenRules;
  const activeRule = currentRules.find(r => r.value === selectedRule);
  const thresholdType = activeRule?.thresholdType;


  React.useEffect(() => {
    const newType = entity?.type || alert?.alertType;
    if (newType) {
        setAlertType(newType);
        const ruleExists = (newType === 'wallet' ? walletRules : tokenRules).some(r => r.value === selectedRule);
        if (!ruleExists) {
            setSelectedRule(undefined);
        }
    }
    
    const newIdentifier = entity?.identifier || alert?.walletId || alert?.token;
    if (newIdentifier) setTargetIdentifier(newIdentifier);

  }, [entity, alert, selectedRule]);


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
        type: 'quick',
        alertType: data.alertType,
        rule: data.rule,
        threshold: data.threshold ? Number(data.threshold) : null,
        enabled: true,
        userId: user.uid,
    };
    
    if (alertType === 'wallet') {
      alertData.direction = data.direction;
      alertData.tokenFilter = data.tokenFilter || null;
    }
    
    if (!thresholdType) {
        alertData.threshold = null;
    }

    if (data.alertType === 'wallet') {
        alertData.walletId = targetIdentifier;
        alertData.token = null;
    } else {
        alertData.token = targetIdentifier;
        alertData.walletId = null;
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

  const isLargeTransactionRule = selectedRule === 'large-transaction';

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <input type="hidden" name="alertType" value={alertType} />
        <div className="space-y-2">
            <Label>Alert For</Label>
            <Select onValueChange={(v: 'wallet' | 'token') => { setAlertType(v); setSelectedRule(undefined); setTargetIdentifier('') }} defaultValue={alertType} name="alertType" disabled={!!entity || !!alert}>
                <SelectTrigger>
                    <SelectValue placeholder="Select alert type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="wallet">
                        <div className="flex items-center gap-2"><Wallet className="h-4 w-4" /> Portfolio / Wallet</div>
                    </SelectItem>
                    <SelectItem value="token">
                        <div className="flex items-center gap-2"><Tag className="h-4 w-4" /> Token</div>
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        {alertType === 'wallet' && (
          <div className="space-y-2">
            <Label htmlFor="wallet-address">Portfolio / Wallet</Label>
            <Combobox
                options={comboboxOptions}
                value={targetIdentifier}
                onChange={setTargetIdentifier}
                placeholder="Select from watchlist or paste an address..."
                emptyMessage="No wallets in watchlist. You can paste an address."
              />
          </div>
        )}
        
        {alertType === 'token' && (
            <div className="space-y-2">
                <Label htmlFor="token-symbol">Token Symbol</Label>
                <Combobox
                    options={comboboxOptions}
                    value={targetIdentifier}
                    onChange={setTargetIdentifier}
                    placeholder="Select or type a token symbol..."
                    emptyMessage="No tokens found."
                />
            </div>
        )}
        
        <div className="space-y-2">
            <Label htmlFor="rule">Notify me when...</Label>
            <Select name="rule" required value={selectedRule} onValueChange={setSelectedRule}>
            <SelectTrigger id="rule">
                <SelectValue placeholder="Select a rule..." />
            </SelectTrigger>
            <SelectContent>
                {currentRules.map(rule => (
                    <SelectItem key={rule.value} value={rule.value}>{rule.label}</SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
        
        {thresholdType && (
            <div className="space-y-2">
                <Label htmlFor="threshold">Condition</Label>
                <Select name="threshold" defaultValue={alert?.threshold?.toString()}>
                <SelectTrigger id="threshold">
                    <SelectValue placeholder="Select a condition..." />
                </SelectTrigger>
                <SelectContent>
                    {thresholds[thresholdType].map(t => (
                         <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                    ))}
                </SelectContent>
                </Select>
            </div>
        )}

        {alertType === 'wallet' && isLargeTransactionRule && (
          <div className='space-y-4 rounded-md border p-4'>
            <div className="space-y-2">
              <Label>Direction</Label>
               <RadioGroup defaultValue={alert?.direction || "any"} name="direction" className="flex gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="incoming" id="incoming" />
                    <Label htmlFor="incoming">Incoming</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="outgoing" id="outgoing" />
                    <Label htmlFor="outgoing">Outgoing</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="any" id="any" />
                    <Label htmlFor="any">Any</Label>
                  </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
                <Label htmlFor="tokenFilter">Token (Optional)</Label>
                <Input id="tokenFilter" name="tokenFilter" placeholder="e.g., USDT, ETH" defaultValue={alert?.tokenFilter}/>
                <p className="text-xs text-muted-foreground">Leave blank to be notified for any token.</p>
            </div>
          </div>
        )}
        
        <Card className="p-4">
            <Label>Delivery Channel</Label>
            <div className="flex items-center justify-between rounded-md border p-3 mt-2">
                <div className='flex items-center gap-3'>
                    <Bot className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm font-medium">Telegram</p>
                </div>
                <p className='text-sm text-muted-foreground'>Connect in Account</p>
            </div>
        </Card>
        <SubmitButton />
    </form>
  );
};
