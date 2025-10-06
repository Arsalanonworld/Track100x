
import React from 'react';
import { cn } from '@/lib/utils';

type CryptoIconProps = {
  token: 'BTC' | 'ETH' | 'SOL' | 'USDT' | 'USDC' | 'WIF' | string | undefined;
  className?: string;
};

export const CryptoIcon = ({ token, className }: CryptoIconProps) => {
  const iconProps = {
    className: cn('h-8 w-8 rounded-full', className),
  };
  
  if (!token || typeof token !== 'string') {
    return (
        <div className={cn("h-8 w-8 rounded-full bg-muted flex items-center justify-center", className)}>
            <span className="text-xs font-bold text-muted-foreground">?</span>
        </div>
      );
  }

  switch (token.toUpperCase()) {
    case 'BTC':
      return (
        <img src="https://cryptologos.cc/logos/bitcoin-btc-logo.svg?v=032" alt="BTC" {...iconProps} />
      );
    case 'ETH':
      return (
        <img src="https://cryptologos.cc/logos/ethereum-eth-logo.svg?v=032" alt="ETH" {...iconProps} />
      );
    case 'SOL':
       return (
        <img src="https://cryptologos.cc/logos/solana-sol-logo.svg?v=032" alt="SOL" {...iconProps} />
      );
    case 'USDT':
        return (
         <img src="https://cryptologos.cc/logos/tether-usdt-logo.svg?v=032" alt="USDT" {...iconProps} />
       );
    case 'USDC':
        return (
         <img src="https://cryptologos.cc/logos/usd-coin-usdc-logo.svg?v=032" alt="USDC" {...iconProps} />
       );
    case 'WIF':
        return (
         <img src="https://assets.coingecko.com/coins/images/34041/standard/wif.jpg?1715065403" alt="WIF" {...iconProps} />
       );
    default:
      return (
        <div className={cn("h-8 w-8 rounded-full bg-muted flex items-center justify-center", className)}>
            <span className="text-xs font-bold text-muted-foreground">{token.slice(0,3).toUpperCase()}</span>
        </div>
      );
  }
};
