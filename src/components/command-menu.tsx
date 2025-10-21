
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


const searchPlaceholders = [
  'Search for wallets...',
  'Search for tokens...',
  'e.g. 0xde0b2...',
  'e.g. WIF, ETH, SOL',
  'Navigate to your portfolio...',
];


export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  const [placeholder, setPlaceholder] = React.useState(searchPlaceholders[0]);
  const placeholderIndex = React.useRef(0);
  const isDeleting = React.useRef(false);
  const timeoutRef = React.useRef<NodeJS.Timeout | null>(null);

  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

   React.useEffect(() => {
    if (!isClient) return;
    
    const handleTyping = () => {
      const currentPhrase = searchPlaceholders[placeholderIndex.current];
      
      let newText;
      if (isDeleting.current) {
        newText = placeholder.substring(0, placeholder.length - 1);
      } else {
        newText = currentPhrase.substring(0, placeholder.length + 1);
      }
      setPlaceholder(newText);
      
      let delay = isDeleting.current ? 50 : 100;

      if (!isDeleting.current && newText === currentPhrase) {
        delay = 2000; // Pause at the end of the phrase
        isDeleting.current = true;
      } else if (isDeleting.current && newText === '') {
        isDeleting.current = false;
        placeholderIndex.current = (placeholderIndex.current + 1) % searchPlaceholders.length;
        delay = 500; // Pause before typing new phrase
      }
      
      timeoutRef.current = setTimeout(handleTyping, delay);
    };

    if (!open) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(handleTyping, 1000);
    } else {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [placeholder, open, isClient]);


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
          <span className='flex-1 text-left whitespace-nowrap overflow-hidden'>
            {!open && isClient ? (
              <>
                {placeholder}
                <span className="animate-blinking-cursor w-px h-4 ml-0.5 bg-foreground inline-block" />
              </>
            ) : (
                'Search...'
            )}
          </span>
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
                         onSelect={() => runCommand(() => {})}
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
