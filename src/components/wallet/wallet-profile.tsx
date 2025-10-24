
'use client';

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
import { Zap } from 'lucide-react';
import { whaleTransactions, type LeaderboardWallet } from '@/lib/mock-data';
import { WatchlistButton } from '@/components/track-button';
import { AlertEditorDialog } from '@/components/alert-editor-dialog';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { CryptoIcon } from '@/components/crypto-icon';
import React from 'react';
import TransactionCard from '@/components/transaction-card';


type WalletData = {
    address: string,
    transactions: typeof whaleTransactions,
    portfolio: {
        netWorth: number;
        history: { name: string; value: number }[];
        allocations: { name: string; value: number; color: string }[];
        topHoldings: ({ token: string; amount: string; value: string })[];
    } | null;
}

const StatCard = ({ title, value, icon, valueClassName }: { title: string, value: string | React.ReactNode, icon: React.ReactNode, valueClassName?: string }) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
            </CardHeader>
            <CardContent>
                <div className={cn("text-2xl font-bold", valueClassName)}>
                    {value}
                </div>
            </CardContent>
        </Card>
    )
};


export function WalletProfile({ walletData }: { walletData: WalletData }) {
  if (!walletData) {
    notFound();
  }

  const { address, portfolio, transactions } = walletData;


  return (
    <div className="space-y-8">
      <PageHeader
        title="Wallet Profile"
        description={<span className="font-mono break-all">{address}</span>}
        action={
          <div className="flex items-center gap-2 mt-4 sm:mt-0">
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
      ) : (
        <Card className='text-center p-8 border-dashed border-2'>
            <CardTitle>Analytics Unavailable</CardTitle>
            <CardDescription>This wallet is not currently on the leaderboard. Add it to your watchlist to monitor its activity.</CardDescription>
        </Card>
      )}


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
