
'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useUser } from '@/firebase';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Lock } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';

// Mock data based on the brief
const transactionVolumeData = [
  { time: '10 AM', ETH: 20, SOL: 15, Others: 15, total: 50 },
  { time: '11 AM', ETH: 25, SOL: 10, Others: 10, total: 45 },
  { time: '12 PM', ETH: 30, SOL: 20, Others: 5, total: 55 },
  { time: '1 PM', ETH: 22, SOL: 18, Others: 12, total: 52 },
  { time: '2 PM', ETH: 40, SOL: 25, Others: 15, total: 80 },
  { time: '3 PM', ETH: 35, SOL: 22, Others: 18, total: 75 },
];

const activityFrequencyData = [
  { wallet: '0x123...abc', transactions: 30 },
  { wallet: '0x456...def', transactions: 25 },
  { wallet: '0x789...ghi', transactions: 22 },
  { wallet: '0xabc...123', transactions: 18 },
  { wallet: '0xdef...456', transactions: 15 },
];

const tokenFlowData = [
  { token: 'SOL', netFlow: 3 },
  { token: 'SHIB', netFlow: -1 },
  { token: 'WIF', netFlow: 2.5 },
  { token: 'PEPE', netFlow: -0.5 },
  { token: 'ETH', netFlow: 1.5 },
];

export function WhaleChart() {
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';
  const [timeframe, setTimeframe] = useState(isPro ? '24h' : '7d');

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-background border p-2 rounded-lg shadow-lg">
          <p className="label font-bold">{`${label}`}</p>
          {payload.map((pld: any) => (
             <p key={pld.dataKey} style={{ color: pld.color }}>{`${pld.dataKey}: ${pld.value}M`}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle>Whale Activity</CardTitle>
            <CardDescription>Visualize whale movements across different metrics.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={timeframe} onValueChange={setTimeframe} disabled={!isPro}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1h" disabled={!isPro}>Last Hour</SelectItem>
                <SelectItem value="6h" disabled={!isPro}>Last 6 Hours</SelectItem>
                <SelectItem value="24h">Last 24 Hours</SelectItem>
                <SelectItem value="7d">Last 7 Days</SelectItem>
                <SelectItem value="30d">Last 30 Days</SelectItem>
                 <SelectItem value="custom" disabled>
                    <div className='flex items-center gap-2'>
                        <Lock className='h-3 w-3' />
                        Custom Range (Pro)
                    </div>
                </SelectItem>
              </SelectContent>
            </Select>
             {!isPro && (
                <Button asChild size="sm">
                    <Link href="/upgrade">Upgrade</Link>
                </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="volume">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="volume">Txn Volume</TabsTrigger>
            <TabsTrigger value="activity">Wallet Activity</TabsTrigger>
            <TabsTrigger value="flow">Token Flow</TabsTrigger>
          </TabsList>

          <div className="h-[400px] mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <TabsContent value="volume" className="h-full">
                <LineChart data={transactionVolumeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis unit="M" />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Line type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} name="Total Volume ($M)" />
                </LineChart>
              </TabsContent>
            </ResponsiveContainer>

            <ResponsiveContainer width="100%" height="100%">
              <TabsContent value="activity" className="h-full">
                <BarChart data={activityFrequencyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="wallet" />
                  <YAxis />
                  <Tooltip cursor={{fill: 'hsl(var(--muted))'}} />
                  <Legend />
                  <Bar dataKey="transactions" fill="hsl(var(--primary))" />
                </BarChart>
              </TabsContent>
            </ResponsiveContainer>

             <ResponsiveContainer width="100%" height="100%">
              <TabsContent value="flow" className="h-full">
                <BarChart data={tokenFlowData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="token" />
                  <YAxis unit="M" label={{ value: 'Net Flow ($M)', angle: -90, position: 'insideLeft' }}/>
                  <Tooltip cursor={{fill: 'hsl(var(--muted))'}} />
                  <Legend />
                  <Bar dataKey="netFlow" name="Net Flow ($M)">
                    {tokenFlowData.map((entry, index) => (
                      <Bar key={`cell-${index}`} fill={entry.netFlow > 0 ? 'hsl(var(--chart-2))' : 'hsl(var(--destructive))'} />
                    ))}
                  </Bar>
                </BarChart>
              </TabsContent>
             </ResponsiveContainer>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}
