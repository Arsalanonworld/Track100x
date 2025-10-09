
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
import { Search, ArrowUp, ArrowDown, Zap, Trophy, Flame, Coins } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { getExplorerUrl } from '@/lib/explorers';
import { useState, useMemo } from 'react';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogTrigger } from './ui/dialog';
import { AlertEditorDialog } from './alert-editor-dialog';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CryptoIcon } from './crypto-icon';


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
           <div className='flex items-center gap-2 font-medium'>
                <CryptoIcon token={holding.token} className='h-5 w-5'/>
                {holding.token} <span className='text-muted-foreground'>({holding.percentage}%)</span>
           </div>
        </TableCell>
    )
}

const LeaderboardTable = ({ data }: { data: LeaderboardWallet[] }) => {
    const [alertEntity, setAlertEntity] = useState<{type: 'wallet', identifier: string} | null>(null);
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

    const handleAlertClick = (e: React.MouseEvent, address: string) => {
        e.stopPropagation();
        setAlertEntity({type: 'wallet', identifier: address});
        setIsAlertEditorOpen(true);
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
                        <TableHead>7d Activity</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className="text-right w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length > 0 ? data.map((wallet, index) => (
                        <TableRow key={wallet.address} className="cursor-pointer hover:bg-muted/50">
                            <TableCell className='text-center text-muted-foreground font-medium'>{index + 1}</TableCell>
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
  const [tokenFilter, setTokenFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('smart-money');

  const topWhalesData = useMemo(() => {
    let data = [...leaderboardData];
     data.sort((a, b) => {
        const valA = parseFloat(a.netWorth.replace('$', '').replace('M', ''));
        const valB = parseFloat(b.netWorth.replace('$', '').replace('M', ''));
        return valB - valA;
    });
    return data;
  }, []);
  
  const smartMoneyData = useMemo(() => {
     let data = [...leaderboardData];
     data.sort((a, b) => b.pnl7d - a.pnl7d);
     return data;
  }, []);

  const topHoldersData = useMemo(() => {
    if (!tokenFilter) return [];
    
    let data = [...leaderboardData].filter(wallet => 
        wallet.topHolding.token.toLowerCase().includes(tokenFilter.toLowerCase())
    );

    // This is mock logic. Real implementation would sort by amount of the filtered token.
    data.sort((a, b) => b.topHolding.percentage - a.topHolding.percentage);
    
    return data;
  }, [tokenFilter])


  return (
        <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 sm:grid-cols-3 h-auto">
                    <TabsTrigger value="smart-money" className="py-2.5">
                        <Trophy className="h-4 w-4 mr-2"/> Smart Money
                    </TabsTrigger>
                    <TabsTrigger value="top-whales" className="py-2.5">
                        <Flame className="h-4 w-4 mr-2"/> Top Whales
                    </TabsTrigger>
                    <TabsTrigger value="top-holders" className="py-2.5">
                       <Coins className="h-4 w-4 mr-2"/> Top Holders
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="smart-money">
                    <p className="text-muted-foreground mb-4 text-sm max-w-2xl">
                        Wallets with the highest realized and unrealized profits.
                    </p>
                    <LeaderboardTable data={smartMoneyData} />
                </TabsContent>
                <TabsContent value="top-whales">
                     <p className="text-muted-foreground mb-4 text-sm max-w-2xl">
                       The largest wallets by net worth across all tracked tokens.
                    </p>
                    <LeaderboardTable data={topWhalesData} />
                </TabsContent>
                <TabsContent value="top-holders">
                    <p className="text-muted-foreground mb-4 text-sm max-w-2xl">
                       Find the biggest holders of a specific token.
                    </p>
                     <div className="flex flex-col sm:flex-row gap-2 w-full mb-4">
                        <div className="relative w-full sm:w-auto sm:flex-1 md:max-w-xs">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input 
                                placeholder="Filter by token (e.g., WIF)" 
                                className="pl-9 w-full"
                                value={tokenFilter}
                                onChange={(e) => setTokenFilter(e.target.value)}
                            />
                        </div>
                    </div>
                    <LeaderboardTable data={topHoldersData} />
                </TabsContent>
            </Tabs>
        </div>
  );
}
