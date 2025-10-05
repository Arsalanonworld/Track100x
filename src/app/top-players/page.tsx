
'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUser } from '@/firebase';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import TopWalletsTab from '@/components/top-players/top-wallets-tab';
import TopTradersTab from '@/components/top-players/top-traders-tab';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageHeader from '@/components/page-header';

export default function TopPlayersPage() {
  const { claims } = useUser();
  const isPro = claims?.plan === 'pro';

  return (
    <div className="space-y-8">
      <PageHeader
        title="Top Players"
        description="Track the biggest movers and shakers in real-time."
      />

      <div className="container">
        <Tabs defaultValue="top-wallets" className="w-full">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <TabsList className="grid grid-cols-2 w-full md:w-auto">
              <TabsTrigger value="top-wallets">Top Wallets</TabsTrigger>
              <TabsTrigger value="top-traders">Top Traders</TabsTrigger>
            </TabsList>
            <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
              <Select defaultValue="all">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Chains" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Chains</SelectItem>
                  <SelectItem value="ethereum">Ethereum</SelectItem>
                  <SelectItem value="solana">Solana</SelectItem>
                </SelectContent>
              </Select>
               <Select defaultValue="net-worth">
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="net-worth">Sort by: Net Worth</SelectItem>
                  <SelectItem value="pnl">Sort by: 7d P&L</SelectItem>
                  <SelectItem value="volume">Sort by: 7d Volume</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="top-wallets">
            <TopWalletsTab />
          </TabsContent>
          <TabsContent value="top-traders">
            <TopTradersTab isPro={isPro}/>
          </TabsContent>
        </Tabs>
      </div>
      
      <div className="bg-card border-t py-8 text-center">
          <div className="container">
            <h3 className="text-xl font-bold">Love the data?</h3>
            <p className="text-muted-foreground mt-2 mb-4">Set custom alerts or explore more on Track100x!</p>
            <div className="flex justify-center gap-4">
                <Button asChild>
                    <Link href="/alerts">Go to Alerts</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/insights">Learn More</Link>
                </Button>
            </div>
          </div>
      </div>
    </div>
  );
}
