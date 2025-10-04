
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, PlusCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAlerts } from '@/hooks/use-alerts';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import { useAuth } from '@/hooks/use-auth';
import Link from 'next/link';

const alertFormSchema = z.object({
  type: z.enum(['Wallet', 'Token']),
  keyword: z.string().min(1, 'Please enter a valid wallet address or token symbol.'),
  threshold: z.string().optional(),
  chain: z.string().optional(),
  deliveryEmail: z.boolean().default(true),
});

type AlertFormValues = z.infer<typeof alertFormSchema>;

export default function AlertConfigurator() {
  const { addAlert, canAddAlert } = useAlerts();
  const { toast } = useToast();
  const { isPro } = useAuth();

  const form = useForm<AlertFormValues>({
    resolver: zodResolver(alertFormSchema),
    defaultValues: {
      type: 'Token',
      keyword: '',
      chain: 'all',
      deliveryEmail: true,
    },
  });
  
  const selectedType = form.watch('type');

  function onSubmit(data: AlertFormValues) {
    if (!canAddAlert()) {
        toast({
            title: "Alert Limit Reached",
            description: "You've reached the maximum number of alerts for the free plan.",
            variant: 'destructive',
            action: <Button asChild><Link href="/upgrade">Upgrade</Link></Button>
        });
        return;
    }

    let condition = 'Any';
    if(data.threshold) {
        const thresholdNum = parseInt(data.threshold);
        if (thresholdNum >= 1000000) {
            condition = `> $${thresholdNum / 1000000}M`;
        } else if (thresholdNum >= 1000) {
             condition = `> $${thresholdNum / 1000}k`;
        } else {
             condition = `> $${thresholdNum}`;
        }
    }

    addAlert({
      id: String(Date.now()),
      type: data.type,
      keyword: data.keyword,
      condition: condition,
      chain: data.chain || 'all',
      delivery: 'Email',
    });

    toast({
      title: 'Alert Created!',
      description: `You'll be notified about activity for ${data.keyword}.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alert Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an alert type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                  <SelectItem value="Token">Token</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        { selectedType === 'Wallet' && (
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Wallet Address</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., 0x123...aBcd" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        { selectedType === 'Token' && (
          <FormField
            control={form.control}
            name="keyword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., ETH, WIF, PEPE" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
            control={form.control}
            name="threshold"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Transaction Threshold (USD)</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue placeholder="Any transaction value" />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="10000">$10,000</SelectItem>
                        <SelectItem value="100000">$100,000</SelectItem>
                        <SelectItem value="1000000">$1,000,000</SelectItem>
                        <SelectItem value="5000000">$5,000,000</SelectItem>
                        <SelectItem value="10000000">$10,000,000</SelectItem>
                    </SelectContent>
                    </Select>
                <FormMessage />
                </FormItem>
            )}
            />
            <FormField
            control={form.control}
            name="chain"
            render={({ field }) => (
                <FormItem>
                <FormLabel>Chain</FormLabel>
                <Select onValueChange={field.onChange} value={field.value} disabled={!isPro}>
                    <FormControl>
                    <SelectTrigger>
                       {!isPro && <Lock className="h-3 w-3 mr-2 text-muted-foreground" />}
                        <SelectValue placeholder="Select a chain" />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="all">All Chains</SelectItem>
                        <SelectItem value="Ethereum">Ethereum</SelectItem>
                        <SelectItem value="Solana">Solana</SelectItem>
                        <SelectItem value="Bitcoin">Bitcoin</SelectItem>
                        <SelectItem value="BSC">BSC</SelectItem>
                        <SelectItem value="Polygon">Polygon</SelectItem>
                    </SelectContent>
                </Select>
                {!isPro && <FormDescription className="text-xs">Chain filtering is a Pro feature.</FormDescription>}
                <FormMessage />
                </FormItem>
            )}
            />
        </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
            <div className="space-y-0.5">
                <Label htmlFor="email-notifications" className="text-sm">
                Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                Get alerts delivered to your inbox.
                </p>
            </div>
            <Switch id="email-notifications" defaultChecked/>
            </div>

            {!isPro && (
                <div className="flex items-center justify-between rounded-lg border p-3 bg-muted/50">
                    <div className="space-y-0.5">
                        <Label className="text-sm flex items-center gap-2">
                           <Lock className="h-4 w-4" /> More delivery options
                        </Label>
                        <p className="text-xs text-muted-foreground pl-6">
                            Upgrade to Pro for Telegram, Discord, and WhatsApp alerts.
                        </p>
                    </div>
                </div>
            )}
        
        <Button type="submit" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Alert
        </Button>
      </form>
    </Form>
  );
}
