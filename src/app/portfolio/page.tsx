
'use client';

import { useState, useMemo } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, Download, Users, Lock, Wallet as WalletIcon, Eye } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto-icon';
import { cn } from '@/lib/utils';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import React from 'react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { FeatureLockInline } from '@/components/feature-lock-inline';
import Link from 'next/link';
import type { WatchlistItem } from '@/lib/types';
import { collection, query } from 'firebase/firestore';

const portfolioData = {
  netWorth: 125834.54,
  change24h: 2.5,
  change7d: -1.2,
  change30d: 8.9,
  history: {
    '7d': [
      { name: '7d ago', value: 124000 },
      { name: 'Today', value: 125834.54 },
    ],
    '30d': [
        { name: '30d ago', value: 115000 },
        { name: '20d ago', value: 118000 },
        { name: '10d ago', value: 112000 },
        { name: 'Today', value: 125834.54 },
    ],
    'all': [
        { name: '90d ago', value: 95000 },
        { name: '60d ago', value: 110000 },
        { name: '30d ago', value: 115000 },
        { name: 'Today', value: 125834.54 },
    ]
  },
  allocations: [
    { name: 'Ethereum (ETH)', value: 40, color: 'var(--chart-1)' },
    { name: 'Bitcoin (WBTC)', value: 30, color: 'var(--chart-2)' },
    { name: 'Solana (SOL)', value: 15, color: 'var(--chart-3)' },
    { name: 'Memecoins', value: 10, color: 'var(--chart-4)' },
    { name: 'Stablecoins', value: 5, color: 'var(--chart-5)' },
  ],
  topHoldings: [
    { token: 'ETH', amount: '10.5', value: 36750, percentage: 29.2, pnl: 1250.5, pnlPercent: 3.5 },
    { token: 'WBTC', amount: '0.5', value: 34225, percentage: 27.2, pnl: -550.2, pnlPercent: -1.6 },
    { token: 'SOL', amount: '100', value: 16800, percentage: 13.3, pnl: 3200, pnlPercent: 23.5 },
    { token: 'WIF', amount: '2000', value: 5760, percentage: 4.6, pnl: 800, pnlPercent: 16.1 },
  ]
};

// Mock data for wallet details, will be replaced by real data later
const mockWalletDetails = {
    netWorth: 85000, tokens: 15, pnl7d: 12.4, inflow: 15000, outflow: 8000
}


const PnlBadge = ({ value }: { value: number }) => (
  <Badge variant={value >= 0 ? "secondary" : "destructive"} className={cn(
    value >= 0 ? 'text-green-500' : 'text-red-500',
    'bg-opacity-20 border-opacity-30'
  )}>
    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
  </Badge>
);

const TokenPnlCell = ({ value, valuePercent }: { value: number, valuePercent: number }) => (
  <TableCell className={cn("font-medium", value >= 0 ? "text-green-500" : "text-red-500")}>
    <div className='flex items-center gap-1.5'>
      {value >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
      <span>${Math.abs(value).toLocaleString()} ({valuePercent.toFixed(1)}%)</span>
    </div>
  </TableCell>
);

const renderActiveShape = (props: any) => {
  const RADIAN = Math.PI / 180;
  const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? 'start' : 'end';

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


function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-8">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-8 w-1/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="flex justify-between">
                            <Skeleton className="h-12 w-1/3" />
                            <Skeleton className="h-10 w-48" />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2">
                                <Skeleton className="h-[300px] w-full" />
                            </div>
                            <div>
                                <Skeleton className="h-[300px] w-full" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <h2 className="text-2xl font-bold tracking-tight">Wallet Analytics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Skeleton className="h-48 w-full" />
                    <Skeleton className="h-48 w-full" />
                </div>
                 <h2 className="text-2xl font-bold tracking-tight">Token Holdings</h2>
                 <Card>
                    <CardContent className='p-0'>
                        <Skeleton className="h-96 w-full" />
                    </CardContent>
                 </Card>
            </div>
        </div>
    )
}

