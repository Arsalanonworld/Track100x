import PageHeader from '@/components/page-header';
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
import { ArrowUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function LeaderboardPage() {
  return (
    <>
      <PageHeader
        title="Wallet Leaderboard"
        description="Ranked wallets by net worth, P&L, and activity."
      />

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex-1">
              <CardTitle>Top Wallets</CardTitle>
              <CardDescription>
                Discover the biggest players in the crypto space.
              </CardDescription>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select>
                <SelectTrigger className="w-full sm:w-[160px]">
                  <SelectValue placeholder="Blockchain" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[80px]">Rank</TableHead>
                  <TableHead>Wallet</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-4">
                      Net Worth
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="-ml-4">
                      P&L (24h)
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Activity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {walletLeaderboard.map((wallet) => (
                  <TableRow key={wallet.rank}>
                    <TableCell className="font-medium text-lg">
                      {wallet.rank}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="font-mono">
                        {wallet.address.slice(0, 10)}...{wallet.address.slice(-8)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      ${wallet.netWorth.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={cn(
                        'font-medium',
                        wallet.pnl > 0 ? 'text-green-600' : 'text-red-600',
                        'dark:text-green-500 dark:text-red-500'
                      )}
                    >
                      {wallet.pnl >= 0 ? '+' : '-'}$
                      {Math.abs(wallet.pnl).toLocaleString()} (
                      {wallet.pnlPercent}%)
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          wallet.activity === 'High'
                            ? 'destructive'
                            : wallet.activity === 'Medium'
                            ? 'default'
                            : 'secondary'
                        }
                      >
                        {wallet.activity}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
