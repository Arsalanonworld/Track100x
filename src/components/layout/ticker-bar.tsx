
'use client';
import { cn } from '@/lib/utils';
import { Triangle } from 'lucide-react';
import React, { useState, useEffect } from 'react';

type TickerItemData = {
  symbol: string;
  price: string;
  change: number;
};

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

    useEffect(() => {
        // In a real app, you would fetch this data from an API.
        // For now, we simulate a loading state and then show nothing,
        // as the API is not yet integrated.
        const timer = setTimeout(() => {
            // e.g., fetch('/api/ticker').then(res => res.json()).then(setData);
            setLoading(false);
            // We set empty data because we don't have mock data anymore.
            setData([]); 
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    const extendedData = data.length > 0 ? [...data, ...data] : [];

    if (loading) {
      return (
         <div className="relative w-full overflow-hidden bg-muted/50 border-b h-10 flex items-center">
            <p className='text-xs text-muted-foreground px-4 animate-pulse'>Fetching market data...</p>
         </div>
      )
    }

    if (data.length === 0) {
      // Don't render the bar if there's no data to show.
      return null;
    }

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
