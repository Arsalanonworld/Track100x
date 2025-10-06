
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import WalletAnalyticsDashboard from '@/components/wallet-analytics-dashboard';
import { FeatureLock } from '@/components/feature-lock';
import { useUser } from '@/firebase';


const ConnectWalletCard = ({ onConnect }: { onConnect: (address: string) => void }) => {
    return (
        <Card className="max-w-2xl mx-auto mt-12 text-center">
            <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Get a detailed breakdown of your portfolio holdings and activity by connecting your wallet.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={() => onConnect('0x1a2b3c4d5e6f7g8h9i0j1k213m4n5o6p7q8r9s0t')} className="w-full">
                    Connect Wallet
                </Button>
                 <p className="text-xs text-muted-foreground mt-2">This is a demo. We will use a sample wallet.</p>
            </CardContent>
        </Card>
    );
};


export default function PortfolioPage() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const { user, loading } = useUser();

  const handleDisconnect = () => {
      setConnectedWallet(null);
  }

  if(loading) return null;

  return (
    <div className="relative">
      {!user && <FeatureLock />}
      <div className="space-y-8">
          <PageHeader
          title="My Portfolio"
          description="Your personal on-chain dashboard. Analyze your holdings, track performance, and manage assets."
          />
          
          {!connectedWallet ? (
              <ConnectWalletCard onConnect={setConnectedWallet} />
          ) : (
            <WalletAnalyticsDashboard walletAddress={connectedWallet} onDisconnect={handleDisconnect} />
          )}
      </div>
    </div>
  );
}
