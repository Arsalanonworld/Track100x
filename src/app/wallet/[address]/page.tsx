

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { leaderboardData, whaleTransactions } from '@/lib/mock-data';
import { WalletProfile } from '@/components/wallet/wallet-profile';


type WalletPageProps = {
  params: {
    address: string;
  };
};

// This function now correctly runs on the server.
export async function generateMetadata({ params }: WalletPageProps): Promise<Metadata> {
  const address = params.address;
  const shortAddress = `${address.slice(0, 6)}...${address.slice(-4)}`;
  return {
    title: `Wallet Profile: ${shortAddress} | Track100x`,
    description: `On-chain analytics and transaction history for wallet ${address}.`,
  };
}

// Find wallet data from mock data
const getWalletData = (address: string) => {
    const wallet = leaderboardData.find(w => w.address.toLowerCase() === address.toLowerCase());
    const transactions = whaleTransactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase() || tx.to.toLowerCase() === address.toLowerCase());
    
    // Create some mock portfolio data based on the wallet
    if (wallet) {
        const currentNetWorth = parseFloat(wallet.netWorth.replace('$', '').replace('M', '')) * 1000000;
        // Correctly calculate past value from PnL: PastValue = CurrentValue / (1 + PnL)
        const pastNetWorth = currentNetWorth / (1 + wallet.pnl7d / 100);

        return {
            ...wallet,
            transactions,
            portfolio: {
                netWorth: currentNetWorth,
                history: [
                    { name: '30d ago', value: pastNetWorth },
                    { name: 'Today', value: currentNetWorth },
                ],
                allocations: [
                    { name: wallet.topHolding.token, value: wallet.topHolding.percentage, color: 'hsl(var(--chart-1))' },
                    { name: 'Others', value: 100 - wallet.topHolding.percentage, color: 'hsl(var(--chart-2))' },
                ],
                topHoldings: [
                    {...wallet.topHolding, amount: '1,234.56', value: '$500,000' }
                ]
            }
        };
    }
    return { address, transactions, portfolio: null };
};


export default function WalletPage({ params }: WalletPageProps) {
  const walletData = getWalletData(params.address);

  if (!walletData) {
    notFound();
  }

  return <WalletProfile walletData={walletData} />;
}
