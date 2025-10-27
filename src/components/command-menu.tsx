
'use client';

import * as React from 'react';
import { Search, Rss, Eye, Settings, Bell, Wallet } from 'lucide-react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { whaleTransactions } from '@/lib/mock-data';
import { AnimatePresence, motion } from 'framer-motion';

const searchPlaceholders = [
  'wallets, tokens...',
  'e.g. 0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  'e.g. ETH, WIF, PEPE',
  'for the next 100x opportunity...',
];

const AnimatedPlaceholder = ({ placeholders }: { placeholders: string[] }) => {
  const [index, setIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [placeholders]);

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={placeholders[index]}
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{ duration: 0.3 }}
        className="absolute left-0 top-0"
      >
        {placeholders[index]}
      </motion.span>
    </AnimatePresence>
  );
};

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

  const featuredWallets = whaleTransactions.slice(0, 3);

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
          <div className="flex-1 text-left whitespace-nowrap overflow-hidden">
            <span>Search </span>
            <span className="relative inline-block w-[200px] h-4 overflow-hidden align-bottom">
                 <AnimatedPlaceholder placeholders={searchPlaceholders} />
            </span>
          </div>
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
              <CommandItem onSelect={() => runCommand(() => router.push('/watchlist'))}>
                <Eye className="mr-2 h-4 w-4" />
                <span>Watchlist</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/alerts'))}>
                <Bell className="mr-2 h-4 w-4" />
                <span>Alerts</span>
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => router.push('/account'))}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup heading="Featured Wallets">
              {featuredWallets.map(tx => (
                <CommandItem
                  key={tx.id}
                  value={`Wallet ${tx.fromShort} ${tx.from}`}
                  onSelect={() => runCommand(() => router.push(`/wallet/${tx.from}`))}
                >
                  <Wallet className="mr-2 h-4 w-4" />
                  <span>{tx.fromShort}</span>
                  <span className="text-muted-foreground ml-2 truncate">{tx.fromTags?.join(', ')}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
