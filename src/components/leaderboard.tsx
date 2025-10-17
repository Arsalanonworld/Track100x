
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
import { Search, ArrowUp, ArrowDown, Zap, Trophy, Flame, Coins, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { getExplorerUrl } from '@/lib/explorers';
import { useState, useMemo, useEffect } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogTrigger } from './ui/dialog';
import { AlertEditorDialog } from './alert-editor-dialog';
import { Badge } from './ui/badge';
import { CryptoIcon } from './crypto-icon';
import { Skeleton } from './ui/skeleton';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Label } from './ui/label';
import { useRouter } from 'next/navigation';
import Link from 'next/link';


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
            <Link href={`/wallet/${address}`} className='font-mono text-sm hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
                {address.slice(0, 6)}...{address.slice(-4)}
            </Link>
        </TableCell>
    )
}

const TopHoldingCell = ({ holding }: { holding: { token: string, percentage: number }}) => {
    return (
        <TableCell>
           <div className='flex items-center gap-2 font-medium'>
                <CryptoIcon token={holding.token} className='h-5 w-5'/>
                {holding.token} <span className='text-muted-foreground'>({holding.percentage}%)</span>
           </div>
        </TableCell>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-2">
            {[...Array(10)].map((_, i) => (
                <div key={i} className="flex items-center p-4 h-[73px] rounded-lg bg-card border">
                     <Skeleton className="h-6 w-8" />
                     <Skeleton className="h-6 w-32 ml-4" />
                     <Skeleton className="h-6 w-24 ml-12" />
                     <Skeleton className="h-6 w-32 ml-12" />
                     <Skeleton className="h-6 w-24 ml-auto" />
                </div>
            ))}
        </div>
    )
}

const LeaderboardTable = ({ data, isLoading }: { data: LeaderboardWallet[], isLoading: boolean }) => {
    const [alertEntity, setAlertEntity] = useState<{type: 'wallet', identifier: string} | null>(null);
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);
    const router = useRouter();

    const handleAlertClick = (e: React.MouseEvent, address: string) => {
        e.stopPropagation();
        setAlertEntity({type: 'wallet', identifier: address});
        setIsAlertEditorOpen(true);
    }
    
    if (isLoading) {
        return <TableSkeleton />;
    }

    const handleRowClick = (address: string) => {
        router.push(`/wallet/${address}`);
    }

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
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
                        <TableHead>Win Rate (7d)</TableHead>
                        <TableHead>7d Activity</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map((wallet, index) => (
                        <TableRow key={wallet.address} onClick={() => handleRowClick(wallet.address)} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className='text-center text-muted-foreground font-medium'>{index + 1}</TableCell>
                            <WalletCell address={wallet.address} />
                            <TableCell className="font-medium">{wallet.netWorth}</TableCell>
                            <TopHoldingCell holding={wallet.topHolding} />
                            <PnlCell value={wallet.pnl7d} />
                            <TableCell className="font-medium">{wallet.winRate.toFixed(1)}%</TableCell>
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
                                <TableCell colSpan={9} className="h-24 text-center">
                                    No wallets found for this criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    </Table>
                </div>
                </CardContent>
            </Card>
             {alertEntity && (
                <AlertEditorDialog
                    onOpenChange={setIsAlertEditorOpen}
                    entity={alertEntity}
                />
            )}
        </Dialog>
    )
}


export function Leaderboard() {
  const [searchFilter, setSearchFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [sortBy, setSortBy] = useState('pnl7d');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
        setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    leaderboardData.forEach(wallet => {
        wallet.tags?.forEach(tag => tags.add(tag));
    });
    return ['all', ...Array.from(tags)];
  }, []);

  const filteredAndSortedData = useMemo(() => {
    let data = [...leaderboardData];

    // Filter by search
    if (searchFilter) {
        data = data.filter(wallet => 
            wallet.address.toLowerCase().includes(searchFilter.toLowerCase()) ||
            wallet.topHolding.token.toLowerCase().includes(searchFilter.toLowerCase())
        );
    }
    
    // Filter by tag
    if (tagFilter !== 'all') {
        data = data.filter(wallet => wallet.tags?.includes(tagFilter));
    }
    
    // Sort
    data.sort((a, b) => {
        switch (sortBy) {
            case 'netWorth':
                const valA = parseFloat(a.netWorth.replace('$', '').replace('M', ''));
                const valB = parseFloat(b.netWorth.replace('$', '').replace('M', ''));
                return valB - valA;
            case 'activity':
                return b.activity - a.activity;
            case 'winRate':
                return b.winRate - a.winRate;
            case 'pnl7d':
            default:
                return b.pnl7d - a.pnl7d;
        }
    });

    return data;
  }, [searchFilter, tagFilter, sortBy]);


  return (
        <div className="space-y-6">
             <div className="flex flex-col sm:flex-row gap-2 w-full">
                <div className="relative w-full flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input 
                        placeholder="Filter by address, tag, or token..." 
                        className="pl-9 w-full"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                    />
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className='w-full sm:w-auto'>
                             <SlidersHorizontal className="h-4 w-4 mr-2"/>
                            Filters
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                            <DropdownMenuRadioItem value="pnl7d">7d PnL</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="winRate">Win Rate</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="netWorth">Net Worth</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="activity">Activity</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuLabel>Filter by Tag</DropdownMenuLabel>
                         <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={tagFilter} onValueChange={setTagFilter}>
                            {allTags.map(tag => (
                                <DropdownMenuRadioItem key={tag} value={tag}>
                                    {tag === 'all' ? 'All Tags' : tag}
                                </DropdownMenuRadioItem>
                            ))}
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <LeaderboardTable data={filteredAndSortedData} isLoading={isLoading} />
        </div>
  );
}
