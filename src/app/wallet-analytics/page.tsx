
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Plus, Bell, Search, Info, Link as LinkIcon, BarChart, ShieldCheck, Clock, Percent, Download } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto-icon';
import { AreaChart, Area, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { Input } from '@/components/ui/input';

import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CreateAlertDialog } from '@/components/create-alert-dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useToast } from '@/hooks/use-toast';

const mockAnalyzedWallet = {
  address: '0x1a2b3c4d5e6f7g8h9i0j1k213m4n5o6p7q8r9s0t',
  name: 'Analyzed Wallet',
  stats: {
    totalValue: 2300000,
    pnl_24h: 12,
    riskRating: 'Low',
    topChain: 'Ethereum',
    tokenCount: 15,
    avgHoldTime: 45, // in days
  },
  tokens: [
    {
      symbol: 'WETH',
      name: 'Wrapped Ether',
      quantity: 12.5,
      value: 43750,
      allocation: 37.12,
      avgBuyPrice: 3200.00,
      unrealizedPnl: 3750.00,
      unrealizedPnlPercent: 9.38,
      whaleActivity: 'Medium',
    },
    {
      symbol: 'PEPE',
      name: 'Pepe',
      quantity: 1500000000,
      value: 18000,
      allocation: 15.27,
      avgBuyPrice: 0.00,
      unrealizedPnl: 6000.00,
      unrealizedPnlPercent: 50.00,
      whaleActivity: 'High',
    },
    {
      symbol: 'WIF',
      name: 'dogwifhat',
      quantity: 10000,
      value: 25000,
      allocation: 21.21,
      avgBuyPrice: 1.80,
      unrealizedPnl: 7000.00,
      unrealizedPnlPercent: 38.89,
      whaleActivity: 'High',
    },
    {
      symbol: 'LINK',
      name: 'Chainlink',
      quantity: 800,
      value: 11600,
      allocation: 9.84,
      avgBuyPrice: 15.00,
      unrealizedPnl: -400.00,
      unrealizedPnlPercent: -3.33,
      whaleActivity: 'Low',
    },
     {
      symbol: 'RNDR',
      name: 'Render',
      quantity: 2500,
      value: 19500,
      allocation: 16.55,
      avgBuyPrice: 8.50,
      unrealizedPnl: -1750.00,
      unrealizedPnlPercent: -17.50,
      whaleActivity: 'Medium',
    },
  ]
};

const pnlChartData = [
  { time: '24h ago', value: 2050000 },
  { time: '18h ago', value: 2100000 },
  { time: '12h ago', value: 2150000 },
  { time: '6h ago', value: 2250000 },
  { time: 'now', value: 2300000 },
]

