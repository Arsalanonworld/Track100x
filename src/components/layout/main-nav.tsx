
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navItems = [
    { href: '/', label: 'Home' },
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/insights', label: 'Insights' },
    { href: '/news', label: 'News'},
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
                    "transition-colors hover:text-foreground/80",
                    pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
            >
                {item.label}
            </Link>
        ))}
    </nav>
  )
}
