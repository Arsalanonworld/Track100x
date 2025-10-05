
'use client';

import { useToast } from '@/hooks/use-toast';
import React from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Wallet, Tag, Sparkles } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { Alert as AlertBox, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUser, useFirestore } from '@/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';


export const QuickAlertConfigurator = ({ onSubmitted }: { onSubmitted?: () => void }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>('wallet');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();
  const { user, claims } = useUser();
  const firestore = useFirestore();


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
        createdAt: serverTimestamp(),
    };

    if (data.alertType === 'wallet') {
        alertData.walletId = data.walletId;
    } else {
        alertData.token = data.token;
    }

    try {
        await addDoc(collection(firestore, `users/${user.uid}/alerts`), alertData);
        toast({
            title: "Alert created!",
            description: "Your new alert has been saved.",
        });
        if (onSubmitted) {
            onSubmitted();
        }
    } catch (e) {
        console.error("Error creating alert:", e);
        toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not create the alert.'
        });
    } finally {
        setIsSubmitting(false);
    }
  };

  const SubmitButton = () => (
    <Button type="submit" className="w-full" disabled={isSubmitting || !user}>
        {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Alert"}
    </Button>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
            <Label>Alert Type</Label>
            <Select onValueChange={(v: 'wallet' | 'token') => setAlertType(v)} defaultValue="wallet" name="alertType">
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
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-rule">Rule</Label>
               <Select name="rule" required>
                <SelectTrigger id="wallet-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx-value">Transaction Value</SelectItem>
                  <SelectItem value="balance-change">
                    <div className="flex items-center justify-between w-full"><span>Token Balance Change</span></div>
                  </SelectItem>
                   <SelectItem value="pnl-change">
                    <div className="flex items-center justify-between w-full"><span>7d PnL Change</span></div>
                  </SelectItem>
                   <SelectItem value="dormancy">
                    <div className="flex items-center justify-between w-full"><span>Dormancy Status</span></div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-threshold">Threshold</Label>
               <Select name="threshold">
                <SelectTrigger id="wallet-threshold">
                  <SelectValue placeholder="Select a threshold..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10000">Exceeds $10,000</SelectItem>
                  <SelectItem value="50000">Exceeds $50,000</SelectItem>
                  <SelectItem value="100000">Exceeds $100,000</SelectItem>
                  <SelectItem value="1000000">
                    <div className="flex items-center justify-between w-full"><span>Exceeds $1,000,000</span></div>
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
              <Input
                id="token-symbol"
                name="token"
                placeholder="e.g., WIF, PEPE"
                required
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="token-rule">Rule</Label>
               <Select name="rule" required>
                <SelectTrigger id="token-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-change">Price Change %</SelectItem>
                  <SelectItem value="new-whale-tx">New Whale Transaction</SelectItem>
                  <SelectItem value="liquidity-shift">
                     <div className="flex items-center justify-between w-full"><span>Liquidity Shift %</span></div>
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
                <div className={`flex items-center justify-between rounded-md border p-3 ${claims?.plan !== 'pro' && 'bg-muted/50'}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Email</p>
                         {claims?.plan !== 'pro' && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={claims?.plan !== 'pro'}/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${claims?.plan !== 'pro' && 'bg-muted/50'}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Telegram</p>
                         {claims?.plan !== 'pro' && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={claims?.plan !== 'pro'}/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${claims?.plan !== 'pro' && 'bg-muted/50'}`}>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-medium">Discord</p>
                        {claims?.plan !== 'pro' && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={claims?.plan !== 'pro'}/>
                </div>
             </div>
          </div>
        <SubmitButton />
    </form>
  );
};
