
import React from 'react';
import { cn } from '@/lib/utils';
import { tokenLibrary } from '@/lib/tokens';

type CryptoIconProps = {
  token: string | undefined;
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

  const tokenInfo = tokenLibrary[token.toUpperCase()];

  if (tokenInfo?.iconUrl) {
    return (
        <img src={tokenInfo.iconUrl} alt={tokenInfo.symbol} {...iconProps} />
    )
  }

  // Fallback for tokens not in the library
  return (
    <div className={cn("h-8 w-8 rounded-full bg-muted flex items-center justify-center", className)}>
        <span className="text-xs font-bold text-muted-foreground">{token.slice(0,3).toUpperCase()}</span>
    </div>
  );
};