const PnlChart = () => (
  <ResponsiveContainer width="100%" height={50}>
    <AreaChart data={pnlChartData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
      <defs>
        <linearGradient id="pnlColor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4}/>
          <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <RechartsTooltip 
        contentStyle={{ 
            backgroundColor: 'hsl(var(--background))',
            borderColor: 'hsl(var(--border))',
            borderRadius: 'var(--radius)',
        }}
        labelStyle={{ fontWeight: 'bold' }}
        formatter={(value) => [`$${Number(value).toLocaleString()}`, 'Value']}
      />
      <Area type="monotone" dataKey="value" stroke="hsl(var(--primary))" fill="url(#pnlColor)" strokeWidth={2} />
    </AreaChart>
  </ResponsiveContainer>
);


const StatCard = ({ title, value, icon, helpText, valueClassName, children }: { title: string, value: string, icon?: React.ReactNode, helpText: string, valueClassName?: string, children?: React.ReactNode }) => (
    <Card>
        <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
                <CardDescription>{title}</CardDescription>
                <TooltipProvider>
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>{helpText}</p>
                        </TooltipContent>
                    </Tooltip>
                </TooltipProvider>
            </div>
            <CardTitle className={cn("text-2xl font-bold", valueClassName)}>{value}</CardTitle>
        </CardHeader>
        <CardContent>
            {icon && <div className="text-xs text-muted-foreground flex items-center gap-1">{icon}</div>}
            {children}
        </CardContent>
    </Card>
);

const TokenHoldingsTable = ({ tokens }: { tokens: typeof mockAnalyzedWallet['tokens'] }) => {
    const { toast } = useToast();
    
    const handleExport = () => {
        toast({
            title: "Export Started",
            description: "Your token holdings data will be downloaded shortly.",
        });
    }

    return (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Token Holdings</CardTitle>
                <CardDescription>Assets held in this wallet.</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport}>
                <Download className="mr-2 h-4 w-4" />
                Export
            </Button>
        </CardHeader>
        <CardContent>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[200px]">Token</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead className="w-[150px]">Allocation</TableHead>
                        <TableHead>Avg. Buy Price</TableHead>
                        <TableHead>Unrealized P/L</TableHead>
                        <TableHead>Whale Activity</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tokens.map(token => (
                        <TableRow key={token.symbol}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <CryptoIcon token={token.symbol} className="h-8 w-8" />
                                    <div>
                                        <p className="font-semibold">{token.name}</p>
                                        <p className="text-xs text-muted-foreground">{token.symbol}</p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell>{token.quantity.toLocaleString()}</TableCell>
                            <TableCell className="font-medium">${token.value.toLocaleString()}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <Progress value={token.allocation} className="h-2 w-16" />
                                    <span className="text-xs text-muted-foreground">{token.allocation.toFixed(2)}%</span>
                                </div>
                            </TableCell>
                            <TableCell>${token.avgBuyPrice.toFixed(2)}</TableCell>
                            <TableCell className={cn(token.unrealizedPnl >= 0 ? 'text-green-500' : 'text-red-500')}>
                                <p className="font-medium">${token.unrealizedPnl.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                                <p className="text-xs">({token.unrealizedPnlPercent.toFixed(2)}%)</p>
                            </TableCell>
                            <TableCell>
                                <Badge variant={
                                    token.whaleActivity === 'High' ? 'destructive' :
                                    token.whaleActivity === 'Medium' ? 'secondary' : 'outline'
                                }>{token.whaleActivity}</Badge>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </CardContent>
    </Card>
)};

const WalletActions = ({ walletAddress }: { walletAddress: string }) => {
    const [isAlertEditorOpen, setIsAlertEditorOpen] = useState(false);

    return (
        <Dialog open={isAlertEditorOpen} onOpenChange={setIsAlertEditorOpen}>
            <div className="flex items-center gap-2">
                <Button variant='outline'><Plus className="mr-2 h-4 w-4" />Track Wallet</Button>
                <DialogTrigger asChild>
                    <Button><Bell className="mr-2 h-4 w-4" />Create Alert</Button>
                </DialogTrigger>
            </div>
            {isAlertEditorOpen && (
                <CreateAlertDialog
                    onOpenChange={setIsAlertEditorOpen}
                    entity={{ type: 'wallet', identifier: walletAddress }}
                />
            )}
        </Dialog>
    );
};

const WalletAnalyticsDashboard = ({ walletAddress }: { walletAddress: string }) => {
    const wallet = mockAnalyzedWallet;

    return (
        <div className="space-y-8 mt-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <CryptoIcon token={wallet.stats.topChain} className="h-10 w-10" />
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                           {wallet.name}
                        </h1>
                        <p className="font-mono text-sm text-muted-foreground">{wallet.address}</p>
                    </div>
                </div>
                <WalletActions walletAddress={wallet.address} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Portfolio Value" value={`$${(wallet.stats.totalValue / 1000000).toFixed(1)}M`} icon={<BarChart className="h-3 w-3" />} helpText="The current total value of all assets in this wallet." />
                <StatCard title="24h PnL" value={`${wallet.stats.pnl_24h > 0 ? '+' : ''}${wallet.stats.pnl_24h}%`} valueClassName={wallet.stats.pnl_24h >= 0 ? 'text-green-500' : 'text-red-500'} helpText="Profit and Loss in the last 24 hours.">
                  <PnlChart />
                </StatCard>
                <StatCard title="Risk Rating" value={wallet.stats.riskRating} valueClassName={wallet.stats.riskRating === 'Low' ? 'text-green-500' : 'text-red-500'} icon={<ShieldCheck className="h-3 w-3" />} helpText="An assessment of the portfolio's risk based on volatility and holdings." />
                 <StatCard title="Top Chain" value={wallet.stats.topChain} icon={<LinkIcon className="h-3 w-3" />} helpText="The blockchain where most of this wallet's activity occurs." />
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <StatCard title="Token Count" value={wallet.stats.tokenCount.toString()} icon={<Plus className="h-3 w-3 rotate-45" />} helpText="The number of unique tokens in this wallet." />
                <StatCard title="Avg. Hold Time" value={`${wallet.stats.avgHoldTime} days`} icon={<Clock className="h-3 w-3" />} helpText="The average time tokens are held in this wallet before being sold or transferred." />
                <StatCard title="Diversification" value={`${(0.72 * 100).toFixed(0)}%`} icon={<Percent className="h-3 w-3" />} helpText="A score from 0% to 100% indicating portfolio diversification." />
            </div>

            <TokenHoldingsTable tokens={wallet.tokens} />
        </div>
    );
};

const WalletSearch = ({ onSearch }: { onSearch: (address: string) => void }) => {
    const [address, setAddress] = useState('');

    const handleSearch = () => {
        if (address) {
            onSearch(address);
        }
    }

    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Analyze Any Wallet</CardTitle>
                <CardDescription>Enter an ETH wallet address to get a detailed breakdown of its holdings and activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    <Input 
                        placeholder="Enter wallet address (e.g., 0x...)" 
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                    <Button onClick={handleSearch}>
                        <Search className="mr-2 h-4 w-4" />
                        Analyze
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}

export default function WalletAnalyticsPage() {
  const [analyzedAddress, setAnalyzedAddress] = useState<string | null>(null);

  return (
    <div className="space-y-8">
        <PageHeader
        title="Wallet Analytics"
        description="Get deep insights into any wallet on the blockchain."
        />
        
        {!analyzedAddress ? (
            <WalletSearch onSearch={setAnalyzedAddress} />
        ) : (
            <WalletAnalyticsDashboard walletAddress={analyzedAddress} />
        )}
    </div>
  );
}

    