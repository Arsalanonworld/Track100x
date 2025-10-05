
'use client';

import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type QuickAlertModalProps = {
  walletAddress: string;
  onOpenChange: (isOpen: boolean) => void;
};

export const QuickAlertModal = ({ walletAddress, onOpenChange }: QuickAlertModalProps) => {
    const [address, setAddress] = useState(walletAddress || '');
    const { toast } = useToast();

    useEffect(() => {
        setAddress(walletAddress || '');
    }, [walletAddress]);
    
    const handleSave = () => {
        toast({
            title: "Alert created!",
            description: `You'll be notified for activity on ${address.slice(0, 6)}...${address.slice(-4)}`
        });
        onOpenChange(false);
    }

    if (!walletAddress) return null;

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Create Quick Alert</DialogTitle>
        <DialogDescription>
            Create a quick alert for wallet: {' '}
            <span className="font-mono text-foreground">{address.slice(0, 6)}...{address.slice(-4)}</span>
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-6 py-4">
        <div className="grid gap-2">
          <Label htmlFor="rule-type">Rule Type</Label>
          <Select defaultValue="transaction-value">
            <SelectTrigger id="rule-type">
              <SelectValue placeholder="Select a rule type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="transaction-value">
                Transaction Value
              </SelectItem>
              <SelectItem value="balance-change" disabled>
                Token Balance Change (Pro)
              </SelectItem>
              <SelectItem value="pnl-change" disabled>
                PnL Change (Pro)
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="value-threshold">Value Threshold (USD)</Label>
          <Input
            id="value-threshold"
            defaultValue="1000000"
            placeholder="e.g., 100000"
          />
          <p className="text-sm text-muted-foreground">
            Notify for transactions over this value.
          </p>
        </div>
        <div className="grid gap-2">
          <Label>Direction</Label>
          <RadioGroup defaultValue="any" className="flex gap-4">
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
        <div className="grid gap-2">
          <Label htmlFor="token">Token (Optional)</Label>
          <Input id="token" placeholder="e.g., USDT, ETH" />
          <p className="text-sm text-muted-foreground">
            Specify a token or leave blank for any token.
          </p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button onClick={handleSave}>Save Alert</Button>
      </div>
    </DialogContent>
  );
};
