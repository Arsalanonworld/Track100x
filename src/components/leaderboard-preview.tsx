
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
import { ArrowRight, Copy, Crown, Wallet2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { getExplorerUrl } from '@/lib/explorers';

const PnlCell = ({ value, label, className }: { value: number, label: string, className?: string }) => (
    <div className={cn("text-center", className)}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("font-semibold text-lg", value >= 0 ? "text-green-500" : "text-red-500")}>
        {value >= 0 ? '+' : ''}{value.toFixed(2)}%
        </p>
    </div>
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
        <div className="flex items-center gap-2">
             <a href={getExplorerUrl('ethereum', address, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-sm text-muted-foreground hover:text-primary transition-colors' onClick={(e) => e.stopPropagation()}>
                {alias}
            </a>
            <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-primary" onClick={copyAddress}><Copy className="h-3 w-3"/></Button>
        </div>
    )
}

const WalletPodiumCard = ({ wallet, rank }: { wallet: typeof leaderboardData[0], rank: number }) => {
    const isFirst = rank === 1;

    return (
        <Card className={cn(
            "flex flex-col transform transition-transform duration-300",
            isFirst ? "bg-card border-primary scale-105 shadow-2xl z-10" : "scale-95 shadow-lg",
        )}>
            <CardHeader className="items-center text-center">
                <div className='flex items-center gap-2'>
                   {isFirst && <Crown className="h-6 w-6 text-yellow-500" />}
                    <p className={cn("text-4xl font-bold", isFirst ? "text-primary" : "text-muted-foreground")}>#{rank}</p>
                </div>
                 <div className="font-semibold text-lg">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
                 <WalletCell alias="View on Etherscan" address={wallet.address} />
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
                <div className='grid grid-cols-2 gap-4'>
                    <PnlCell value={wallet.pnl7d} label="7d P&L" className="col-span-2"/>
                     <div className='text-center border-t pt-4'>
                        <p className='text-xs text-muted-foreground'>Win Rate</p>
                        <p className='font-semibold text-lg'>{wallet.pnl24h.toFixed(0)}%</p>
                    </div>
                     <div className='text-center border-t pt-4'>
                        <p className='text-xs text-muted-foreground'>Trades (7d)</p>
                        <p className='font-semibold text-lg'>{wallet.activity}</p>
                    </div>
                </div>
            </CardContent>
             <div className='p-6 pt-4 text-center'>
                <div className="flex items-center justify-center gap-2 flex-wrap min-h-[24px]">
                    {wallet.tags?.map(tag => <Badge key={tag} variant={isFirst ? "default" : "secondary"}>{tag}</Badge>)}
                </div>
            </div>
        </Card>
    );
};


export function LeaderboardPreview() {
  const topWallets = leaderboardData ? leaderboardData.slice(0, 3) : [];
  
  if (topWallets.length < 3) return null;

  return (
    <section className="py-16 sm:py-24">
       <div className="text-center mb-16">
        <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Follow the Smartest Wallets</h2>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Discover and learn from the top-performing traders in real-time.
        </p>
      </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-0 items-end max-w-6xl mx-auto">
            {/* Rank 2 */}
            <div className="md:order-1">
                 <WalletPodiumCard wallet={topWallets[1]} rank={2} />
            </div>

            {/* Rank 1 */}
            <div className="md:order-2">
                <WalletPodiumCard wallet={topWallets[0]} rank={1} />
            </div>

            {/* Rank 3 */}
            <div className="md:order-3">
                 <WalletPodiumCard wallet={topWallets[2]} rank={3} />
            </div>
        </div>
         <div className="text-center mt-16">
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
