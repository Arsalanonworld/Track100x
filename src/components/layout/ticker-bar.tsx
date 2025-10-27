
'use client';
import { cn } from '@/lib/utils';
import { Triangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type TickerItemData = {
  symbol: string;
  price: string;
  change: number;
};

const mockTickerData: TickerItemData[] = [
    { symbol: 'BTC', price: '68,450.21', change: 1.25 },
    { symbol: 'ETH', price: '3,550.73', change: -0.52 },
    { symbol: 'SOL', price: '168.99', change: 2.78 },
    { symbol: 'WIF', price: '2.88', change: -5.14 },
    { symbol: 'PEPE', price: '0.00001156', change: 8.45 },
    { symbol: 'BONK', price: '0.00002812', change: 3.21 },
    { symbol: 'DOGE', price: '0.1589', change: 0.15 },
    { symbol: 'SHIB', price: '0.00002178', change: -1.99 },
];

const TickerItem = ({ item }: { item: TickerItemData }) => {
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
    const [data, setData] = useState<TickerItemData[]>([]);
    const [loading, setLoading] = useState(true);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
        // In a real app, you would fetch this data from an API.
        const timer = setTimeout(() => {
            setLoading(false);
            setData(mockTickerData); 
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    // Double the data for a seamless loop
    const extendedData = data.length > 0 ? [...data, ...data, ...data, ...data] : [];

    if (!isClient || loading) {
      return (
         <div className="fixed top-14 lg:top-16 z-20 w-full overflow-hidden bg-muted/50 border-b h-10 flex items-center">
            <p className='text-xs text-muted-foreground px-4 animate-pulse'>Fetching market data...</p>
         </div>
      )
    }

    if (data.length === 0) {
      // Don't render the bar if there's no data to show.
      return null;
    }

  return (
    <div className="fixed top-14 lg:top-16 z-20 w-full overflow-hidden bg-muted/50 border-b h-10 group">
      <div className="absolute top-0 left-0 h-full flex items-center animate-scroll group-hover:pause">
        {extendedData.map((item, index) => (
          <React.Fragment key={index}>
            <TickerItem item={item} />
            <div className="w-px h-4 bg-border/50 shrink-0" />
          </React.Fragment>
        ))}
      </div>
      <style jsx>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 60s linear infinite;
        }
        .pause {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};
