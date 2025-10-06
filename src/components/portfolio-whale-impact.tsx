
'use client';

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
import { ArrowDown, ArrowUp } from 'lucide-react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';

const chartData = [
  { date: '2024-10-01', buy: 4000, sell: 2400 },
  { date: '2024-10-02', buy: 3000, sell: 1398 },
  { date: '2024-10-03', buy: 2000, sell: 9800 },
  { date: '2024-10-04', buy: 2780, sell: 3908 },
  { date: '2024-10-05', buy: 1890, sell: 4800 },
  { date: '2024-10-06', buy: 2390, sell: 3800 },
  { date: '2024-10-07', buy: 3490, sell: 4300 },
];

const chartConfig = {
  buy: {
    label: 'Buy Volume',
    color: 'hsl(var(--chart-2))',
  },
  sell: {
    label: 'Sell Volume',
    color: 'hsl(var(--chart-5))',
  },
} satisfies ChartConfig;

const mockImpactfulTransactions = [
  { id: '1', token: 'SOL', type: 'sell', amount: '$1.2M', sentiment: 'negative' },
  { id: '2', token: 'WIF', type: 'buy', amount: '$800K', sentiment: 'positive' },
  { id: '3', token: 'ETH', type: 'sell', amount: '$2.5M', sentiment: 'negative' },
];

export default function PortfolioWhaleImpact() {
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Whale Sentiment Over Time (7d)</CardTitle>
          <CardDescription>
            Buy vs. sell pressure from whale wallets holding your assets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-video">
            <ChartContainer config={chartConfig}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 10,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => `$${Number(value) / 1000}k`}
                  />
                  <Tooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <defs>
                    <linearGradient id="fillBuy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-buy)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-buy)" stopOpacity={0.1} />
                    </linearGradient>
                    <linearGradient id="fillSell" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-sell)" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="var(--color-sell)" stopOpacity={0.1} />
                    </linearGradient>
                  </defs>
                  <Area
                    dataKey="buy"
                    type="natural"
                    fill="url(#fillBuy)"
                    stroke="var(--color-buy)"
                    stackId="a"
                  />
                  <Area
                    dataKey="sell"
                    type="natural"
                    fill="url(#fillSell)"
                    stroke="var(--color-sell)"
                    stackId="a"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Recent Impactful Transactions</CardTitle>
          <CardDescription>
            The latest large transactions affecting your portfolio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Token</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Sentiment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockImpactfulTransactions.map(tx => (
                <TableRow key={tx.id}>
                  <TableCell className="font-medium">{tx.token}</TableCell>
                  <TableCell>
                    <Badge variant={tx.type === 'sell' ? 'destructive' : 'secondary'}>
                      {tx.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{tx.amount}</TableCell>
                  <TableCell>
                    {tx.sentiment === 'positive' && (
                      <span className="flex items-center text-green-500">
                        <ArrowUp className="h-4 w-4 mr-1" /> Positive
                      </span>
                    )}
                    {tx.sentiment === 'negative' && (
                      <span className="flex items-center text-red-500">
                        <ArrowDown className="h-4 w-4 mr-1" /> Negative
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
