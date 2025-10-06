'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useUser } from "@/firebase";

export function MainNav() {
    const pathname = usePathname();
    const { user } = useUser();

    const navItems = [
        { href: '/leaderboard', label: 'Leaderboard', visible: true },
        { href: '/watchlist', label: 'Watchlist', visible: !!user },
        { href: '/alerts', label: 'Alerts', visible: true },
        { href: '/insights', label: 'Insights', visible: true },
    ];
    
    const visibleItems = navItems.filter(item => item.visible);

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <div className="flex items-center space-x-4">
            {visibleItems.map((item) => (
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
        </div>
    </nav>
  )
}
