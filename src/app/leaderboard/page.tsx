
'use client';

import React, { useState, useMemo } from 'react';
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
import { walletLeaderboard, type Wallet } from '@/lib/mock-data';
import { ArrowUpDown, Zap, Eye } from 'lucide-react';
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
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/firebase';


type SortKey = 'netWorth' | 'pnlPercent';

export default function LeaderboardPage() {
  const [selectedWallet, setSelectedWallet] = useState<string | undefined>(undefined);
  const [chainFilter, setChainFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleAddToWatchlist = (walletAddress: string) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to add wallets to your watchlist.',
      });
      return;
    }
    // Firestore logic would go here
    toast({
      title: 'Added to Watchlist',
      description: `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)} is now being watched.`,
    });
  };

  const sortedAndFilteredData = useMemo(() => {
    let data: Wallet[] = [...walletLeaderboard];

    if (chainFilter !== 'all') {
      data = data.filter(w => w.blockchain.toLowerCase() === chainFilter);
    }

    if (sortConfig !== null) {
      data.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return data;
  }, [chainFilter, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'desc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };


  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}>
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
                The biggest players in the crypto space.
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={chainFilter} onValueChange={setChainFilter}>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="All Chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                  <SelectItem value="bitcoin">Bitcoin</SelectItem>
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
                    <Button variant="ghost" size="sm" className="-ml-4" onClick={() => requestSort('netWorth')}>
                      Net Worth
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>Top Holding</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-4" onClick={() => requestSort('pnlPercent')}>
                       P&L (7d)
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-center">7d Activity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.map((wallet) => (
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
                      {wallet.pnl >= 0 ? '+' : ''}
                      {wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-center">
                      {wallet.activity} txns
                    </TableCell>
                    <TableCell className="text-right">
                       <TooltipProvider>
                         <div className='flex justify-end gap-1'>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleAddToWatchlist(wallet.address)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Add to Watchlist</span>
                                </Button>
                              </TooltipTrigger>
                               <TooltipContent>
                                <p>Add to Watchlist</p>
                              </TooltipContent>
                            </Tooltip>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                          setSelectedWallet(wallet.address);
                                      }}
                                    >
                                      <Zap className="h-4 w-4" />
                                      <span className="sr-only">Create Quick Alert</span>
                                    </Button>
                                  </DialogTrigger>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Create Quick Alert</p>
                              </TooltipContent>
                            </Tooltip>
                         </div>
                      </TooltipProvider>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      {selectedWallet && <QuickAlertModal walletAddress={selectedWallet} onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}/>}
    </Dialog>
  );
}
