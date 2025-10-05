
'use client';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function TopPlayersHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#2E2E2E] to-[#1A1A1A] flex flex-col items-center justify-center min-h-[200px] text-white">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-repeat opacity-10 [mask-image:linear-gradient(to_bottom,white_15%,transparent_90%)]"></div>
        <div className="container mx-auto px-4 text-center relative">
            <h1 className="text-3xl font-bold tracking-tight">
                Top Players in Crypto – Wallets & Traders
            </h1>
            <p className="max-w-2xl mx-auto mt-2 text-base text-gray-400">
                Track the biggest movers and shakers in real-time. Set alerts to stay ahead!
            </p>
            <div className="mt-6">
                <Button asChild>
                    <Link href="/alerts">Set Alert</Link>
                </Button>
            </div>
        </div>
    </section>
  );
}
