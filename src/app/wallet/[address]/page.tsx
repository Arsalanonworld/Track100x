

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { whaleTransactions } from '@/lib/mock-data';
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
    // Leaderboard data is removed, so we only get transactions.
    const transactions = whaleTransactions.filter(tx => tx.from.toLowerCase() === address.toLowerCase() || tx.to.toLowerCase() === address.toLowerCase());
    
    // In a real app, you'd fetch wallet-specific analytics here.
    // For now, portfolio is null as it depended on leaderboard data.
    return { address, transactions, portfolio: null };
};


export default function WalletPage({ params }: WalletPageProps) {
  const walletData = getWalletData(params.address);

  if (!walletData) {
    notFound();
  }

  return <WalletProfile walletData={walletData} />;
}
