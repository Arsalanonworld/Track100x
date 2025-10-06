
'use client';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { FeatureLock } from '@/components/feature-lock';
import { useUser } from '@/firebase';
import { Wallet, Plus } from 'lucide-react';

// Mock data for connected wallets - we'll keep it empty for now to show the "Connect" card
const connectedWallets: any[] = [];

export default function PortfolioPage() {
  const { user, loading } = useUser();

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

  return (
    <div className="relative">
      {!user && !loading && <FeatureLock />}
      <div className="space-y-8">
        <PageHeader
          title="My Portfolio"
          description="Track your assets and see how whale activity impacts your holdings."
        />

        {user && (
          <div className="space-y-8">
            {connectedWallets.length === 0 ? (
                <div className='max-w-md mx-auto'>
                    <ConnectWalletCard />
                </div>
            ) : (
              <div>
                <p>Portfolio dashboard will be built here.</p>
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
