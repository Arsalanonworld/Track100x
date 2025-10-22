
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
import { ArrowRight, Copy, Crown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import Link from 'next/link';
import { getExplorerUrl } from '@/lib/explorers';

const StatCell = ({ value, label, className }: { value: string | number, label: string, className?: string }) => (
    <div className={cn("text-center", className)}>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className={cn("font-semibold text-lg")}>
            {value}
        </p>
    </div>
);

const WalletPodiumCard = ({ wallet, rank }: { wallet: typeof leaderboardData[0], rank: number }) => {
    const isFirst = rank === 1;

    return (
        <Link href={`/wallet/${wallet.address}`} className="w-full">
            <Card className={cn(
                "flex flex-col transform transition-all duration-300 w-full h-full hover:shadow-primary/20",
                isFirst 
                    ? "md:scale-105 bg-card border-primary shadow-2xl z-10" 
                    : "md:scale-100 shadow-lg hover:scale-[1.02] hover:shadow-xl",
            )}>
                <CardHeader className="items-center text-center">
                    <div className='flex items-center gap-2'>
                    {isFirst && <Crown className="h-6 w-6 text-yellow-500" />}
                        <p className={cn("text-4xl font-bold", isFirst ? "text-primary" : "text-muted-foreground")}>#{rank}</p>
                    </div>
                    <div className="font-semibold text-lg">{wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}</div>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col justify-between">
                    <div className='grid grid-cols-2 gap-4'>
                        <StatCell value={wallet.netWorth} label="Net Worth" className="col-span-2 border-b pb-4"/>
                        <div className='text-center pt-4'>
                            <p className='text-xs text-muted-foreground'>Top Holding</p>
                            <p className='font-semibold text-lg'>{wallet.topHolding.token}</p>
                        </div>
                        <div className='text-center pt-4'>
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
        </Link>
    );
};


export function LeaderboardPreview() {
  const topWallets = leaderboardData ? leaderboardData.slice(0, 3) : [];
  
  if (topWallets.length < 3) return null;

  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-background to-card/50">
       <div className="container mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Follow the Smartest Wallets</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover and learn from the top-performing traders in real-time.
            </p>
        </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 md:gap-x-4 items-end max-w-6xl mx-auto">
                {/* Rank 2 - Left on Desktop */}
                <div className="md:order-1 flex justify-center">
                    <WalletPodiumCard wallet={topWallets[1]} rank={2} />
                </div>
                
                {/* Rank 1 - Center on Desktop */}
                <div className="md:order-2 flex justify-center">
                    <WalletPodiumCard wallet={topWallets[0]} rank={1} />
                </div>

                {/* Rank 3 - Right on Desktop */}
                <div className="md:order-3 flex justify-center">
                    <WalletPodiumCard wallet={topWallets[2]} rank={3} />
                </div>
            </div>
            <div className="text-center mt-16">
                <Button asChild variant="outline" size="lg">
                    <Link href="/leaderboard">
                        View Full Leaderboard
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>
       </div>
    </section>
  );
}
