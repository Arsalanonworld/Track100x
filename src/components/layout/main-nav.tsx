
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function MainNav() {
    const pathname = usePathname();

    const navItems = [
        { href: '/feed', label: 'Whale Feed' },
        { href: '/leaderboard', label: 'Explore' },
        { href: '/watchlist', label: 'Watchlist' },
        { href: '/portfolio', label: 'Portfolio' },
    ];

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "transition-colors hover:text-foreground",
                    pathname.startsWith(item.href) ? "text-foreground" : "text-foreground/60"
                )}
            >
                {item.label}
            </Link>
        ))}
    </nav>
  )
}
