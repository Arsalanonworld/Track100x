
'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { walletLeaderboard } from '@/lib/mock-data';
import { ArrowRight, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function LeaderboardPreview() {
  const topWallets = walletLeaderboard.slice(0, 5);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold font-headline">Top Wallets</h2>
        <Button variant="ghost" asChild>
          <Link href="/leaderboard">
            View Full Leaderboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
      <Card className="hover:shadow-lg">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Net Worth</TableHead>
                  <TableHead>P&L (7d)</TableHead>
                  <TableHead className="text-center">7d Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWallets.map((wallet, index) => (
                  <TableRow key={wallet.rank} className="hover:shadow-sm">
                    <TableCell className="font-medium text-base sm:text-lg text-center flex items-center justify-center gap-2">
                      {index === 0 ? <Trophy className="h-5 w-5 text-yellow-500" /> : wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${(wallet.netWorth / 1_000_000).toFixed(2)}M
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-medium',
                        wallet.pnl > 0 ? 'text-green-600' : 'text-red-600',
                        'dark:text-green-500 dark:text-red-500'
                      )}
                    >
                      {wallet.pnl >= 0 ? '+' : '-'}
                      {wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-center">
                      {wallet.activity} txns
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
