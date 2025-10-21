
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
  Command,
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
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';

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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-start rounded-full bg-muted text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4 shrink-0" />
          <span className='flex-1 text-left'>Search...</span>
           <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
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
                        value={`Wallet ${wallet.address}`}
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
                        value={`Token ${token.name} ${token.symbol}`}
                    >
                        <CryptoIcon token={token.symbol} className="mr-2 h-4 w-4" />
                        <span>{token.name}</span>
                        <span className="text-muted-foreground ml-2">{token.symbol}</span>
                    </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
