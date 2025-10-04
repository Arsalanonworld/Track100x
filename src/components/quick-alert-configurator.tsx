
'use client';

import { useToast } from '@/hooks/use-toast';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React from 'react';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Wallet, Tag } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Switch } from './ui/switch';
import { DialogClose } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useFirestore } from '@/firebase';

export const QuickAlertConfigurator = ({ isPro, userId }: { isPro: boolean; userId: string }) => {
  const [alertType, setAlertType] = React.useState<'wallet' | 'token'>('wallet');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const firestore = useFirestore();
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(event.currentTarget);
    
    const dataToSave = {
      userId,
      title: `New ${alertType} alert`,
      alertType: formData.get('alertType'),
      threshold: Number(formData.get('threshold')),
      enabled: true,
      createdAt: serverTimestamp(),
      walletId: formData.get('walletId') || null,
      token: formData.get('token') || null,
      rule: formData.get('rule') || null,
    };

    try {
      if (!firestore || !userId) throw new Error("Firestore not available");
      const alertsRef = collection(firestore, 'users', userId, 'alerts');
      await addDoc(alertsRef, dataToSave);
      toast({
        title: "Alert created!",
        description: "Your new alert has been saved.",
      });
      // Here you would typically close the modal, which can be handled by the parent component
    } catch (error) {
      console.error("Error creating alert:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not create alert.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };


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
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="wallet-rule">Rule</Label>
               <Select name="rule">
                <SelectTrigger id="wallet-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tx-value">Transaction Value</SelectItem>
                  <SelectItem value="balance-change" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Token Balance Change</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                   <SelectItem value="pnl-change" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>7d PnL Change</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
                  </SelectItem>
                   <SelectItem value="dormancy" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Dormancy Status</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
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
                  <SelectItem value="1000000" disabled={!isPro}>
                    <div className="flex items-center justify-between w-full"><span>Exceeds $1,000,000</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
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
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="token-rule">Rule</Label>
               <Select name="rule">
                <SelectTrigger id="token-rule">
                  <SelectValue placeholder="Select a rule..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="price-change">Price Change %</SelectItem>
                  <SelectItem value="new-whale-tx">New Whale Transaction</SelectItem>
                  <SelectItem value="liquidity-shift" disabled={!isPro}>
                     <div className="flex items-center justify-between w-full"><span>Liquidity Shift %</span> {!isPro && <Badge variant="secondary" className="ml-2">Pro</Badge>}</div>
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
                    <p className="text-sm font-medium">Email</p>
                    <Switch defaultChecked disabled/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${!isPro ? 'bg-muted/50 opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">Telegram</p>
                        {!isPro && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={!isPro}/>
                </div>
                <div className={`flex items-center justify-between rounded-md border p-3 ${!isPro ? 'bg-muted/50 opacity-60' : ''}`}>
                    <div className="flex items-center gap-2">
                       <p className="text-sm font-medium">Discord</p>
                       {!isPro && <Badge variant="secondary">Pro</Badge>}
                    </div>
                    <Switch disabled={!isPro}/>
                </div>
             </div>
             {!isPro && (
                <p className="text-sm text-muted-foreground">
                    <a href="/upgrade" className="text-primary hover:underline font-semibold">
                    Upgrade to Pro
                    </a>
                    {' '} for Telegram & Discord notifications.
                </p>
             )}
          </div>
          <DialogClose asChild>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader2 className="animate-spin" /> : "Create Alert"}
            </Button>
          </DialogClose>
    </form>
  );
};
