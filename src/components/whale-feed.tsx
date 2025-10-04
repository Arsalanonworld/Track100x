'use client';
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
import { ArrowRight, RefreshCw, Zap, Search, Copy } from 'lucide-react';
import { whaleTransactions } from '@/lib/mock-data';
import { CryptoIcon } from './crypto-icon';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Separator } from './ui/separator';

const WhaleTransactionDetails = ({ tx }: { tx: typeof whaleTransactions[0] }) => (
    <div className="grid grid-cols-[120px_1fr] gap-y-2 gap-x-4 text-sm py-4">
        <span className="text-muted-foreground">From</span>
        <div className="flex items-center gap-2 font-mono">
            <span>{tx.from}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3"/></Button>
        </div>

        <span className="text-muted-foreground">To</span>
        <div className="flex items-center gap-2 font-mono">
            <span>{tx.to}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3"/></Button>
        </div>

        <span className="text-muted-foreground">Transaction Hash</span>
        <div className="flex items-center gap-2 font-mono">
            <span>{tx.hash}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6"><Copy className="h-3 w-3"/></Button>
        </div>
        
        <Separator className="col-span-2 my-2"/>

        <span className="text-muted-foreground">Gas Fee</span>
        <span>0.05 ETH</span>

        <span className="text-muted-foreground">Price Impact</span>
        <span className="text-red-500">-0.22%</span>
    </div>
)

export function WhaleFeed() {
  return (
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
        <Accordion type="single" collapsible className="w-full space-y-2">
            {whaleTransactions.map((tx) => (
                <AccordionItem value={tx.id} key={tx.id} className="border-0">
                    <Card className="overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-3 hover:bg-muted/50 transition-colors">
                            <div className="flex items-center gap-4 w-full sm:w-auto">
                                <CryptoIcon token={tx.token} />
                                <div>
                                <p className="font-bold text-lg">
                                    ${(tx.amountUSD / 1_000_000).toFixed(1)}M
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    {tx.amountToken.toLocaleString()} {tx.token}
                                </p>
                                </div>
                            </div>
                            <div className="flex-grow font-mono text-sm flex flex-wrap items-center gap-2">
                                <Badge variant="secondary" className="font-semibold">Whale</Badge>
                                <Badge variant="secondary">{tx.from.slice(0, 6)}...{tx.from.slice(-4)}</Badge>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                <Badge variant="secondary">{tx.to.slice(0, 6)}...{tx.to.slice(-4)}</Badge>
                                <Badge variant="default" className="font-semibold">CEX</Badge>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground self-end sm:self-center">
                                <Badge variant="outline">{tx.blockchain}</Badge>
                                <span>5m ago</span>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                                        <Zap className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                        Create Alert for this Wallet
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                        View on Explorer
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <AccordionTrigger className="p-2 hover:bg-accent rounded-md [&[data-state=open]>svg]:-rotate-180" />
                            </div>
                        </div>
                        <AccordionContent className="px-4">
                            <WhaleTransactionDetails tx={tx} />
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
  );
}
