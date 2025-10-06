
'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FeatureLock } from '@/components/feature-lock';
import { useUser } from '@/firebase';
import { Wallet, Plus, MoreHorizontal, Settings, Trash2, AlertTriangle } from 'lucide-react';
import { CryptoIcon } from '@/components/crypto-icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';

const mockConnectedWallets = [
  {
    name: 'My Main Wallet',
    address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    blockchain: 'ethereum',
    totalValue: 124567.89,
    pnl_24h: 3.45,
    tokens: [
      { symbol: 'ETH', name: 'Ethereum', value: 75000, allocation: 60.2 },
      { symbol: 'WIF', name: 'dogwifhat', value: 25000, allocation: 20.0 },
      { symbol: 'PEPE', name: 'Pepe', value: 10000, allocation: 8.0 },
      { symbol: 'USDC', name: 'USD Coin', value: 14567.89, allocation: 11.8 },
    ]
  }
];

const ConnectWalletCard = () => (
    <Card className="text-center">
      <CardHeader>
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Wallet className="h-6 w-6 text-primary" />
        </div>
        <CardTitle className="mt-4">Connect Your First Wallet</CardTitle>
        <CardDescription>
          Connect your wallet to start tracking your portfolio and get personalized whale insights.
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

const ConnectedWalletCard = ({ wallet }: { wallet: typeof mockConnectedWallets[0] }) => {
    return (
        <Card>
            <CardHeader className='flex-row items-start justify-between'>
                <div>
                    <div className='flex items-center gap-3'>
                        <Wallet className="h-6 w-6 text-primary" />
                        <CardTitle>{wallet.name}</CardTitle>
                    </div>
                    <CardDescription className='mt-2 font-mono text-xs'>{wallet.address}</CardDescription>
                </div>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem><Settings className='mr-2 h-4 w-4' />Settings</DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive focus:bg-destructive/10"><Trash2 className='mr-2 h-4 w-4' />Disconnect</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </CardHeader>
            <CardContent className='space-y-6'>
                <div className='p-4 rounded-lg bg-muted/50'>
                    <p className='text-sm text-muted-foreground'>Total Value</p>
                    <p className='text-3xl font-bold'>${wallet.totalValue.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}</p>
                    <p className='text-sm text-green-500 font-medium'>+${(wallet.totalValue * (wallet.pnl_24h/100)).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (+{wallet.pnl_24h}%) today</p>
                </div>

                 <Card className="bg-destructive/10 border-destructive/50">
                    <CardHeader>
                        <CardTitle className="flex items-center text-lg text-destructive">
                            <AlertTriangle className="h-5 w-5 mr-2" />
                            Risk Warning
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-destructive-foreground/90">
                            High whale sell pressure detected on <span className="font-bold">25%</span> of your portfolio. 3 whales sold $1.2M of SOL in the last 24h. Your portfolio has 15% exposure to SOL.
                        </p>
                        <Button variant="outline" asChild className="mt-4">
                            <Link href="/portfolio/analysis">View Impact Analysis</Link>
                        </Button>
                    </CardContent>
                </Card>

                <div>
                    <h3 className="text-lg font-semibold mb-3">Top Holdings</h3>
                    <div className="space-y-4">
                        {wallet.tokens.map(token => (
                            <div key={token.symbol}>
                                <div className='flex justify-between items-center mb-1 text-sm'>
                                    <div className='flex items-center gap-2 font-medium'>
                                        <CryptoIcon token={token.symbol} className='h-5 w-5' />
                                        <span>{token.name}</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <span>${token.value.toLocaleString()}</span>
                                        <span className='w-12 text-right text-muted-foreground'>{token.allocation}%</span>
                                    </div>
                                </div>
                                <Progress value={token.allocation} className='h-2'/>
                            </div>
                        ))}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function PortfolioPage() {
  const { user, loading } = useUser();

  return (
    <div className="relative">
      {!user && !loading && <FeatureLock />}
      <div className="space-y-8">
        <PageHeader
          title="My Portfolio"
          description="See how whale activity impacts your holdings."
        />

        {user && (
          <div className="space-y-8 max-w-2xl mx-auto">
            {mockConnectedWallets.length === 0 ? (
                <div className='max-w-md mx-auto'>
                    <ConnectWalletCard />
                </div>
            ) : (
              <div>
                {mockConnectedWallets.map(wallet => <ConnectedWalletCard key={wallet.address} wallet={wallet} />)}
              </div>
            )}
          </div>
        )}
        
        {loading && (
            <div className='max-w-md mx-auto'>
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
        )}

      </div>
    </div>
  );
}
