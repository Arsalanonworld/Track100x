
'use client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { walletLeaderboard } from '@/lib/mock-data'
import { cn } from "@/lib/utils"
import Link from 'next/link';

export default function TopWalletsTab() {
    const topWallets = walletLeaderboard.slice(0, 10);
    return (
        <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>Net Worth</TableHead>
                  <TableHead>P&L (7d)</TableHead>
                  <TableHead>Last Tx</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topWallets.map((wallet) => (
                  <TableRow key={wallet.rank}>
                    <TableCell className="font-medium text-lg text-center">
                      #{wallet.rank}
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
                        wallet.pnl > 0 ? 'text-green-500' : 'text-red-500'
                      )}
                    >
                      {wallet.pnl > 0 ? '+' : ''}{wallet.pnlPercent}%
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      10m ago
                    </TableCell>
                    <TableCell className="text-right">
                      <Button asChild variant="outline" size="sm">
                          <Link href="/alerts">Track</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </div>
    )
}
