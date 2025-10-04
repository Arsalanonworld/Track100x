'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Zap, Bell, BarChart, FileText, Star } from "lucide-react"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart },
    { href: '/watchlist', label: 'Watchlist', icon: Star },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/insights', label: 'Insights', icon: FileText },
  ];

export function MainNav() {
    const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        {navItems.map((item) => (
            <Link
                key={item.href}
                href={item.href}
                className={cn(
                    "flex items-center gap-2 transition-colors hover:text-foreground",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
            >
                <item.icon className="h-4 w-4" />
                {item.label}
            </Link>
        ))}
         <Link
            href="/upgrade"
            className={cn(
                "flex items-center gap-2 transition-colors text-primary font-semibold hover:text-primary/90",
            )}
        >
            <Zap className="h-4 w-4" />
            Upgrade
        </Link>
    </nav>
  )
}
