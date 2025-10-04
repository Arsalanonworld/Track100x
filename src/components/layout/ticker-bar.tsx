'use client';
import { cn } from '@/lib/utils';
import { Triangle } from 'lucide-react';
import React from 'react';

const mockTickerData = [
  { symbol: 'BTC', price: '68,500.00', change: 3.45, dir: 'up' },
  { symbol: 'ETH', price: '3,550.00', change: 5.7, dir: 'up' },
  { symbol: 'XRP', price: '0.48', change: -12.32, dir: 'down' },
  { symbol: 'USDT', price: '1.00', change: -0.02, dir: 'down' },
  { symbol: 'BNB', price: '580.00', change: 3.02, dir: 'up' },
  { symbol: 'USDC', price: '1.00', change: 0.0, dir: 'down' },
  { symbol: 'SOL', price: '150.25', change: 8.12, dir: 'up' },
  { symbol: 'ADA', price: '0.45', change: -1.5, dir: 'down' },
  { symbol: 'DOGE', price: '0.15', change: 2.5, dir: 'up' },
];

const TickerItem = ({ item }: { item: typeof mockTickerData[0] }) => {
    const isUp = item.change >= 0;
    const isDown = item.change < 0;
  
    return (
      <div className="flex items-center gap-3 shrink-0 px-4">
        <span className="font-semibold text-sm">{item.symbol}</span>
        <span className="font-mono text-sm">${item.price}</span>
        <div
          className={cn(
            'flex items-center text-sm',
            isUp && 'text-green-600 dark:text-green-500',
            isDown && 'text-red-600 dark:text-red-500'
          )}
        >
          {isUp ? <Triangle className="h-3 w-3 fill-current"/> : <Triangle className="h-3 w-3 fill-current rotate-180"/>}
          <span className="ml-1">{Math.abs(item.change)}%</span>
        </div>
      </div>
    );
  };
  

export const TickerBar = () => {
    const extendedData = [...mockTickerData, ...mockTickerData];
  return (
    <div className="relative w-full overflow-hidden bg-muted/50 border-b h-10">
      <div className="absolute top-0 left-0 h-full flex items-center animate-scroll">
        {extendedData.map((item, index) => (
          <TickerItem key={index} item={item} />
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
        }
      `}</style>
    </div>
  );
};
