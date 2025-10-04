'use client';
import {
  Card,
  CardContent,
  CardDescription,
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
import { ArrowRight, RefreshCw, Zap, Search } from 'lucide-react';
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
        <div className="space-y-2">
          {whaleTransactions.map((tx) => (
            <div
              key={tx.id}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 rounded-lg border p-3 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <CryptoIcon token={tx.token} className="h-8 w-8" />
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
                <Badge variant="secondary">{tx.from.slice(0, 8)}...{tx.from.slice(-4)}</Badge>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                <Badge variant="secondary">{tx.to.slice(0, 8)}...{tx.to.slice(-4)}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground self-end sm:self-center">
                <Badge variant="outline">{tx.blockchain}</Badge>
                <span>5 minutes ago</span>
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
  );
}
