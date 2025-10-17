
'use client';

import { Metadata } from 'next';
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
import { Copy, ArrowUpRight, Zap, Eye, Download, Lock } from 'lucide-react';
import { leaderboardData, whaleTransactions, WhaleTransaction } from '@/lib/mock-data';
import { getExplorerUrl } from '@/lib/explorers';
import { WatchlistButton } from '@/components/track-button';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CryptoIcon } from '@/components/crypto-icon';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell, Sector } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import React from 'react';
import TransactionCard from '@/components/transaction-card';


type WalletPageProps = {
  params: {
    address: string;
  };
};

// Find wallet data from mock data
const getWalletData = (address: string) => {
    const wallet = leaderboardData.find(w => w.address.toLowerCase() === address.toLowerCase());
    const transactions = whaleTransactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase() || tx.to.toLowerCase() === address.toLowerCase());
    
    // Create some mock portfolio data based on the wallet
    if (wallet) {
        return {
            ...wallet,
            transactions,
            portfolio: {
                netWorth: parseFloat(wallet.netWorth.replace('$', '').replace('M', '')) * 1000000,
                history: [
                    { name: '30d ago', value: (parseFloat(wallet.netWorth.replace('$', '').replace('M', '')) * 1000000) * (1 - wallet.pnl7d/100) },
                    { name: 'Today', value: parseFloat(wallet.netWorth.replace('$', '').replace('M', '')) * 1000000 },
                ],
                allocations: [
                    { name: wallet.topHolding.token, value: wallet.topHolding.percentage, color: 'hsl(var(--chart-1))' },
                    { name: 'Others', value: 100 - wallet.topHolding.percentage, color: 'hsl(var(--chart-2))' },
                ],
                topHoldings: [
                    {...wallet.topHolding, amount: '1,234.56', value: '$500,000' }
                ]
            }
        };
    }
    return { address, transactions, portfolio: null };
};

export async function generateMetadata({ params }: WalletPageProps): Promise<Metadata> {
  const address = params.address;
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return {
    title: `Wallet Profile: ${shortAddress} | Track100x`,
    description: `On-chain analytics and transaction history for wallet ${address}.`,
  };
}

const PnlBadge = ({ value }: { value: number }) => (
    <Badge variant={value >= 0 ? "secondary" : "destructive"} className={cn(
      value >= 0 ? 'text-green-500' : 'text-red-500',
      'bg-opacity-20 border-opacity-30'
    )}>
      {value >= 0 ? '+' : ''}{value.toFixed(2)}%
    </Badge>
  );

const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill, percent } = props;
  
    return (
      <g>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
         <text x={cx} y={cy} dy={8} textAnchor="middle" fill="hsl(var(--foreground))" className="text-2xl font-bold">
          {(percent * 100).toFixed(0)}%
        </text>
      </g>
    );
};

export default function WalletPage({ params }: WalletPageProps) {
  const walletData = getWalletData(params.address);

  if (!walletData) {
    notFound();
  }

  const { address, portfolio, transactions } = walletData;

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
                    {walletData.pnl7d && <PnlBadge value={walletData.pnl7d} />}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <h3 className="font-semibold mb-4">Net Worth Over Time</h3>
                        <div className="h-[300px]">
                        <ChartContainer config={{value: {label: 'Net Worth', color: 'hsl(var(--primary))'}}} className='h-full w-full'>
                            <AreaChart data={portfolio.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                            <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                            <Tooltip
                                content={({ active, payload, label }) => active && payload?.length && <ChartTooltipContent label={label} payload={payload.map(p => ({...p, value: `$${(p.value as number).toLocaleString()}`}))} />}
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
