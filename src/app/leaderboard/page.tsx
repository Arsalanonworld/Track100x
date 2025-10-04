
'use client';

import React, { useState } from 'react';
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
import { ArrowUpDown, Zap, Lock, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { QuickAlertModal } from '@/components/quick-alert-modal';
import { useUser, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { useDoc } from '@/firebase/firestore/use-doc';
import Link from 'next/link';
import { ProFeatureLock } from '@/components/pro-feature-lock';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function LeaderboardPage() {
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>(
    undefined
  );
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(() => {
    if (!firestore || !user) return null;
    return doc(firestore, 'users', user.uid);
  }, [firestore, user]);

  const { data: userData, isLoading: isUserDataLoading } = useDoc(userDocRef);

  const isPro = userData?.plan === 'pro';
  const isLoading = isUserLoading || isUserDataLoading;

  const topNFree = userData?.entitlements?.leaderboard?.topN || 10;
  
  // Decide which data to show based on auth state and plan
  let leaderboardData;
  if (isPro) {
    leaderboardData = walletLeaderboard; // Pro users see everything
  } else if (user) {
    leaderboardData = walletLeaderboard.slice(0, topNFree); // Logged-in free users see top N
  } else {
    leaderboardData = walletLeaderboard.slice(0, 5); // Guests see top 5
  }

  const showProLock = !isPro;

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}>
      <PageHeader
        title="Wallet Leaderboard"
        description="Discover and track the most profitable and active wallets in real-time."
      />

      <Card className="relative">
        {isLoading ? (
           <div className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 backdrop-blur-sm">
             <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : showProLock && (
           <ProFeatureLock
            title="View the Full Leaderboard"
            description="Upgrade to Pro to unlock the top 100 wallets, deep wallet profiles, and more."
           />
        )}
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle>Top Wallets</CardTitle>
              <CardDescription>
                {isPro ? "The biggest players in the crypto space." : `Showing the top ${topNFree} wallets. Upgrade to Pro to see the full list.`}
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
                     <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="-ml-4" disabled={!isPro}>
                              Net Worth
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                           </TooltipTrigger>
                           {!isPro && <TooltipContent>Sorting is a Pro feature.</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead>Top Holding</TableHead>
                  <TableHead>
                    <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="sm" className="-ml-4" disabled={!isPro}>
                               P&L (7d)
                              <ArrowUpDown className="ml-2 h-4 w-4" />
                            </Button>
                           </TooltipTrigger>
                           {!isPro && <TooltipContent>Sorting is a Pro feature.</TooltipContent>}
                        </Tooltip>
                      </TooltipProvider>
                  </TableHead>
                  <TableHead className="text-center">7d Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((wallet) => (
                  <TableRow key={wallet.rank} className="hover:shadow-md">
                    <TableCell className="font-medium text-lg text-center">
                      {wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 6)}...
                        {wallet.address.slice(-4)}
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
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedWallet(wallet.address)}
                        >
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
      <QuickAlertModal walletAddress={selectedWallet} />
    </Dialog>
  );
}
