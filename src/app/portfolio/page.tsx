
'use client';

import { useState } from 'react';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

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

export default function PortfolioPage() {
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
           <p>Showing results for {analyzedAddress}</p>
        )}
    </div>
  );
}

    