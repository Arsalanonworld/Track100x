
'use client';
import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from './ui/input';
import { ArrowRight, RefreshCw, Zap, Search, Copy, ExternalLink } from 'lucide-react';
import { whaleTransactions } from '@/lib/mock-data';
import { CryptoIcon } from './crypto-icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QuickAlertModal } from './quick-alert-modal';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';


export function WhaleFeed() {
    const [selectedWallet, setSelectedWallet] = useState<string | undefined>(undefined);

  return (
    <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedWallet(undefined)}>
        <Card>
            <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex-1">
                    <CardTitle>Live Whale Transactions</CardTitle>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Filter by token..." className="pl-10 w-full sm:w-[180px]" />
                    </div>
                    <Select>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="All Chains" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Chains</SelectItem>
                        <SelectItem value="ethereum">Ethereum</SelectItem>
                        <SelectItem value="solana">Solana</SelectItem>
                        <SelectItem value="bitcoin">Bitcoin</SelectItem>
                        <SelectItem value="polygon">Polygon</SelectItem>
                    </SelectContent>
                    </Select>
                    <Select>
                    <SelectTrigger className="w-full sm:w-[160px]">
                        <SelectValue placeholder="All Types" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                        <SelectItem value="swap">Swap</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex flex-col gap-2">
                    {whaleTransactions.map((tx) => (
                        <div key={tx.id} className="grid grid-cols-1 md:grid-cols-[150px_1fr_250px] items-center gap-4 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            {/* Amount & Token */}
                            <div className="flex items-center gap-4">
                                <CryptoIcon token={tx.token} className="h-10 w-10"/>
                                <div>
                                <p className="font-bold text-lg">
                                    ${(tx.amountUSD / 1_000_000).toFixed(1)}M
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {tx.amountToken.toLocaleString()} {tx.token}
                                </p>
                                </div>
                            </div>
                            
                            {/* From/To */}
                            <div className="flex items-center gap-2 text-sm font-mono flex-wrap">
                                <div className="flex flex-col items-start">
                                    <span className="font-mono">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</span>
                                    <Badge variant="outline" className="font-sans">Whale</Badge>
                                </div>
                                <ArrowRight className="h-4 w-4 text-muted-foreground mx-2" />
                                <div className="flex flex-col items-start">
                                    <span>{tx.to.slice(0,6)}...{tx.to.slice(-4)}</span>
                                    <Badge variant="outline" className="font-sans">CEX</Badge>
                                </div>
                            </div>

                            {/* Meta */}
                            <div className="flex items-center justify-start md:justify-end gap-3 text-sm text-muted-foreground">
                                <Badge variant={tx.type === 'Swap' ? 'default' : 'secondary'}>{tx.type}</Badge>
                                <span>{tx.blockchain}</span>
                                <span>5m ago</span>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                             <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <ExternalLink className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>View on Explorer</p>
                                        </TooltipContent>
                                    </Tooltip>
                                    <Tooltip>
                                        <DialogTrigger asChild>
                                            <TooltipTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedWallet(tx.from)}>
                                                    <Zap className="h-4 w-4" />
                                                </Button>
                                            </TooltipTrigger>
                                        </DialogTrigger>
                                        <TooltipContent>
                                            <p>Create Quick Alert</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center mt-6">
                    <Button variant="outline">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        Load More Transactions
                    </Button>
                </div>
            </CardContent>
        </Card>
        <QuickAlertModal walletAddress={selectedWallet} />
    </Dialog>
  );
}
