
import React from 'react';
import { cn } from '@/lib/utils';

export const WhaleIcon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={cn('lucide lucide-whale', className)}
  >
    <path d="M17.28 9.22a4 4 0 0 0-5.76 5.56" />
    <path d="M16 11.37a4 4 0 0 1-5.5-5.5" />
    <path d="M4 14a1 1 0 0 0-1 1v3.83a1 1 0 0 0 .26.67l1.43 1.43c.2.2.45.3.7.3H18.3a1 1 0 0 0 .7-.3l1.43-1.43a1 1 0 0 0 .26-.67V15a1 1 0 0 0-1-1" />
    <path d="M4.27 14.27C2.43 12.43 2.5 9.5 4.5 7.5s5-2 7 .5" />
    <path d="m10 17 3.5-3.5" />
    <path d="M18.5 21a2.5 2.5 0 0 1-4.82-1.4" />
    <path d="M15 15.5a1.5 1.5 0 0 1-3 0" />
  </svg>
);
