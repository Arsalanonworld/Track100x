
'use client';

import { notFound } from 'next/navigation';
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
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Copy, ArrowUpRight, Zap, Eye, Download, Lock, TrendingUp, Percent, ArrowRightLeft, Tag } from 'lucide-react';
import { whaleTransactions, type LeaderboardWallet } from '@/lib/mock-data';
import { getExplorerUrl } from '@/lib/explorers';
import { WatchlistButton } from '@/components/track-button';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CryptoIcon } from '@/components/crypto-icon';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Sector, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';
import TransactionCard from '@/components/transaction-card';


type WalletData = LeaderboardWallet & {
    transactions: typeof whaleTransactions,
    portfolio: {
        netWorth: number;
        history: { name: string; value: number }[];
        allocations: { name: string; value: number; color: string }[];
        topHoldings: ({ token: string; percentage: number; amount: string; value: string })[];
    } | null;
}

const PnlBadge = ({ value }: { value: number }) => (
    <Badge variant={value >= 0 ? "secondary" : "destructive"} className={cn(
      value >= 0 ? 'text-green-500' : 'text-red-500',
      'bg-opacity-20 border-opacity-30'
    )}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}%
    </Badge>
  );

const StatCard = ({ title, value, icon, valueClassName }: { title: string, value: string | React.ReactNode, icon: React.ReactNode, valueClassName?: string }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", valueClassName)}>
                    {value}
                </div>
            </CardContent>
        </Card>
    )
};


export function WalletProfile({ walletData }: { walletData: WalletData | { address: string, transactions: any[], portfolio: null } }) {
  if (!walletData) {
    notFound();
  }

  const { address, portfolio, transactions } = walletData;

  const isLeaderboardWallet = 'pnl7d' in walletData;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Wallet Profile"
        description={<span className="font-mono">{address}</span>}
        action={
          <div className="flex items-center gap-2">
            <WatchlistButton identifier={address} type="wallet" />
            <Dialog>
                <DialogTrigger asChild>
                    <Button>
                        <Zap className="mr-2 h-4 w-4" />
                        Create Alert
                    </Button>
                </DialogTrigger>
                <AlertEditorDialog onOpenChange={()=>{}} entity={{ type: 'wallet', identifier: address }} />
            </Dialog>
            
          </div>
        }
      />
      
      {isLeaderboardWallet && (
        <section id="wallet-stats">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <StatCard 
                    title="7-Day P&L"
                    value={`${(walletData as WalletData).pnl7d.toFixed(2)}%`}
                    icon={<TrendingUp className="h-4 w-4 text-muted-foreground" />}
                    valueClassName={(walletData as WalletData).pnl7d >= 0 ? 'text-green-500' : 'text-red-500'}
                />
                 <StatCard 
                    title="7-Day Win Rate"
                    value={`${(walletData as WalletData).winRate.toFixed(1)}%`}
                    icon={<Percent className="h-4 w-4 text-muted-foreground" />}
                />
                 <StatCard 
                    title="7-Day Trades"
                    value={(walletData as WalletData).activity}
                    icon={<ArrowRightLeft className="h-4 w-4 text-muted-foreground" />}
                />
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Tags</CardTitle>
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-2 pt-1">
                             {(walletData as WalletData).tags && (walletData as WalletData).tags.length > 0 ? (
                                (walletData as WalletData).tags.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)
                             ) : (
                                <p className='text-sm text-muted-foreground'>No tags</p>
                             )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </section>
      )}

      {portfolio ? (
        <Card>
            <CardHeader>
            <CardTitle>Wallet Analytics</CardTitle>
            <CardDescription>Performance and holdings for this specific wallet.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                    <div>
                    <p className="text-sm text-muted-foreground">Total Net Worth</p>
                    <p className="text-4xl font-bold">${portfolio.netWorth.toLocaleString()}</p>
                    {(walletData as WalletData).pnl7d && <PnlBadge value={(walletData as WalletData).pnl7d} />}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold mb-4">Net Worth Over Time</h3>
                        <div className="h-[300px]">
                        <ChartContainer config={{value: {label: 'Net Worth', color: 'hsl(var(--primary))'}}} className='h-full w-full'>
                            <AreaChart data={portfolio.history} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                            <Tooltip
                                cursor={{ stroke: 'hsl(var(--border))' }}
                                content={<ChartTooltipContent 
                                    indicator="line"
                                    formatter={(value) => (value as number).toLocaleString('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                      })}
                                />}
                            />
                            <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                            </AreaChart>
                        </ChartContainer>
                        </div>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Asset Allocation</h3>
                        <div className="h-[300px]">
                        <ChartContainer config={{}} className="h-full w-full">
                            <PieChart>
                                <Pie 
                                    data={portfolio.allocations} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={90}
                                    innerRadius={70}
                                    labelLine={false}
                                >
                                    {portfolio.allocations.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={<ChartTooltipContent hideLabel />}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    layout="horizontal"
                                    align="center"
                                    wrapperStyle={{paddingTop: '20px'}}
                                    iconSize={10}
                                />
                            </PieChart>
                        </ChartContainer>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      ) : (
        <Card className='text-center p-8 border-dashed border-2'>
            <CardTitle>Analytics Unavailable</CardTitle>
            <CardDescription>Detailed analytics are only available for wallets on the leaderboard.</CardDescription>
        </Card>
      )}

      <section id="token-holdings">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Token Holdings</h2>
        <Card>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Value</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                        {portfolio?.topHoldings?.map(holding => (
                            <TableRow key={holding.token}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <CryptoIcon token={holding.token} className="h-8 w-8"/>
                                        <span className='font-semibold'>{holding.token}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{holding.amount}</TableCell>
                                <TableCell>{holding.value}</TableCell>
                            </TableRow>
                        )) ?? (
                            <TableRow>
                                <TableCell colSpan={3} className="text-center h-24">
                                No holding data available for this wallet.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
      </section>

      <section id="recent-activity">
        <h2 className="text-2xl font-bold tracking-tight mb-4">Recent Activity</h2>
        <div className="space-y-3">
            {transactions.length > 0 ? (
                transactions.map((tx) => <TransactionCard key={tx.id} tx={tx} />)
            ) : (
                <Card className='text-center p-8 border-dashed border-2'>
                    <p className="text-muted-foreground">No recent transactions found for this wallet in the feed.</p>
                </Card>
            )}
        </div>
      </section>
    </div>
  );
}
