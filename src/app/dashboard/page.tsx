
'use client';

import { useMemo, useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Wallet, Download, Lock } from 'lucide-react';
import { useUser, useCollection, useFirestore } from '@/firebase';
import type { WatchlistItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
} from "@/components/ui/dialog"
import { FeatureLock } from '@/components/feature-lock';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Sector, Legend } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import React from 'react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HoldingsTable } from '@/components/dashboard/holdings-table';
import { collection, query } from 'firebase/firestore';


const generateChartData = (baseValue: number, days: number, volatility: number) => {
    const data = [];
    let currentValue = baseValue;
    const points = days > 14 ? 30 : days * 2; // Use more points for smoother charts
    for (let i = points; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * days / points));
        
        let dayLabel;
        const dayNumber = Math.floor(i * days / points);

        if (i === 0) {
            dayLabel = 'Today';
        } else if (days <= 14) {
             dayLabel = `${dayNumber}d ago`;
        } else {
            // For longer ranges, only label every 5-ish points to avoid clutter
            const labelFrequency = Math.floor(points / 6);
            if (i % labelFrequency === 0) {
                dayLabel = `${dayNumber}d`;
            } else {
                dayLabel = '';
            }
        }
        
        if (i < points) {
         currentValue *= 1 + (Math.random() - 0.48) * volatility * (Math.sqrt(days / points));
        }
        data.push({ name: dayLabel, value: currentValue });
    }
    return data;
}

const portfolioData = {
  netWorth: 125834.54,
  change24h: 2.5,
  history: {
    '7d': generateChartData(124000, 7, 0.02),
    '30d': generateChartData(115000, 30, 0.03),
    'all': generateChartData(95000, 90, 0.04),
  },
  allocations: [
    { name: 'WIF', value: 45.3, color: 'hsl(var(--chart-1))' },
    { name: 'ETH', value: 31.8, color: 'hsl(var(--chart-2))' },
    { name: 'USDC', value: 13.6, color: 'hsl(var(--chart-3))' },
    { name: 'SOL', value: 6.8, color: 'hsl(var(--chart-4))' },
    { name: 'Others', value: 2.5, color: 'hsl(var(--chart-5))' },
  ]
};

const renderActiveShape = (props: any) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    
    return (
      <g>
        <text x={cx} y={cy} dy={-10} textAnchor="middle" fill={fill} className='text-sm font-semibold'>
          {payload.name}
        </text>
         <text x={cx} y={cy} dy={12} textAnchor="middle" fill="hsl(var(--foreground))" className="text-2xl font-bold">
          {`${(percent * 100).toFixed(1)}%`}
        </text>
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
      </g>
    );
};


const PnlBadge = ({ value }: { value: number }) => (
  <Badge variant={value >= 0 ? "secondary" : "destructive"} className={cn(
    value >= 0 ? 'text-green-500' : 'text-red-500',
    'bg-opacity-20 border-opacity-30'
  )}>
    {value >= 0 ? '+' : ''}{value.toFixed(2)}%
  </Badge>
);

function PageSkeleton() {
    return (
        <div className='space-y-8'>
            <div className='flex justify-between items-center'>
                 <Skeleton className="h-12 w-1/3" />
                 <Skeleton className="h-10 w-32" />
            </div>
            <Card>
                <CardContent className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                    <Skeleton className="h-10 w-10 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-6 w-1/2 mx-auto mb-2" />
                    <Skeleton className="h-4 w-3/4 mx-auto mb-4" />
                    <Skeleton className="h-10 w-32 mx-auto" />
                </CardContent>
            </Card>
        </div>
    )
}