export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [activeIndex, setActiveIndex] = useState(0);
  const { user, claims, loading: userLoading } = useUser();
  const firestore = useFirestore();
  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  }, [user, firestore]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const wallets = useMemo(() => watchlist?.filter(item => item.type === 'wallet') || [], [watchlist]);
  
  const isLoading = userLoading || watchlistLoading;

  React.useEffect(() => {
    // If user is free, default to 7d view and don't allow changing to longer views
    if (!isLoading && !isPro) {
      setTimeRange('7d');
    }
  }, [isLoading, isPro]);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const chartData = portfolioData.history[timeRange] || portfolioData.history['7d'];
  const displayWallets = isPro ? wallets : wallets.slice(0, 1);

  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Portfolio & Analytics"
        description="A centralized view of your on-chain holdings and performance."
        action={
            <Button variant="outline" disabled={!isPro}>
                <Download className="mr-2 h-4 w-4" />
                Export CSV
                {!isPro && <Lock className="ml-2 h-3 w-3" />}
            </Button>
        }
      />

      {/* Section 1: Portfolio Overview */}
      <section id="overview">
        <Card>
          <CardHeader>
            <CardTitle>Portfolio Overview</CardTitle>
            <CardDescription>Aggregated view of your on-chain wealth.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Net Worth and Time Selector */}
            <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Net Worth</p>
                <p className="text-4xl font-bold">${portfolioData.netWorth.toLocaleString()}</p>
                <PnlBadge value={portfolioData.change24h} />
              </div>
              <Select value={timeRange} onValueChange={(val) => setTimeRange(val as '7d' | '30d' | 'all')}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d" disabled={!isPro}>
                    <div className="flex items-center gap-2">Last 30 Days {!isPro && <Lock className='h-3 w-3' />}</div>
                  </SelectItem>
                  <SelectItem value="all" disabled={!isPro}>
                     <div className="flex items-center gap-2">All Time {!isPro && <Lock className='h-3 w-3' />}</div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Main Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Portfolio Over Time */}
                <div className="lg:col-span-2">
                    <h3 className="font-semibold mb-4">Net Worth Over Time</h3>
                    <div className="h-[300px]">
                        <ChartContainer config={{value: {label: 'Net Worth', color: 'hsl(var(--primary))'}}} className='h-full w-full'>
                            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                                <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                                <Tooltip
                                    cursor={{ stroke: 'hsl(var(--border))' }}
                                    content={({ active, payload, label }) => active && payload && payload.length && (
                                        <ChartTooltipContent
                                          label={label}
                                          payload={payload.map((p) => ({
                                              ...p,
                                              value: (p.value as number).toLocaleString('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                                minimumFractionDigits: 0,
                                                maximumFractionDigits: 0,
                                              })
                                          }))}
                                        />
                                    )}
                                />
                                <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.1} />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                 {/* Asset Allocation */}
                <div>
                     <h3 className="font-semibold mb-4">Asset Allocation</h3>
                     <div className="h-[300px]">
                        <ChartContainer config={{}} className="h-full w-full">
                           <PieChart>
                                <Tooltip
                                 content={({ active, payload }) => {
                                  if (active && payload && payload.length) {
                                    return (
                                      <ChartTooltipContent
                                        payload={payload.map((p) => ({
                                            ...p,
                                            name: p.name,
                                            value: `${p.value}%`
                                        }))}
                                      />
                                    )
                                  }
                                  return null
                                }}
                                />
                                <Pie 
                                    activeIndex={activeIndex}
                                    activeShape={renderActiveShape}
                                    data={portfolioData.allocations} 
                                    dataKey="value" 
                                    nameKey="name" 
                                    cx="50%" 
                                    cy="50%" 
                                    outerRadius={90}
                                    innerRadius={70}
                                    labelLine={false}
                                    onMouseEnter={onPieEnter}
                                >
                                    {portfolioData.allocations.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`hsl(${entry.color})`} />
                                    ))}
                                </Pie>
                                <Legend iconType='circle' />
                            </PieChart>
                        </ChartContainer>
                    </div>
                </div>
            </div>
          </CardContent>
        </Card>
      </section>

       {/* Section 2: Wallet Analytics */}
       <section id="wallet-analytics">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Wallet Analytics</h2>
            {wallets && wallets.length === 0 && !isLoading ? (
                 <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                        <Eye className="h-10 w-10 mx-auto mb-4" />
                        <h3 className='text-xl font-semibold text-foreground'>No Wallets Added</h3>
                        <p>You haven't added any wallets to your watchlist yet.</p>
                        <Button asChild className='mt-4'>
                            <Link href="/watchlist">Add a Wallet</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {displayWallets.map(wallet => (
                        <Card key={wallet.id}>
                            <CardHeader className='flex-row items-center justify-between space-y-0 pb-2'>
                                <CardTitle className="text-base font-medium flex items-center gap-2">
                                    <WalletIcon className="h-5 w-5 text-muted-foreground" />
                                    {wallet.name || `${wallet.identifier.slice(0, 6)}...${wallet.identifier.slice(-4)}`}
                                </CardTitle>
                                {wallet.name && <Badge variant="outline">{`${wallet.identifier.slice(0, 6)}...${wallet.identifier.slice(-4)}`}</Badge>}
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${mockWalletDetails.netWorth.toLocaleString()}</div>
                                <p className="text-xs text-muted-foreground">
                                    <span className={cn(mockWalletDetails.pnl7d > 0 ? "text-green-500" : "text-red-500")}>
                                        {mockWalletDetails.pnl7d > 0 ? "+" : ""}{mockWalletDetails.pnl7d.toFixed(2)}%
                                    </span>
                                    {' '}in last 7 days
                                </p>
                                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Tokens</p>
                                        <p className="font-semibold">{mockWalletDetails.tokens}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Inflow (7d)</p>
                                        <p className="font-semibold text-green-500">${mockWalletDetails.inflow.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Outflow (7d)</p>
                                        <p className="font-semibold text-red-500">${mockWalletDetails.outflow.toLocaleString()}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {!isPro && wallets.length > 1 && (
                    <FeatureLockInline
                            title="Link Unlimited Wallets"
                            description="Upgrade to Pro to link and analyze all of your wallets in one place."
                            icon={<WalletIcon className="h-6 w-6 text-primary" />}
                        />
                    )}
                </div>
            )}
       </section>

      {/* Section 3: Token Holdings */}
      <section id="token-holdings">
         <h2 className="text-2xl font-bold tracking-tight mb-4">Token Holdings</h2>
         <Card>
             <CardContent className='p-0'>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Token</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>% of Portfolio</TableHead>
                        <TableHead>Unrealized P&L</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {portfolioData.topHoldings.map(holding => (
                            <TableRow key={holding.token}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <CryptoIcon token={holding.token} className="h-8 w-8"/>
                                        <span className="font-semibold">{holding.token}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{holding.amount}</TableCell>
                                <TableCell>${holding.value.toLocaleString()}</TableCell>
                                <TableCell>{holding.percentage}%</TableCell>
                                <TokenPnlCell value={holding.pnl} valuePercent={holding.pnlPercent} />
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="sm">Details</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
             </CardContent>
         </Card>
      </section>

       <section id="pro-features">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FeatureLockInline
                title="Benchmark Comparison"
                description="Compare your portfolio performance against benchmarks like ETH, SOL, or BTC."
                icon={<Users className="h-6 w-6 text-primary" />}
                isLocked={!isPro}
            />
            <FeatureLockInline
                title="Wallet Comparison Mode"
                description="Analyze your wallets side-by-side with top traders from the leaderboard."
                icon={<Users className="h-6 w-6 text-primary" />}
                isLocked={!isPro}
            />
         </div>
       </section>

    </div>
  );
}
