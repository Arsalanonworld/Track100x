
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase";

export function MainNav() {
    const pathname = usePathname();
    const { user } = useUser();
    const [isClient, setIsClient] = React.useState(false);

    React.useEffect(() => {
        setIsClient(true);
    }, []);

    const publicItems = [
        { href: '/#features', label: 'Features', visible: true },
        { href: '/#pricing', label: 'Pricing', visible: true },
    ];

    const privateItems = [
        { href: '/feed', label: 'Whale Feed', visible: true },
        { href: '/leaderboard', label: 'Explore', visible: true },
        { href: '/watchlist', label: 'My Watchlist', visible: true },
    ];
    
    const navItems = !user ? publicItems : privateItems;
    const visibleItems = navItems.filter(item => item.visible);

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {isClient && visibleItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "transition-colors hover:text-foreground",
                    (pathname.startsWith(item.href) && !item.href.includes('#')) || (pathname === '/' && item.href.includes('#')) ? "text-foreground" : "text-foreground/60"
                )}
            >
                {item.label}
            </Link>
        ))}
    </nav>
  )
}
