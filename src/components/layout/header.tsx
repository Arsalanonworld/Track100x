
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
import type { NavItem } from "@/lib/types";
import { CommandMenu } from "../command-menu";
import { Button } from "../ui/button";

const publicNavItems: NavItem[] = [
    { href: '/#features', label: 'Features' },
    { href: '/#pricing', label: 'Pricing' },
];

const privateNavItems: NavItem[] = [
    // This is handled by the sidebar now, but we keep the array for the mobile nav
    { href: '/feed', label: 'Whale Feed' },
    { href: '/leaderboard', label: 'Explore' },
    { href: '/watchlist', label: 'Watchlist' },
    { href: '/alerts', label: 'Alerts' },
];


function LogoIcon() {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6"
    >
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
    </svg>
  );
}

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
                        // Special logic for hash links on the homepage
                        (pathname === '/' && item.href.includes('#')) ||
                        // Logic for other pages
                        (pathname.startsWith(item.href) && !item.href.includes('#'))
                        ? "text-foreground" : "text-foreground/60"
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
    
    // Check if we are on a page that uses the DashboardLayout.
    // This is a bit of a hack, a better solution would involve a layout context.
    const pathname = usePathname();
    const isDashboardLayout = !['/', '/upgrade', '/terms-of-service', '/privacy-policy', '/login'].includes(pathname);


    const navItems = user ? privateNavItems : publicNavItems;
    
    useEffect(() => {
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
            isDashboardLayout ? 'border-b bg-card' : '',
            scrolled && !isDashboardLayout ? "border-b bg-background/95 backdrop-blur-sm" : "",
            !isDashboardLayout ? "bg-transparent" : ""
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px]", isDashboardLayout ? "px-4" : "container")}>
                
                <div className="flex items-center gap-4">
                    {/* Show mobile nav toggle only if not in dashboard */}
                     {!isDashboardLayout && (
                        <div className="md:hidden">
                            <MobileNav items={navItems} />
                        </div>
                    )}
                    {/* Show full logo only if not in dashboard */}
                     {!isDashboardLayout && (
                        <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
                            <LogoIcon />
                            <span className="font-semibold text-lg">
                                Track100x
                            </span>
                        </Link>
                     )}
                     {/* Show command menu only in dashboard */}
                     {isDashboardLayout && (
                        <div className="w-full max-w-sm lg:max-w-md">
                            <CommandMenu />
                        </div>
                    )}
                </div>

                {/* Centered nav for public pages */}
                {!isDashboardLayout && (
                     <div className="hidden md:flex flex-1 items-center justify-center">
                        <DesktopNav items={navItems} />
                    </div>
                )}
                
                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
