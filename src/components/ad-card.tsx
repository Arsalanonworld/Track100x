
'use client';
import Link from 'next/link';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export const AdCard = () => {
    return (
        <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700 text-primary-foreground relative overflow-hidden">
            <CardContent className="p-4 flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-full sm:w-48 h-24 sm:h-full rounded-lg overflow-hidden shrink-0">
                     <Image 
                        src="https://images.unsplash.com/photo-1641427237307-8e5e825a17a8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                        alt="Hardware wallet ad"
                        fill
                        className="object-cover"
                        data-ai-hint="hardware wallet"
                     />
                     <div className="absolute inset-0 bg-black/40"></div>
                </div>

                <div className='flex-1 text-center sm:text-left'>
                    <p className="text-xs font-semibold uppercase text-primary tracking-wider">Sponsored</p>
                    <h3 className="text-lg font-bold mt-1">Secure Your Crypto Offline</h3>
                    <p className="text-sm text-zinc-300 mt-1 max-w-lg">
                        Don't risk your assets on exchanges. A hardware wallet is the safest way to store your crypto.
                    </p>
                </div>
                <div className="shrink-0 mt-2 sm:mt-0">
                    <Button asChild variant="secondary" size="sm">
                        <Link href="https://www.ledger.com/" target="_blank" rel="noopener noreferrer">
                            Shop Ledger Now
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

    