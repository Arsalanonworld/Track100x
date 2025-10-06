
'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FeatureLock } from '@/components/feature-lock';
import { useUser } from '@/firebase';
import { Wallet, Plus, MoreHorizontal, Settings, Trash2, ArrowLeft, Clock, BarChart, Percent, ShieldCheck, Zap, Info, Download, Share, Bell } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const mockConnectedWallet = {
  address: '0x1a2b3c4d5e6f7g8h9i0j1k213m4n5o6p7q8r9s0t',
  name: 'My Main Wallet',
  stats: {
    totalValue: 2300000,
    pnl_24h: 12,
    diversificationScore: 0.72,
    potential: 85,
    tokenCount: 15,
    avgHoldTime: 45, // in days
    topChain: 'Ethereum',
    riskRating: 'Low',
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

const StatCard = ({ title, value, icon, helpText, valueClassName }: { title: string, value: string, icon: React.ReactNode, helpText: string, valueClassName?: string }) => (
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
            <div className="text-xs text-muted-foreground flex items-center gap-1">
                {icon}
            </div>
        </CardContent>
    </Card>
);

const TokenHoldingsTable = ({ tokens }: { tokens: typeof mockConnectedWallet['tokens'] }) => (
    <Card>
        <CardHeader className="flex flex-row items-center justify-between">
            <div>
                <CardTitle>Token Holdings</CardTitle>
                <CardDescription>Assets held in this connected wallet.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
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
);

const WalletActions = () => (
    <div className="flex items-center gap-2">
        <Button><Bell className="mr-2 h-4 w-4" />Create Alert</Button>
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                 <Button variant="outline" size="icon"><MoreHorizontal className="h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                 <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    Wallet Settings
                </DropdownMenuItem>
                 <DropdownMenuItem className="text-red-500 focus:text-red-500">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remove Wallet
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);


const WalletAnalyticsDashboard = () => {
    const wallet = mockConnectedWallet;

    return (
        <div className="space-y-8">
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
                <WalletActions />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Total Portfolio Value" value={`$${(wallet.stats.totalValue / 1000000).toFixed(1)}M`} icon={<BarChart className="h-3 w-3" />} helpText="The current total value of all assets in this wallet." />
                <StatCard title="24h PnL" value={`+${wallet.stats.pnl_24h}%`} valueClassName="text-green-500" icon={<BarChart className="h-3 w-3" />} helpText="Profit and Loss in the last 24 hours." />
                <StatCard title="Risk Rating" value={wallet.stats.riskRating} valueClassName={wallet.stats.riskRating === 'Low' ? 'text-green-500' : 'text-red-500'} icon={<ShieldCheck className="h-3 w-3" />} helpText="An assessment of the portfolio's risk based on volatility and holdings." />
                 <StatCard title="100x Potential" value={`${wallet.stats.potential}%`} icon={<Zap className="h-3 w-3" />} helpText="Proprietary score indicating potential for high growth." />
            </div>
            
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard title="Token Count" value={wallet.stats.tokenCount.toString()} icon={<Plus className="h-3 w-3 rotate-45" />} helpText="The number of unique tokens in this wallet." />
                <StatCard title="Avg. Hold Time" value={`${wallet.stats.avgHoldTime} days`} icon={<Clock className="h-3 w-3" />} helpText="The average time tokens are held in this wallet before being sold or transferred." />
                <StatCard title="Top Chain" value={wallet.stats.topChain} icon={<Link className="h-3 w-3" />} helpText="The blockchain where most of this wallet's activity occurs." />
                <StatCard title="Diversification" value={wallet.stats.diversificationScore.toFixed(2)} icon={<Percent className="h-3 w-3" />} helpText="A score from 0 to 1 indicating portfolio diversification." />
            </div>

            <TokenHoldingsTable tokens={wallet.tokens} />
        </div>
    );
};


const ConnectWalletCard = () => (
    <Card className="text-center max-w-md mx-auto mt-16">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="mt-4">Connect Your Wallet</CardTitle>
        <CardDescription>
          Connect a wallet to see your personalized portfolio analytics and whale impact score.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Connect Wallet
        </Button>
         <p className="text-xs text-muted-foreground mt-4">Read-only access. We will never ask for your private keys.</p>
      </CardContent>
    </Card>
);

export default function PortfolioPage() {
  const { user, loading } = useUser();

  // For demonstration, we'll assume a wallet is always connected.
  // In a real app, this would be based on whether `user` has connected wallets.
  const hasConnectedWallets = true; 

  if (loading) {
    return (
        <div className='max-w-md mx-auto mt-16'>
           <Card className="text-center">
            <CardHeader>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted animate-pulse">
                </div>
                <div className='space-y-2 mt-4'>
                    <div className="h-6 w-3/4 mx-auto bg-muted rounded animate-pulse" />
                    <div className="h-4 w-full mx-auto bg-muted rounded animate-pulse" />
                    <div className="h-4 w-5/6 mx-auto bg-muted rounded animate-pulse" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="h-10 w-40 mx-auto bg-muted rounded animate-pulse" />
                <div className="h-3 w-48 mx-auto bg-muted rounded animate-pulse mt-4" />
            </CardContent>
            </Card>
        </div>
    )
  }

  return (
    <div className="relative">
      {!user && <FeatureLock />}
      <div className="space-y-8">
         <PageHeader
          title="Portfolio Dashboard"
          description="Analyze your connected wallets and see how whale activity impacts your holdings."
        />
        {user && hasConnectedWallets ? (
            <WalletAnalyticsDashboard />
        ) : (
            <ConnectWalletCard />
        )}
      </div>
    </div>
  );
}

    