function EmptyDashboardState() {
    return (
        <Card>
            <CardContent className="p-8 text-center text-muted-foreground border-2 border-dashed rounded-lg">
                <Wallet className="h-10 w-10 mx-auto mb-4" />
                <h3 className='text-xl font-semibold text-foreground'>Your Dashboard is Empty</h3>
                <p>Add wallets or tokens to your watchlist to see your portfolio overview, analytics, and alerts.</p>
                <div className="mt-4">
                    <p className="text-sm">Use the form on the Watchlist page to get started.</p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function DashboardPage() {
  const { user, loading: userLoading, claims } = useUser();
  const firestore = useFirestore();
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [activeIndex, setActiveIndex] = useState(0);

  const isPro = claims?.plan === 'pro';

  const watchlistQuery = useMemo(() => {
    if (user && firestore) {
      return query(collection(firestore, `users/${user.uid}/watchlist`));
    }
    return null;
  }, [user, firestore]);

  const { data: watchlist, loading: watchlistLoading } = useCollection<WatchlistItem>(watchlistQuery);
  const isLoading = userLoading || watchlistLoading;
  const hasWallets = (watchlist?.length || 0) > 0;

  React.useEffect(() => {
    if (!isLoading && !isPro) {
      setTimeRange('7d');
    }
  }, [isLoading, isPro]);
  
  const chartData = portfolioData.history[timeRange] || portfolioData.history['7d'];
  const allocationData = portfolioData.allocations;

  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };
  
  const pageDescription = isPro
    ? 'Track your wallets, tokens, and alerts all in one place.'
    : `You are on the Free plan. Upgrade to unlock all features.`;
  
  if (isLoading) {
    return <PageSkeleton />;
  }

  return (
    <Dialog>
        <div className="relative">
            {!user && !userLoading && <FeatureLock />}
            <div className="space-y-8">
                <PageHeader
                    title="My Dashboard"
                    description={pageDescription}
                    action={
                        <Button variant="outline" disabled={!isPro || !hasWallets}>
                            <Download className="mr-2 h-4 w-4" />
                            Export Data
                            {!isPro && <Lock className="ml-2 h-3 w-3" />}
                        </Button>
                    }
                />

                {!hasWallets && !isLoading ? (
                  <EmptyDashboardState />
                ) : (
                  <>
                  {/* Section 1: Portfolio Overview */}
                  <section id="overview">
                    <Card>
                        <CardHeader>
                          <CardTitle>Portfolio Overview</CardTitle>
                          <CardDescription>Aggregated view of your on-chain wealth from your watched wallets.</CardDescription>
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
                          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                <h3 className="font-semibold mb-4 text-center lg:text-left">Net Worth Over Time</h3>
                                <div className="h-[350px]">
                                    <ChartContainer config={{value: {label: 'Net Worth', color: 'hsl(var(--primary))'}}} className='h-full w-full'>
                                        <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} tickFormatter={(value) => {
                                              if (chartData.length > 20 && value) return value.replace(' ago', '');
                                              return value;
                                            }}/>
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
                            <div className="h-[350px]">
                                <h3 className="font-semibold mb-4 text-center lg:text-left">Asset Allocation</h3>
                                 <ChartContainer config={{}} className="h-full w-full">
                                    <PieChart>
                                        <Pie 
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={allocationData} 
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={100}
                                            fill="var(--color-value)"
                                            dataKey="value"
                                            onMouseEnter={onPieEnter}
                                            labelLine={false}
                                            label={false}
                                        >
                                            {allocationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                         <Legend
                                            onMouseEnter={(_, index) => onPieEnter(_, index)}
                                            verticalAlign="bottom" 
                                            height={40} 
                                            content={({ payload }) => (
                                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground">
                                                {payload?.map((entry, index) => (
                                                <div key={`item-${index}`} className={cn("flex items-center gap-1.5 cursor-pointer transition-opacity", activeIndex !== index && 'opacity-50 hover:opacity-100')}>
                                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span>{entry.value}</span>
                                                </div>
                                                ))}
                                            </div>
                                            )}
                                        />
                                    </PieChart>
                                </ChartContainer>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                  </section>
                   <section id="token-holdings">
                        <HoldingsTable />
                    </section>
                  </>
                )}
            </div>
        </div>
    </Dialog>
  );
}
