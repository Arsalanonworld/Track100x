
'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { leaderboardData, type LeaderboardWallet } from '@/lib/mock-data';
import { Search, ArrowUp, ArrowDown, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { getExplorerUrl } from '@/lib/explorers';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogTrigger } from './ui/dialog';
import { AlertEditorDialog } from './alert-editor-dialog';
import { Badge } from './ui/badge';


const PnlCell = ({ value }: { value: number }) => (
    <TableCell className={cn("font-medium text-sm", value >= 0 ? "text-green-500" : "text-red-500")}>
        <div className='flex items-center gap-1.5'>
            {value >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(value).toFixed(2)}%</span>
        </div>
    </TableCell>
);

const WalletCell = ({ address }: { address: string}) => {
    return (
        <TableCell>
            <a href={getExplorerUrl('ethereum', address, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
                {address.slice(0, 6)}...{address.slice(-4)}
            </a>
        </TableCell>
    )
}

const TopHoldingCell = ({ holding }: { holding: { token: string, percentage: number }}) => {
    return (
        <TableCell>
            <div className='font-medium'>{holding.token} <span className='text-muted-foreground'>({holding.percentage}%)</span></div>
        </TableCell>
    )
}


export function Leaderboard() {
  const [tokenFilter, setTokenFilter] = useState('');
  const [chainFilter, setChainFilter] = useState('all');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortKey, setSortKey] = useState<keyof LeaderboardWallet | 'netWorth'>('netWorth');
  const [alertEntity, setAlertEntity] = useState<{type: 'wallet', identifier: string} | null>(null);
  const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

  const handleAlertClick = (e: React.MouseEvent, address: string) => {
    e.stopPropagation();
    setAlertEntity({type: 'wallet', identifier: address});
    setIsAlertEditorOpen(true);
  }

  const sortedAndFilteredData = useMemo(() => {
    let data = [...leaderboardData];

    if (tokenFilter) {
        data = data.filter(wallet => 
            wallet.topHolding.token.toLowerCase().includes(tokenFilter.toLowerCase()) ||
            wallet.address.toLowerCase().includes(tokenFilter.toLowerCase())
        );
    }
    
    // Placeholder for chain filter logic if needed in future
    // if (chainFilter !== 'all') { ... }

    if (tagFilter !== 'all') {
      data = data.filter(wallet => wallet.tags?.includes(tagFilter));
    }
    
    data.sort((a, b) => {
        if (sortKey === 'netWorth') {
            const valA = parseFloat(a.netWorth.replace('$', '').replace('M', ''));
            const valB = parseFloat(b.netWorth.replace('$', '').replace('M', ''));
            return valB - valA;
        }

        const valA = a[sortKey as keyof LeaderboardWallet];
        const valB = b[sortKey as keyof LeaderboardWallet];

        if (typeof valA === 'number' && typeof valB === 'number') {
            return valB - valA; // Sort descending for numbers
        }
        
        return 0;
    });

    return data;
  }, [tokenFilter, chainFilter, tagFilter, sortKey]);

  return (
    <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
        <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative w-full sm:w-auto sm:flex-1 md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by wallet or token..." 
                        className="pl-9 w-full"
                        value={tokenFilter}
                        onChange={(e) => setTokenFilter(e.target.value)}
                    />
                </div>
                 <Select value={chainFilter} onValueChange={setChainFilter}>
                    <SelectTrigger className="w-full sm:w-auto sm:min-w-[160px]">
                        <SelectValue placeholder="All Chains" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Chains</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                    </SelectContent>
                </Select>
                 <Select value={tagFilter} onValueChange={setTagFilter}>
                    <SelectTrigger className="w-full sm:w-auto sm:min-w-[160px]">
                        <SelectValue placeholder="All Tags" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Tags</SelectItem>
                        <SelectItem value="Memecoin">Memecoin</SelectItem>
                        <SelectItem value="DeFi">DeFi</SelectItem>
                        <SelectItem value="NFT">NFT</SelectItem>
                        <SelectItem value="Airdrop">Airdrop</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <Card>
                <CardContent className="p-0">
                <div className="overflow-x-auto">
                    <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead className="w-[60px] text-center">#</TableHead>
                        <TableHead>Wallet</TableHead>
                        <TableHead>Net Worth</TableHead>
                        <TableHead>Top Holding</TableHead>
                        <TableHead>7d PnL</TableHead>
                        <TableHead>7d Activity</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {sortedAndFilteredData.length > 0 ? sortedAndFilteredData.map((wallet, index) => (
                        <TableRow key={wallet.address} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className='text-center text-muted-foreground'>{index + 1}</TableCell>
                            <WalletCell address={wallet.address} />
                            <TableCell className="font-medium">{wallet.netWorth}</TableCell>
                            <TopHoldingCell holding={wallet.topHolding} />
                            <PnlCell value={wallet.pnl7d} />
                            <TableCell>{wallet.activity} txns</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1 flex-wrap">
                                {wallet.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleAlertClick(e, wallet.address)}>
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                        )) : (
                            <TableRow>
                                <TableCell colSpan={8} className="h-24 text-center">
                                    No wallets found.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
        </div>
         {alertEntity && (
            <AlertEditorDialog
                onOpenChange={setIsAlertEditorOpen}
                entity={alertEntity}
            />
        )}
    </Dialog>
  );
}
