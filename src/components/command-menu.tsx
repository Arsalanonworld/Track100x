
'use client';

import * as React from 'react';
import {
  Search,
  Rss,
  Eye,
  Settings,
  Bell,
  Briefcase,
  Building2,
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
import { mockDeals } from '@/lib/mock-deal-data';

const searchPlaceholders = [
  'Search for deals...',
  'e.g. Landscaping in Austin',
  'e.g. SaaS, E-commerce',
  'Find off-market deals...',
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

  const deals = mockDeals.slice(0, 3);

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
                    <CommandItem onSelect={() => runCommand(() => router.push('/deals'))}>
                        <Rss className="mr-2 h-4 w-4" />
                        <span>Deal Radar</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/watchlist'))}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Saved Deals</span>
                    </CommandItem>
                    <CommandItem onSelect={() => runCommand(() => router.push('/account'))}>
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                    </CommandItem>
                </CommandGroup>
                <CommandSeparator />
                <CommandGroup heading="Featured Deals">
                    {deals.map(deal => (
                    <CommandItem
                        key={deal.dealId}
                        value={`Deal ${deal.name} ${deal.industry}`}
                         onSelect={() => runCommand(() => router.push(`/deal/${deal.dealId}`))}
                    >
                        {deal.type === 'off-market' ? <Briefcase className="mr-2 h-4 w-4" /> : <Building2 className="mr-2 h-4 w-4" />}
                        <span>{deal.name}</span>
                        <span className="text-muted-foreground ml-2">{deal.industry}</span>
                    </CommandItem>
                    ))}
                </CommandGroup>
            </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
