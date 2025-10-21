
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
import { Search, ArrowUp, ArrowDown, Zap, Trophy, Flame, Coins, SlidersHorizontal, Lock, Eye } from 'lucide-react';
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
import { useUser } from '@/firebase';
import { FeatureLockInline } from './feature-lock-inline';


const PnlCell = ({ value }: { value: number }) => (
    <div className={cn("font-medium text-sm", value >= 0 ? "text-green-500" : "text-red-500")}>
        <div className='flex items-center gap-1.5'>
            {value >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
            <span>{Math.abs(value).toFixed(2)}%</span>
        </div>
    </div>
);

const WalletCell = ({ address }: { address: string}) => {
    return (
        <Link href={`/wallet/${address}`} className='font-mono text-sm hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
            {address.slice(0, 6)}...{address.slice(-4)}
        </Link>
    )
}

const TopHoldingCell = ({ holding }: { holding: { token: string, percentage: number }}) => {
    return (
       <div className='flex items-center gap-2 font-medium'>
            <CryptoIcon token={holding.token} className='h-5 w-5'/>
            {holding.token} <span className='text-muted-foreground'>({holding.percentage}%)</span>
       </div>
    )
}

function TableSkeleton() {
    return (
        <div className="space-y-3">
            {[...Array(10)].map((_, i) => (
                <Card key={i} className="p-4">
                    <div className="flex items-center gap-4">
                        <Skeleton className="h-6 w-8" />
                        <div className="flex-1 grid grid-cols-2 md:grid-cols-6 gap-4 items-center">
                            <Skeleton className="h-6 w-32" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-6 w-24" />
                        </div>
                        <Skeleton className="h-8 w-8 rounded-md" />
                    </div>
                </Card>
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

    if (data.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground p-8 rounded-lg border-2 border-dashed h-48">
                <Search className="h-10 w-10 mb-4" />
                <p className="font-semibold text-lg text-foreground">
                    No Wallets Found
                </p>
                <p className="text-sm max-w-xs mx-auto">
                    Try adjusting your search filters to find what you're looking for.
                </p>
            </div>
        )
    }

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <div className="space-y-3">
                {data.map((wallet, index) => (
                    <Card key={wallet.address} onClick={() => handleRowClick(wallet.address)} className="cursor-pointer transition-all hover:shadow-md hover:border-primary/20">
                        <CardContent className="p-3 md:p-4">
                            <div className="flex items-center gap-3 md:gap-4">
                                <div className='w-8 text-center text-muted-foreground font-bold text-lg'>{index + 1}</div>
                                <div className="flex-1 grid grid-cols-2 md:grid-cols-7 gap-x-4 gap-y-2 items-center">
                                    <div className="md:col-span-2 font-semibold"><WalletCell address={wallet.address} /></div>
                                    <div className="text-sm text-muted-foreground"><span className="md:hidden">Net Worth: </span><span className="font-medium text-foreground">{wallet.netWorth}</span></div>
                                    <div className="md:col-span-1"><TopHoldingCell holding={wallet.topHolding}/></div>
                                    <div className="md:col-span-1"><PnlCell value={wallet.pnl7d} /></div>
                                    <div className="text-sm text-muted-foreground"><span className="md:hidden">Win Rate: </span><span className="font-medium text-foreground">{wallet.winRate.toFixed(1)}%</span></div>
                                    <div className="md:col-span-1 text-sm text-muted-foreground"><span className="md:hidden">Trades: </span><span className="font-medium text-foreground">{wallet.activity}</span></div>
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => handleAlertClick(e, wallet.address)}>
                                    <Zap className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
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
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';

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

  const displayData = isPro ? filteredAndSortedData : filteredAndSortedData.slice(0, 5);

  const sortOptions = [
    { value: 'pnl7d', label: '7d P&L' },
    { value: 'winRate', label: 'Win Rate' },
    { value: 'netWorth', label: 'Net Worth' },
    { value: 'activity', label: 'Activity' },
  ];

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
                 <div className='flex gap-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='w-full sm:w-auto'>
                                Sort By: <span className='font-semibold ml-1'>{sortOptions.find(o => o.value === sortBy)?.label}</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
                            <DropdownMenuLabel>Sort By</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                {sortOptions.map(option => (
                                    <DropdownMenuRadioItem key={option.value} value={option.value}>{option.label}</DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className='w-full sm:w-auto'>
                                <SlidersHorizontal className="h-4 w-4 mr-2"/>
                                Filters
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end">
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
            </div>
            <div className="relative">
                <LeaderboardTable data={displayData} isLoading={isLoading} />
                {!isPro && !isLoading && (
                    <FeatureLockInline 
                        title="View the Full Leaderboard"
                        description="Upgrade to Pro to unlock the top 100 wallets, deep wallet profiles, and more."
                    />
                )}
            </div>
        </div>
    );
}
