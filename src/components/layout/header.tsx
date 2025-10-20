
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
    // These are now in the sidebar, so this can be empty
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
    const [isClient, setIsClient] = useState(false);

    // If user is logged in, dashboard has its own header, so we render a simplified version
    // If not logged in, we are on a public page, so show public nav
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

    const isDashboard = !!user;

    return (
        <header className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300",
            isDashboard ? 'border-b' : '',
            scrolled && !isDashboard ? "border-b bg-background/95 backdrop-blur-sm" : "",
            !isDashboard ? "bg-transparent" : "bg-card"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px]", isDashboard ? "px-4" : "container")}>
                
                {/* Logo for public pages, search for dashboard */}
                <div className="flex items-center gap-4">
                     {!isDashboard && (
                        <>
                            <div className="md:hidden">
                                <MobileNav items={navItems} />
                            </div>
                            <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
                                <LogoIcon />
                                <span className="font-semibold text-lg">
                                    Track100x
                                </span>
                            </Link>
                        </>
                    )}
                     {isDashboard && (
                        <div className="w-full max-w-sm lg:max-w-md">
                            <CommandMenu />
                        </div>
                    )}
                </div>

                {/* Centered nav for public pages */}
                {!isDashboard && (
                     <div className="hidden md:flex flex-1 items-center justify-center">
                        <DesktopNav items={navItems} />
                    </div>
                )}
                
                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                    {isClient && user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
