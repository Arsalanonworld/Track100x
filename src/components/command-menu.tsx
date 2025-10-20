
'use client';

import * as React from 'react';
import {
  Calculator,
  Calendar,
  CreditCard,
  Search,
  Settings,
  Smile,
  User,
  Wallet,
  Rss,
  Compass,
  Eye,
  File,
} from 'lucide-react';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { leaderboardData } from '@/lib/mock-data';
import { tokenLibrary } from '@/lib/tokens';
import { CryptoIcon } from './crypto-icon';

export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  const wallets = leaderboardData.slice(0, 5);
  const tokens = Object.values(tokenLibrary).slice(0, 5);

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          'relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none md:px-3 md:py-2'
        )}
        onClick={() => setOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        <span className="hidden md:inline-flex">Search...</span>
        <span className="inline-flex md:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/feed'))}>
              <Rss className="mr-2 h-4 w-4" />
              <span>Whale Feed</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/leaderboard'))}>
              <Compass className="mr-2 h-4 w-4" />
              <span>Explore</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/watchlist'))}>
              <Eye className="mr-2 h-4 w-4" />
              <span>My Watchlist</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/portfolio'))}>
              <Wallet className="mr-2 h-4 w-4" />
              <span>Portfolio</span>
            </CommandItem>
             <CommandItem onSelect={() => runCommand(() => router.push('/account'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Top Wallets">
            {wallets.map(wallet => (
              <CommandItem
                key={wallet.address}
                onSelect={() => runCommand(() => router.push(`/wallet/${wallet.address}`))}
              >
                <Wallet className="mr-2 h-4 w-4" />
                <span>{wallet.address}</span>
              </CommandItem>
            ))}
          </CommandGroup>
           <CommandSeparator />
           <CommandGroup heading="Popular Tokens">
            {tokens.map(token => (
              <CommandItem
                key={token.symbol}
                onSelect={() => runCommand(() => router.push(`/token/${token.symbol}`))}
              >
                <CryptoIcon token={token.symbol} className="mr-2 h-4 w-4" />
                <span>{token.name}</span>
                <span className="text-muted-foreground ml-2">{token.symbol}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
