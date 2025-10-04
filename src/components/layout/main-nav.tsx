'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Zap, LayoutGrid, Bell, BarChart, FileText, Newspaper } from "lucide-react"

const navItems = [
    { href: '/leaderboard', label: 'Leaderboard', icon: BarChart },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/news', label: 'News', icon: Newspaper },
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
                    "flex items-center gap-2 transition-colors hover:text-foreground/80",
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
                "flex items-center gap-2 transition-colors text-primary font-semibold hover:text-primary/80",
            )}
        >
            <Zap className="h-4 w-4" />
            Upgrade
        </Link>
    </nav>
  )
}
