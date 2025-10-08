
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
import { leaderboardData } from '@/lib/mock-data';
import { ArrowRight, Copy, Wallet2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getExplorerUrl } from '@/lib/explorers';

const PnlCell = ({ value }: { value: number }) => (
    <p className={cn("font-medium text-sm", value >= 0 ? "text-green-500" : "text-red-500")}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}%
    </p>
);

const WalletCell = ({ alias, address }: { alias: string, address: string}) => {
    const { toast } = useToast();
    
    const copyAddress = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        navigator.clipboard.writeText(address);
        toast({ title: 'Address Copied!' });
    };

    return (
        <div>
            <div className="font-semibold text-base">{alias}</div>
            <div className="flex items-center gap-2">
                <a href={getExplorerUrl('ethereum', address, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-xs text-muted-foreground hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
                    {address.slice(0, 6)}...{address.slice(-4)}
                </a>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyAddress}><Copy className="h-3 w-3"/></Button>
            </div>
        </div>
    )
}

export function LeaderboardPreview() {
  const topWallets = leaderboardData ? leaderboardData.slice(0, 3) : [];

  return (
    <section className="py-16 sm:py-24">
       <div className="text-center mb-12">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Follow the Smartest Wallets</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Discover and learn from the top-performing traders in real-time.
        </p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {topWallets.map((wallet) => (
            <Card key={wallet.address} className="flex flex-col">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <WalletCell alias={wallet.address.slice(0,6)} address={wallet.address} />
                        <div className="flex flex-col items-end">
                            <p className="text-xs text-muted-foreground">7d P&L</p>
                            <PnlCell value={wallet.pnl7d} />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex-1 space-y-3">
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Win Rate</span>
                        <span className="font-medium">{wallet.activity}%</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Trades (7d)</span>
                        <span className="font-medium">{wallet.activity}</span>
                     </div>
                </CardContent>
                 <div className='p-6 pt-0'>
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Placeholder for tags */}
                    </div>
                </div>
            </Card>
        ))}
        </div>
         <div className="text-center mt-12">
            <Button asChild variant="outline">
                <Link href="/leaderboard">
                    View Full Leaderboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
            </Button>
        </div>
    </section>
  );
}
