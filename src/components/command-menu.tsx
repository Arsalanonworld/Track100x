
'use client';

import * as React from 'react';
import {
  Search,
  Rss,
  Eye,
  Settings,
  Bell,
  Wallet,
  Bitcoin,
} from 'lucide-react';
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


const searchPlaceholders = [
  'Search wallets, tokens...',
  'e.g. 0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae',
  'e.g. ETH, WIF, PEPE',
  'Find the next 100x opportunity...',
];


export function CommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();
  const [isClient, setIsClient] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState(searchPlaceholders[0]);

  // Set isClient to true only on the client side
  React.useEffect(() => {
    setIsClient(true);
  }, []);

  // Typing animation effect
  React.useEffect(() => {
    if (!isClient || open) return;

    let currentPlaceholderIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let timeoutId: NodeJS.Timeout;

    const type = () => {
      const fullText = searchPlaceholders[currentPlaceholderIndex];
      
      if (isDeleting) {
        currentText = fullText.substring(0, currentText.length - 1);
      } else {
        currentText = fullText.substring(0, currentText.length + 1);
      }

      setPlaceholder(currentText);

      let typingSpeed = isDeleting ? 50 : 100;

      if (!isDeleting && currentText === fullText) {
        // Pause at end of word
        typingSpeed = 2000;
        isDeleting = true;
      } else if (isDeleting && currentText === '') {
        isDeleting = false;
        currentPlaceholderIndex = (currentPlaceholderIndex + 1) % searchPlaceholders.length;
        typingSpeed = 500; // Pause before typing new word
      }
      
      timeoutId = setTimeout(type, typingSpeed);
    };

    timeoutId = setTimeout(type, 1000);

    return () => clearTimeout(timeoutId);
  }, [isClient, open]);

  
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
