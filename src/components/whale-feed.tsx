
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
import { ArrowRight, RefreshCw, Zap, Search, ExternalLink, MoreVertical } from 'lucide-react';
import { whaleTransactions } from '@/lib/mock-data';
import { CryptoIcon } from './crypto-icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  Dialog,
  DialogTrigger,
} from '@/components/ui/dialog';
import { QuickAlertModal } from './quick-alert-modal';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './ui/tooltip';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

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
                <Accordion type="single" collapsible className="space-y-2">
                    {whaleTransactions.map((tx) => (
                        <AccordionItem value={tx.id} key={tx.id} className="border-b-0">
                             <Card className="overflow-hidden">
                                <div className="flex items-center p-4">
                                     {/* Amount & Token */}
                                    <div className="flex items-center gap-4 flex-1">
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
                                    {/* Meta */}
                                    <div className="hidden sm:flex items-center justify-end gap-3 text-sm text-muted-foreground">
                                        <Badge variant={tx.type === 'Swap' ? 'default' : 'secondary'}>{tx.type}</Badge>
                                        <span>{tx.blockchain}</span>
                                        <span>5m ago</span>
                                    </div>
                                     <div className="flex items-center gap-0 ml-4">
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
                                            <DialogTrigger asChild>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedWallet(tx.from)}>
                                                            <Zap className="h-4 w-4" />
                                                        </Button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Create Quick Alert</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </DialogTrigger>
                                        </TooltipProvider>
                                        <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:-rotate-180">
                                            <MoreVertical className="h-4 w-4"/>
                                        </AccordionTrigger>
                                    </div>
                                </div>
                                <AccordionContent>
                                    <div className="bg-muted/50 px-4 py-3 border-t text-sm font-mono">
                                        <div className="flex justify-between items-center">
                                            <p>From: <span className="text-foreground">{tx.from}</span></p>
                                            <Badge variant="outline" className="font-sans">Whale</Badge>
                                        </div>
                                         <div className="flex justify-between items-center mt-1">
                                            <p>To: <span className="text-foreground">{tx.to}</span></p>
                                            <Badge variant="outline" className="font-sans">CEX</Badge>
                                        </div>
                                        <div className="mt-2">
                                            <p>Tx Hash: <span className="text-foreground">{tx.hash}</span></p>
                                        </div>
                                    </div>
                                </AccordionContent>
                             </Card>
                        </AccordionItem>
                    ))}
                </Accordion>

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
