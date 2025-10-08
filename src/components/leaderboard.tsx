
'use client';

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
import { leaderboardData, type LeaderboardWallet } from '@/lib/mock-data';
import { Percent, Copy, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { WatchlistButton } from './track-button';
import { getExplorerUrl } from '@/lib/explorers';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';

const allTags = [...new Set(leaderboardData.flatMap(w => w.tags))];

const PnlCell = ({ value }: { value: number }) => (
    <TableCell className={cn("font-medium text-sm", value >= 0 ? "text-green-500" : "text-red-500")}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}%
    </TableCell>
);
  
const RankCell = ({ rank }: { rank: number }) => {
    const rankColors: { [key: number]: string } = {
        1: 'text-yellow-500 border-yellow-500/50 bg-yellow-500/10',
        2: 'text-gray-400 border-gray-400/50 bg-gray-400/10',
        3: 'text-amber-700 dark:text-amber-600 border-amber-700/50 bg-amber-700/10'
    };

    return (
        <TableCell className="font-bold text-base text-center">
            <div className={cn('w-8 h-8 mx-auto rounded-full flex items-center justify-center', rankColors[rank])}>
               {rank}
            </div>
        </TableCell>
    )
}

const WalletCell = ({ alias, address }: { alias: string, address: string}) => {
    const { toast } = useToast();
    
    const copyAddress = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(address);
        toast({ title: 'Address Copied!' });
    };

    return (
        <TableCell>
            <div className="font-semibold text-base">{alias}</div>
            <div className="flex items-center gap-2">
                <a href={getExplorerUrl('ethereum', address, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-xs text-muted-foreground hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                </a>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}><Copy className="h-3 w-3"/></Button>
            </div>
        </TableCell>
    )
}


export function Leaderboard() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof LeaderboardWallet | 'pnl7d'>('pnl7d');

  const sortedAndFilteredData = useMemo(() => {
    let data = [...leaderboardData];

    if (searchTerm) {
        data = data.filter(wallet => 
            wallet.alias.toLowerCase().includes(searchTerm.toLowerCase()) || 
            wallet.address.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }
    
    if (tagFilter !== 'all') {
        data = data.filter(wallet => wallet.tags.includes(tagFilter));
    }
    
    data.sort((a, b) => {
        const valA = a[sortKey as keyof LeaderboardWallet];
        const valB = b[sortKey as keyof LeaderboardWallet];

        if (typeof valA === 'number' && typeof valB === 'number') {
            return valB - valA; // Sort descending for numbers
        }
        
        // For rank, sort ascending
        if(sortKey === 'rank') {
            if (typeof valA === 'number' && typeof valB === 'number') {
                return valA - valB;
            }
        }
        
        // Fallback for other types
        if (valA! > valB!) return -1;
        if (valA! < valB!) return 1;
        return 0;
    });

    return data;
  }, [searchTerm, tagFilter, sortKey]);

  return (
    <Card>
        <CardHeader>
             <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                 <div>
                    <CardTitle>Top Wallet Leaderboard</CardTitle>
                    <CardDescription>Discover top-performing wallets based on their recent activity and profitability.</CardDescription>
                 </div>
                 <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search by alias or address" 
                            className="pl-9 w-full sm:w-[250px]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                     <Select value={tagFilter} onValueChange={setTagFilter}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Filter by Tag" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Tags</SelectItem>
                            {allTags.map(tag => <SelectItem key={tag} value={tag}>{tag}</SelectItem>)}
                        </SelectContent>
                     </Select>
                     <Select value={sortKey} onValueChange={(val) => setSortKey(val as keyof LeaderboardWallet)}>
                        <SelectTrigger className="w-full sm:w-[150px]">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="rank">Rank</SelectItem>
                            <SelectItem value="pnl7d">7d P&L</SelectItem>
                            <SelectItem value="pnl24h">24h P&L</SelectItem>
                            <SelectItem value="winRate">Win Rate</SelectItem>
                            <SelectItem value="trades">Trades</SelectItem>
                        </SelectContent>
                     </Select>
                 </div>
            </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px] text-center">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>7d P&L</TableHead>
                  <TableHead>24h P&L</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead># of Trades (7d)</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map((wallet) => (
                  <TableRow key={wallet.address} className="cursor-pointer hover:bg-muted/50">
                    <RankCell rank={wallet.rank} />
                    <WalletCell alias={wallet.alias} address={wallet.address} />
                    <PnlCell value={wallet.pnl7d} />
                    <PnlCell value={wallet.pnl24h} />
                    <TableCell>
                        <div className="flex items-center gap-1.5">
                            <Percent className='h-4 w-4 text-muted-foreground' />
                            <span className='font-medium'>{wallet.winRate}%</span>
                        </div>
                    </TableCell>
                    <TableCell>{wallet.trades}</TableCell>
                    <TableCell>{wallet.lastActive}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                            {wallet.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <WatchlistButton identifier={wallet.address} type="wallet" />
                    </TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={9} className="h-24 text-center">
                            No wallets found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
