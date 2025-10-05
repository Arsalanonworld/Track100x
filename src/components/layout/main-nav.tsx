
'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/insights', label: 'Insights' },
];

export function MainNav() {
    const pathname = usePathname()

  return (
    <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
        <div className="flex items-center space-x-4">
            {navItems.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        pathname === item.href ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </div>
    </nav>
  )
}
