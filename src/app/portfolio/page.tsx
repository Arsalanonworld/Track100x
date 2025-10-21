
'use client';

import React, { useState } from 'react';
import PageHeader from '@/components/page-header';
import { useUser } from '@/firebase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, Sector, Legend, ResponsiveContainer } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { HoldingsTable } from '@/components/dashboard/holdings-table';
import { Skeleton } from '@/components/ui/skeleton';
import { Lock, Wallet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { withAuth } from '@/components/auth/withAuth';

const generateChartData = (baseValue: number, days: number, volatility: number) => {
    const data = [];
    let currentValue = baseValue;
    const points = days > 14 ? 30 : days * 2;
    for (let i = points; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - (i * days / points));
        
        let dayLabel;
        if (i === points) {
            dayLabel = `${days}d ago`;
        } else if (i === 0) {
            dayLabel = 'Today';
        } else {
            const step = Math.floor(points / 5);
            if (points > 5 && i % step === 0 && (i * days / points) > 1) {
                dayLabel = `${Math.round(i * days / points)}d`;
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
    const isMobile = window.innerWidth < 768;
    
    return (
      <g>
        {!isMobile && (
            <text x={cx} y={cy} dy={-8} textAnchor="middle" fill={fill} className='text-xs sm:text-sm font-semibold truncate'>
                {payload.name}
            </text>
        )}
         <text x={cx} y={cy} dy={isMobile ? 0 : 14} textAnchor="middle" fill="hsl(var(--foreground))" className="text-xl sm:text-2xl font-bold">
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
            </div>
             <Skeleton className="h-96 w-full" />
             <Skeleton className="h-64 w-full" />
        </div>
    )
}

function PortfolioPage() {
    const { claims, loading: userLoading } = useUser();
    const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');
    const [activeIndex, setActiveIndex] = useState(0);

    const isPro = claims?.plan === 'pro';

    React.useEffect(() => {
        if (!userLoading && !isPro) {
          setTimeRange('7d');
        }
      }, [userLoading, isPro]);
    
    const chartData = portfolioData.history[timeRange] || portfolioData.history['7d'];
    const allocationData = portfolioData.allocations;

    const onPieEnter = (_: any, index: number) => {
        setActiveIndex(index);
    };

    // Mocking this, in reality we'd check if any wallets are in watchlist
    const hasWallets = true; 

    return (
        <div>
            <PageHeader
                title="Portfolio"
                description="Aggregated view of your on-chain wealth from your watched wallets."
            />
            
            {hasWallets ? (
              <div className='space-y-8'>
                <section id="overview">
                    <Card>
                        <CardHeader>
                        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2'>
                            <div>
                            <CardTitle>Portfolio Overview</CardTitle>
                            <CardDescription>Performance across all your watched wallets.</CardDescription>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent className="space-y-8">
                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                            <div>
                            <p className="text-sm text-muted-foreground">Total Net Worth</p>
                            <p className="text-3xl sm:text-4xl font-bold">${portfolioData.netWorth.toLocaleString()}</p>
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
                        
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                            <div className="lg:col-span-2">
                                <h3 className="font-semibold mb-4 text-center lg:text-left">Net Worth Over Time</h3>
                                <div className="h-[250px] sm:h-[350px]">
                                <ChartContainer config={{
                                        value: {
                                            label: "Net Worth",
                                            color: "hsl(var(--primary))",
                                        },
                                        }} className="h-full w-full">
                                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" />
                                            <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                            <YAxis tickFormatter={(value) => `$${(Number(value) / 1000)}k`} tick={{ fill: 'hsl(var(--muted-foreground))' }} fontSize={12} axisLine={false} tickLine={false} />
                                            <Tooltip
                                                cursor={{ stroke: 'hsl(var(--border))' }}
                                                content={<ChartTooltipContent
                                                    indicator="line"
                                                    labelFormatter={(label, payload) => {
                                                        const item = payload[0];
                                                        if (item && item.payload.name) {
                                                            return item.payload.name;
                                                        }
                                                        return label;
                                                    }}
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
                            <div className="h-[250px] sm:h-[350px]">
                                <h3 className="font-semibold mb-4 text-center lg:text-left">Asset Allocation</h3>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie 
                                            activeIndex={activeIndex}
                                            activeShape={renderActiveShape}
                                            data={allocationData} 
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            fill="var(--color-value)"
                                            dataKey="value"
                                            onMouseEnter={onPieEnter}
                                            labelLine={false}
                                            label={false}
                                        >
                                            {allocationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} style={{ outline: 'none' }} />
                                            ))}
                                        </Pie>
                                        <Legend
                                            onMouseEnter={(_, index) => onPieEnter(_, index)}
                                            verticalAlign="bottom" 
                                            layout="horizontal"
                                            align="center"
                                            wrapperStyle={{paddingTop: '20px'}}
                                            iconSize={10}
                                            content={({ payload }) => (
                                            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 mt-4 text-xs text-muted-foreground">
                                                {payload?.map((entry, index) => (
                                                <div key={`item-${index}`} onMouseEnter={() => onPieEnter(entry, index)} className={cn("flex items-center gap-1.5 cursor-pointer transition-opacity", activeIndex !== index && 'opacity-50 hover:opacity-100')}>
                                                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                                                    <span>{entry.value}</span>
                                                </div>
                                                ))}
                                            </div>
                                            )}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                </section>

                <section>
                  <HoldingsTable />
                </section>
              </div>
            ) : (
                <Card className="text-center p-8 border-2 border-dashed">
                    <Wallet className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-2xl font-bold">Your Portfolio is Empty</h3>
                    <p className="text-muted-foreground max-w-sm mx-auto mt-2 mb-6">
                        Add a wallet to your watchlist to start tracking your portfolio's performance.
                    </p>
                    <Button asChild>
                        <Link href="/watchlist">
                            Go to Watchlist
                        </Link>
                    </Button>
                </Card>
            )}
        </div>
    );
}


export default withAuth(PortfolioPage, { skeleton: PageSkeleton });
