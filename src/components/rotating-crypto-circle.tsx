
'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CryptoIcon } from './crypto-icon';

const icons = [
  { symbol: 'ETH', x: '50%', y: '10%' },
  { symbol: 'USDT', x: '85%', y: '30%' },
  { symbol: 'USDC', x: '90%', y: '65%' },
  { symbol: 'WIF', x: '70%', y: '90%' },
  { symbol: 'SOL', x: '30%', y: '95%' },
  { symbol: 'JUP', x: '5%', y: '75%' },
  { symbol: 'SHIB', x: '15%', y: '35%' },
  { symbol: 'BONK', x: '35%', y: '50%' },
  { symbol: 'LDO', x: '65%', y: '45%' },
];

const Path = ({ from, to }: { from: (typeof icons)[0], to: (typeof icons)[0] }) => {
  const d = `M${from.x.replace('%', '') * 4} ${from.y.replace('%', '') * 3} Q${(from.x.replace('%', '') * 4 + to.x.replace('%', '') * 4) / 2 + Math.random() * 80 - 40} ${(from.y.replace('%', '') * 3 + to.y.replace('%', '') * 3) / 2 + Math.random() * 80 - 40} ${to.x.replace('%', '') * 4} ${to.y.replace('%', '') * 3}`;
  
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="hsl(var(--border))"
      strokeWidth="1"
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, delay: 0.5 }}
    >
      <animate
        attributeName="stroke-dashoffset"
        from="8"
        to="0"
        dur="1s"
        repeatCount="indefinite"
      />
    </motion.path>
  );
};


export const CryptoFeatureWeb = () => {
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto h-[350px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 300">
        {connections.map(([fromIndex, toIndex], i) => (
          <Path key={i} from={icons[fromIndex]} to={icons[toIndex]} />
        ))}
      </svg>
      {icons.map((icon, i) => (
        <motion.div
          key={icon.symbol}
          className="absolute"
          style={{
            left: `calc(${icon.x} - 24px)`,
            top: `calc(${icon.y} - 24px)`,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        >
          <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center shadow-md p-2">
            <CryptoIcon token={icon.symbol} className="h-8 w-8" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};
