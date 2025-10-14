
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, Sector } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowUp, ArrowDown, DollarSign, Wallet as WalletIcon } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto-icon';
import { cn } from '@/lib/utils';
import { ChartTooltip, ChartTooltipContent, ChartContainer } from '@/components/ui/chart';
import React from 'react';


const portfolioData = {
  netWorth: 125834.54,
  change24h: 2.5,
  change7d: -1.2,
  change30d: 8.9,
  history: [
    { name: '30d ago', value: 115000 },
    { name: '20d ago', value: 118000 },
    { name: '10d ago', value: 112000 },
    { name: 'Today', value: 125834.54 },
  ],
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

const wallets = [
    { alias: 'Main Trading', address: '0x123...abc', netWorth: 85000, tokens: 15, pnl7d: 12.4, inflow: 15000, outflow: 8000 },
    { alias: 'Degenerate Gambles', address: '0x456...def', netWorth: 40834, tokens: 5, pnl7d: -5.2, inflow: 25000, outflow: 32000 },
]

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


export default function PortfolioPage() {
  const [timeRange, setTimeRange] = useState('30d');
  const [activeIndex, setActiveIndex] = useState(0);
  
  const onPieEnter = (_: any, index: number) => {
    setActiveIndex(index);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Portfolio & Analytics"
        description="A centralized view of your on-chain holdings and performance."
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
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
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
                            <AreaChart data={portfolioData.history} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wallets.map(wallet => (
                    <Card key={wallet.address}>
                        <CardHeader className='flex-row items-center justify-between'>
                            <div className="flex items-center gap-3">
                                <WalletIcon className="h-6 w-6 text-primary" />
                                <div>
                                    <CardTitle className="text-xl">{wallet.alias}</CardTitle>
                                    <p className="text-sm text-muted-foreground font-mono">{wallet.address}</p>
                                </div>
                            </div>
                            <PnlBadge value={wallet.pnl7d} />
                        </CardHeader>
                        <CardContent className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                            <div>
                                <p className="text-sm text-muted-foreground">Net Worth</p>
                                <p className="font-bold text-lg">${wallet.netWorth.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Tokens</p>
                                <p className="font-bold text-lg">{wallet.tokens}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Inflow (7d)</p>
                                <p className="font-bold text-lg text-green-500">${wallet.inflow.toLocaleString()}</p>
                            </div>
                             <div>
                                <p className="text-sm text-muted-foreground">Outflow (7d)</p>
                                <p className="font-bold text-lg text-red-500">${wallet.outflow.toLocaleString()}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
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

    </div>
  );
}

    