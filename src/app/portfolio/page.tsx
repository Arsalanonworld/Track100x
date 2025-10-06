
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import WalletAnalyticsDashboard from '../wallet-analytics/_components/wallet-analytics-dashboard';


const ConnectWalletCard = ({ onConnect }: { onConnect: () => void }) => {
    return (
        <Card className="max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle>Connect Your Wallet</CardTitle>
                <CardDescription>Connect your wallet to get a detailed breakdown of your portfolio holdings and activity.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={onConnect} className="w-full">
                    Connect Wallet
                </Button>
            </CardContent>
        </Card>
    );
};


export default function PortfolioPage() {
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const handleConnect = () => {
    // In a real app, this would involve a wallet connection library like wagmi or web3-modal
    // For now, we'll just set a mock address
    setConnectedWallet('0x1a2b3c4d5e6f7g8h9i0j1k213m4n5o6p7q8r9s0t');
  }

  const handleDisconnect = () => {
      setConnectedWallet(null);
  }

  return (
    <div className="space-y-8">
        <PageHeader
        title="My Portfolio"
        description="Your personal on-chain dashboard. Analyze your holdings, track performance, and manage assets."
        />
        
        {!connectedWallet ? (
            <ConnectWalletCard onConnect={handleConnect} />
        ) : (
           <WalletAnalyticsDashboard walletAddress={connectedWallet} isPortfolioView={true} onBack={handleDisconnect} />
        )}
    </div>
  );
}
