
'use client';

import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { useToast } from "@/hooks/use-toast";

type WalletRuleType = 'transactionValue' | 'tokenBalanceChange' | 'portfolioValueChange' | 'pnlChange' | 'dormancy';
type TokenRuleType = 'priceChange' | 'newWhaleTransaction' | 'liquidityShift';

interface QuickAlertEditorProps {
    entity: {
      type: 'Wallet' | 'Token';
      identifier: string;
      label: string;
    };
    onSave: (ruleDescription: string) => void;
    onCancel: () => void;
}

export default function QuickAlertEditor({ entity, onSave, onCancel }: QuickAlertEditorProps) {
    const isWallet = entity.type === 'Wallet';
    const [ruleType, setRuleType] = useState<WalletRuleType | TokenRuleType>(isWallet ? 'transactionValue' : 'priceChange');

    // State for all possible rule types
    const [value, setValue] = useState(1000000);
    const [direction, setDirection] = useState('both');
    const [token, setToken] = useState('');
    const [percentage, setPercentage] = useState(5);
    const [days, setDays] = useState(30);
    const { toast } = useToast();

    const handleSave = () => {
        let ruleDescription = '';

        switch (ruleType) {
            // Wallet Rules
            case 'transactionValue':
                const directionText = direction === 'in' ? 'incoming' : direction === 'out' ? 'outgoing' : 'any';
                ruleDescription = `Value of ${directionText} txn > $${(value / 1000000).toFixed(1)}M ${token ? `of ${token}` : ''}`;
                break;
            case 'tokenBalanceChange':
                ruleDescription = `Balance of ${token || 'any token'} changes by > ${percentage}%`;
                break;
            case 'portfolioValueChange':
                ruleDescription = `Portfolio value changes by > ${percentage}% in 24h`;
                break;
            case 'pnlChange':
                 ruleDescription = `7d PnL changes by > ${percentage}%`;
                 break;
            case 'dormancy':
                 ruleDescription = `Wallet is inactive for > ${days} days`;
                 break;

            // Token Rules
            case 'priceChange':
                ruleDescription = `Price of ${entity.label} changes by > ${percentage}% in 24h`;
                break;
            case 'newWhaleTransaction':
                 ruleDescription = `New whale transaction > $${(value / 1000000).toFixed(1)}M`;
                 break;
            case 'liquidityShift':
                 ruleDescription = `Liquidity changes by > ${percentage}%`;
                 break;
        }
        
        onSave(ruleDescription);
    }
    
    const renderContent = () => {
        if (isWallet) { // Rules for Wallet
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
                case 'tokenBalanceChange':
                    return (
                         <div className="space-y-4">
                            <div>
                                <Label>Percentage Threshold</Label>
                                <Select value={String(percentage)} onValueChange={(val) => setPercentage(Number(val))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">> 1%</SelectItem>
                                        <SelectItem value="5">> 5%</SelectItem>
                                        <SelectItem value="10">> 10%</SelectItem>
                                        <SelectItem value="25">> 25%</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">Notify when a token balance changes by this percentage.</p>
                            </div>
                             <div>
                                <Label>Token Symbol (Optional)</Label>
                                <Input value={token} onChange={(e) => setToken(e.target.value)} placeholder="e.g. WIF (leave blank for any token)" />
                            </div>
                        </div>
                    );
                case 'portfolioValueChange':
                     return (
                        <div className="space-y-4">
                            <div>
                                <Label>Percentage Threshold (24h)</Label>
                                <Select value={String(percentage)} onValueChange={(val) => setPercentage(Number(val))}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">> 1%</SelectItem>
                                        <SelectItem value="5">> 5%</SelectItem>
                                        <SelectItem value="10">> 10%</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">Notify when the wallet's total value changes by this percentage.</p>
                            </div>
                        </div>
                    );
                 case 'pnlChange':
                    return (
                        <div className="space-y-4">
                            <div>
                                <Label>PnL Change Threshold (7d)</Label>
                                <Select value={String(percentage)} onValueChange={(val) => setPercentage(Number(val))}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">> 5%</SelectItem>
                                        <SelectItem value="10">> 10%</SelectItem>
                                        <SelectItem value="20">> 20%</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">For wallets on the Leaderboard.</p>
                            </div>
                        </div>
                    );
                case 'dormancy':
                    return (
                        <div className="space-y-4">
                            <div>
                                <Label>Inactive Period</Label>
                                <Select value={String(days)} onValueChange={(val) => setDays(Number(val))}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="7">7 days</SelectItem>
                                        <SelectItem value="30">30 days</SelectItem>
                                        <SelectItem value="90">90 days</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">Alert if wallet shows no activity for this period.</p>
                            </div>
                        </div>
                    );
                default: return null;
            }
        } else { // Rules for Token
            switch(ruleType as TokenRuleType) {
                case 'priceChange':
                     return (
                        <div className="space-y-4">
                            <div>
                                <Label>Percentage Threshold (24h)</Label>
                                <Select value={String(percentage)} onValueChange={(val) => setPercentage(Number(val))}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">> 1%</SelectItem>
                                        <SelectItem value="5">> 5%</SelectItem>
                                        <SelectItem value="10">> 10%</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    );
                case 'newWhaleTransaction':
                    return (
                        <div className="space-y-4">
                             <div>
                                <Label>Transaction Value Threshold (USD)</Label>
                                <Input 
                                    type="number" 
                                    value={value} 
                                    onChange={(e) => setValue(Number(e.target.value))}
                                    placeholder="e.g., 100000"
                                />
                                <p className="text-xs text-muted-foreground mt-1">Notify for new whale transactions for this token over the specified value.</p>
                            </div>
                        </div>
                    );
                case 'liquidityShift':
                     return (
                        <div className="space-y-4">
                            <div>
                                <Label>Liquidity Change Threshold</Label>
                                <Select value={String(percentage)} onValueChange={(val) => setPercentage(Number(val))}>
                                    <SelectTrigger><SelectValue/></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="5">> 5%</SelectItem>
                                        <SelectItem value="10">> 10%</SelectItem>
                                        <SelectItem value="20">> 20%</SelectItem>
                                    </SelectContent>
                                </Select>
                                <p className="text-xs text-muted-foreground mt-1">For changes in a token's main liquidity pool.</p>
                            </div>
                        </div>
                    );
                default: return null;
            }
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
                                <SelectItem value="tokenBalanceChange">Token Balance Change %</SelectItem>
                                <SelectItem value="portfolioValueChange">Portfolio Value Change %</SelectItem>
                                <SelectItem value="pnlChange">PnL Change (7d) %</SelectItem>
                                <SelectItem value="dormancy">Dormancy Status</SelectItem>
                            </>
                        ) : (
                            <>
                                <SelectItem value="priceChange">Price Change %</SelectItem>
                                <SelectItem value="newWhaleTransaction">New Whale Transaction</SelectItem>
                                <SelectItem value="liquidityShift">Liquidity Shift %</SelectItem>
                            </>
                        )}
                    </SelectContent>
                </Select>
            </div>
            {renderContent()}
            <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={onCancel}>Cancel</Button>
                <Button onClick={handleSave}>Save Alert</Button>
            </div>
        </div>
    )

}
