'use client';

import React from 'react';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { walletLeaderboard } from '@/lib/mock-data';
import { ArrowUpDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const QuickAlertModal = () => (
  <DialogContent className="sm:max-w-[425px]">
    <DialogHeader>
      <DialogTitle>Create Quick Alert</DialogTitle>
    </DialogHeader>
    <div className="grid gap-6 py-4">
      <div className="grid gap-2">
        <Label htmlFor="rule-type">Rule Type</Label>
        <Select defaultValue="transaction-value">
          <SelectTrigger id="rule-type">
            <SelectValue placeholder="Select a rule type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="transaction-value">Transaction Value</SelectItem>
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
      <Button>Save Alert</Button>
    </div>
  </DialogContent>
);

export default function LeaderboardPage() {
  return (
    <Dialog>
      <PageHeader
        title="Wallet Leaderboard"
        description="Discover and track the most profitable and active wallets in real-time."
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle>Top Wallets</CardTitle>
              <CardDescription>
                Discover the biggest players in the crypto space.
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-4">
                      Net Worth
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Top Holding</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-4">
                      P&L (7d)
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">7d Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletLeaderboard.map((wallet) => (
                  <TableRow key={wallet.rank}>
                    <TableCell className="font-medium text-lg text-center">
                      {wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(wallet.netWorth / 1_000_000).toFixed(2)}M
                    </TableCell>
                    <TableCell>
                      {wallet.topHolding ? (
                        <span>
                          {wallet.topHolding.token} ({wallet.topHolding.percentage}%)
                        </span>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-medium',
                        wallet.pnl > 0 ? 'text-green-600' : 'text-red-600',
                        'dark:text-green-500 dark:text-red-500'
                      )}
                    >
                      {wallet.pnl >= 0 ? '+' : '-'}
                      {wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-center">
                      {wallet.activity} txns
                    </TableCell>
                    <TableCell className="text-right">
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Zap className="h-4 w-4" />
                          <span className="sr-only">Create Quick Alert</span>
                        </Button>
                      </DialogTrigger>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <QuickAlertModal />
    </Dialog>
  );
}
