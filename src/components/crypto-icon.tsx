import React from 'react';
import { cn } from '@/lib/utils';

type CryptoIconProps = {
  token: 'BTC' | 'ETH' | 'SOL' | string;
  className?: string;
};

export const CryptoIcon = ({ token, className }: CryptoIconProps) => {
  const iconProps = {
    className: cn('h-6 w-6', className),
  };

  switch (token.toUpperCase()) {
    case 'BTC':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#F7931A" />
          <path
            d="M8.5 14.5H10.5V16.5H8.5V14.5ZM8.5 7.5H10.5V9.5H8.5V7.5ZM11.5 7.5H13.5V9.5H11.5V7.5ZM11.5 14.5H13.5V16.5H11.5V14.5ZM14.5 9.5H11.5V11.5H14.5C15.6046 11.5 16.5 10.6046 16.5 9.5C16.5 8.39543 15.6046 7.5 14.5 7.5H11.5V6.5H14.5C16.1569 6.5 17.5 7.84315 17.5 9.5C17.5 11.1569 16.1569 12.5 14.5 12.5H11.5V14.5H14.5C16.1569 14.5 17.5 15.8431 17.5 17.5C17.5 19.1569 16.1569 20.5 14.5 20.5H11.5V17.5H14.5C15.6046 17.5 16.5 16.6046 16.5 15.5C16.5 14.3954 15.6046 13.5 14.5 13.5H11.5V12.5H14.5"
            stroke="white"
            strokeWidth="1.5"
          />
        </svg>
      );
    case 'ETH':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="#627EEA" />
          <path d="M12 3.5L11.93 11.5L16.5 14L12 3.5Z" fill="white" fillOpacity="0.6"/>
          <path d="M12 3.5L7.5 14L12 11.5L12 3.5Z" fill="white"/>
          <path d="M12 20.5V16L16.5 14.5L12 20.5Z" fill="white" fillOpacity="0.6"/>
          <path d="M12 20.5L7.5 14.5L12 16L12 20.5Z" fill="white"/>
          <path d="M16.5 14L12 11.5L7.5 14L12 16L16.5 14Z" fill="white" fillOpacity="0.2"/>
        </svg>
      );
    case 'SOL':
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" fill="url(#solana-gradient)" />
            <defs>
                <linearGradient id="solana-gradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#9945FF"/>
                <stop offset="100%" stopColor="#14F195"/>
                </linearGradient>
            </defs>
            <path d="M7 9.5H17V8H7V9.5ZM7 16H17V14.5H7V16ZM7 12.75H14.5V11.25H7V12.75Z" fill="white"/>
        </svg>
      );
    default:
      return (
        <svg {...iconProps} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="10" fill="hsl(var(--muted))" />
          <text x="12" y="16" textAnchor="middle" fontSize="12" fill="hsl(var(--muted-foreground))">?</text>
        </svg>
      );
  }
};
