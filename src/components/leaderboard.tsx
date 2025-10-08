
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
import { leaderboardData, type LeaderboardWallet } from '@/lib/mock-data';
import { ArrowRight, Trophy, TrendingDown, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from './ui/card';
import { WatchlistButton } from './track-button';
import Link from 'next/link';
import { getExplorerUrl } from '@/lib/explorers';

const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trending-up">
        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
        <polyline points="16 7 22 7 22 13"/>
    </svg>
)

export function Leaderboard() {
  
  const PnlCell = ({ value }: { value: number }) => (
    <TableCell className={cn("font-medium", value >= 0 ? "text-green-500" : "text-red-500")}>
      <div className='flex items-center gap-1'>
        {value >= 0 ? <TrendingUpIcon /> : <TrendingDown className="h-4 w-4" />}
        {value.toFixed(2)}%
      </div>
    </TableCell>
  );

  return (
    <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[60px] text-center">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>7d P&L</TableHead>
                  <TableHead>24h P&L</TableHead>
                  <TableHead>Win Rate</TableHead>
                  <TableHead># of Trades (7d)</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Tags</TableHead>
                  <TableHead className="text-right w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaderboardData.map((wallet) => (
                  <TableRow key={wallet.rank}>
                    <TableCell className="font-medium text-base text-center">
                        <div className='flex items-center justify-center'>
                           {wallet.rank === 1 && <Trophy className="h-5 w-5 text-yellow-500 mr-2"/>}
                           {wallet.rank}
                        </div>
                    </TableCell>
                    <TableCell>
                        <div className="font-medium">{wallet.alias}</div>
                        <a href={getExplorerUrl('ethereum', wallet.address, 'address')} target="_blank" rel="noopener noreferrer" className='font-mono text-xs text-muted-foreground hover:text-primary transition-colors'>
                            {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
                        </a>
                    </TableCell>
                    <PnlCell value={wallet.pnl7d} />
                    <PnlCell value={wallet.pnl24h} />
                    <TableCell>
                        <div className="flex items-center gap-1.5">
                            <Percent className='h-4 w-4 text-muted-foreground' />
                            <span className='font-medium'>{wallet.winRate}%</span>
                        </div>
                    </TableCell>
                    <TableCell>{wallet.trades}</TableCell>
                    <TableCell>{wallet.lastActive}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1 flex-wrap">
                            {wallet.tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <WatchlistButton identifier={wallet.address} type="wallet" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
  );
}
