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
import { Menu } from "lucide-react";


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


export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void}) {
    const { user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    
    const pathname = usePathname();
    
    // We are now in a unified layout, so there's less need to distinguish
    const isAppPage = !['/', '/upgrade', '/login', '/terms-of-service', '/privacy-policy'].includes(pathname);
    
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
            "sticky top-0 z-50 w-full transition-all duration-300 border-b",
            scrolled ? "bg-background/95 backdrop-blur-sm" : "bg-background"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px] px-4")}>
                
                <div className="flex items-center gap-4">
                    {/* Mobile nav toggle is now the hamburger menu */}
                    <div className="md:hidden">
                       <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
                           <Menu className="h-6 w-6" />
                       </Button>
                    </div>
                     
                     {/* Show command menu only in dashboard-like pages */}
                     {isAppPage && (
                        <div className="hidden md:block w-full max-w-sm lg:max-w-md">
                            <CommandMenu />
                        </div>
                     )}
                     {!isAppPage && (
                        <Link href="/" className="flex items-center space-x-2">
                            <LogoIcon />
                            <span className="font-semibold text-lg">
                                Track100x
                            </span>
                        </Link>
                     )}
                </div>
                
                <div className="flex flex-1 items-center justify-end space-x-2 sm:space-x-4">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
