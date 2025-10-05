
'use client';

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Alert } from "@/lib/types";
import { useUser, useFirestore } from '@/firebase';
import { doc, updateDoc, setDoc, serverTimestamp, collection, addDoc } from 'firebase/firestore';

type WalletRuleType = 'transactionValue' | 'tokenBalanceChange' | 'portfolioValueChange' | 'pnlChange' | 'dormancy';
type TokenRuleType = 'priceChange' | 'newWhaleTransaction' | 'liquidityShift';

interface QuickAlertEditorProps {
    alert?: Alert;
    entity?: {
      type: 'Wallet' | 'Token';
      identifier: string;
      label: string;
    };
    onSave: (ruleDescription: string) => void;
    onCancel: () => void;
}

export default function QuickAlertEditor({ alert, entity, onSave, onCancel }: QuickAlertEditorProps) {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const isWallet = alert ? alert.alertType === 'wallet' : entity?.type === 'Wallet';
    const [ruleType, setRuleType] = useState<WalletRuleType | TokenRuleType>(isWallet ? 'transactionValue' : 'priceChange');
    
    // Form state
    const [value, setValue] = useState(1000000);
    const [direction, setDirection] = useState('both');
    const [token, setToken] = useState('');
    const [percentage, setPercentage] = useState(5);
    const [days, setDays] = useState(30);

    // Populate state from existing alert if editing
    useEffect(() => {
        if (alert) {
            setRuleType(alert.rule as any);
            // This is a simplified state restoration. A real app would parse the rule/description
            // to re-populate the UI fields accurately.
            if (alert.threshold) setValue(alert.threshold);
            if (alert.token) setToken(alert.token);
        }
    }, [alert]);

    const handleSave = async () => {
        if (!user || !firestore) return;
        
        let ruleDescription = '';
        let newOrUpdatedAlert: Omit<Alert, 'id' | 'createdAt'> & { id?: string } = {
            alertType: isWallet ? 'wallet' : 'token',
            rule: ruleType,
            enabled: true,
            userId: user.uid,
        };

        if (isWallet) {
            newOrUpdatedAlert.walletId = alert?.walletId || entity?.identifier;
        } else {
            newOrUpdatedAlert.token = alert?.token || entity?.identifier;
        }

        switch (ruleType) {
            case 'transactionValue':
                const directionText = direction === 'in' ? 'incoming' : direction === 'out' ? 'outgoing' : 'any';
                ruleDescription = `Value of ${directionText} txn > $${(value / 1000000).toFixed(1)}M ${token ? `of ${token}` : ''}`;
                newOrUpdatedAlert.threshold = value;
                if (token) newOrUpdatedAlert.token = token;
                break;
            // ... other cases would be fleshed out similarly
            default:
                 ruleDescription = `${ruleType} (details not implemented)`;
        }
        
        try {
            if (alert) { // Update existing alert
                const alertRef = doc(firestore, `users/${user.uid}/alerts`, alert.id);
                await updateDoc(alertRef, newOrUpdatedAlert);
            } else { // Create new alert
                const alertsCol = collection(firestore, `users/${user.uid}/alerts`);
                await addDoc(alertsCol, { ...newOrUpdatedAlert, createdAt: serverTimestamp() });
            }
            onSave(ruleDescription);
        } catch (e) {
            console.error("Error saving alert:", e);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Could not save the alert.'
            });
        }
    }
    
    const renderContent = () => {
        if (isWallet) { 
            switch(ruleType as WalletRuleType) {
                case 'transactionValue':
                    return (
                        <div className="space-y-4">
                            <div>
                                <Label>Value Threshold (USD)</Label>
                                <Input 
                                    type="number" 
                                    value={value} 
                                    onChange={(e) => setValue(Number(e.target.value))}
                                    placeholder="e.g. 1000000"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Notify for transactions over this value.</p>
                            </div>
                            <div>
                                <Label>Direction</Label>
                                <RadioGroup value={direction} onValueChange={setDirection} className="flex gap-4 pt-2">
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="in" id="in" /><Label htmlFor="in">Incoming</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="out" id="out" /><Label htmlFor="out">Outgoing</Label></div>
                                    <div className="flex items-center space-x-2"><RadioGroupItem value="both" id="both" /><Label htmlFor="both">Any</Label></div>
                                </RadioGroup>
                            </div>
                            <div>
                                <Label>Token (Optional)</Label>
                                <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="e.g., USDT, ETH" />
                                <p className="text-xs text-muted-foreground mt-1">Specify a token or leave blank for any token.</p>
                            </div>
                        </div>
                    );
                // Cases for other wallet rules would go here
                default: return <p className="text-sm text-muted-foreground">Configuration for this rule is not yet implemented.</p>;
            }
        } else { 
             // Cases for token rules would go here
            return <p className="text-sm text-muted-foreground">Configuration for token rules is not yet implemented.</p>;
        }
    }

    return (
        <div className="space-y-6">
             <div className="space-y-2">
                <Label>Rule Type</Label>
                <Select value={ruleType} onValueChange={(value) => setRuleType(value as WalletRuleType | TokenRuleType)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a rule type" />
                    </SelectTrigger>
                    <SelectContent>
                        {isWallet ? (
                            <>
                                <SelectItem value="transactionValue">Transaction Value</SelectItem>
                                <SelectItem value="tokenBalanceChange" disabled>Token Balance Change % (Pro)</SelectItem>
                                <SelectItem value="portfolioValueChange" disabled>Portfolio Value Change % (Pro)</SelectItem>
                                <SelectItem value="pnlChange" disabled>PnL Change (7d) % (Pro)</SelectItem>
                                <SelectItem value="dormancy" disabled>Dormancy Status (Pro)</SelectItem>
                            </>
                        ) : (
                            <>
                                <SelectItem value="priceChange">Price Change %</SelectItem>
                                <SelectItem value="newWhaleTransaction" disabled>New Whale Transaction (Pro)</SelectItem>
                                <SelectItem value="liquidityShift" disabled>Liquidity Shift % (Pro)</SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            </div>
            {renderContent()}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave}>{alert ? 'Update Alert' : 'Create Alert'}</Button>
            </div>
        </div>
    )

}
