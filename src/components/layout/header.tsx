
'use client';
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { LogoIcon } from "./sidebar";
import type { NavItem } from "@/lib/types";

const publicNavItems: NavItem[] = [
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
];

const privateNavItems: NavItem[] = [
    { href: '/feed', label: 'Whale Feed' },
    { href: '/leaderboard', label: 'Explore' },
    { href: '/watchlist', label: 'My Watchlist' },
    { href: '/alerts', label: 'Alerts' },
];

function DesktopNav({ items }: { items: NavItem[] }) {
    const pathname = usePathname();
    return (
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {items.map((item) => (
                <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                        "transition-colors hover:text-foreground",
                        (pathname.startsWith(item.href) && item.href !== '/') || (pathname === '/' && item.href === '/') ? "text-foreground" : "text-foreground/60"
                    )}
                >
                    {item.label}
                </Link>
            ))}
        </nav>
    );
}

export default function Header() {
    const { user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [isClient, setIsClient] = useState(false);

    const navItems = user ? privateNavItems : publicNavItems;

    useEffect(() => {
        setIsClient(true);
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10;
            if (isScrolled !== scrolled) {
                setScrolled(isScrolled);
            }
        };

        document.addEventListener('scroll', handleScroll);
        return () => {
            document.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            scrolled ? "border-b bg-background/95 backdrop-blur-sm" : "bg-transparent"
        )}>
            <div className="container flex h-16 items-center">
                <div className="md:hidden">
                    <MobileNav items={navItems} />
                </div>
                 <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
                    <LogoIcon />
                    <span className="font-semibold text-lg">
                        Track100x
                    </span>
                </Link>
                
                <div className="hidden md:flex flex-1 items-center justify-center">
                     <DesktopNav items={navItems} />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                    {isClient && user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
