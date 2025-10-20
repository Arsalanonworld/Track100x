
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

export default function Header({ onSidebarToggle }: { onSidebarToggle: () => void}) {
    const { user } = useUser();
    const [scrolled, setScrolled] = useState(false);
    
    const pathname = usePathname();
    
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
            "sticky top-0 z-40 w-full transition-all duration-300 border-b",
            scrolled ? "bg-background/95 backdrop-blur-sm" : "bg-background"
        )}>
            <div className={cn("flex h-14 items-center lg:h-[60px] px-4")}>
                
                <div className="flex items-center gap-4">
                    {/* This button is part of the parent layout, but we need a placeholder for spacing */}
                    <div className="h-10 w-10 hidden md:block" />

                    {/* Mobile nav toggle */}
                    <div className="md:hidden">
                       <MobileNav items={[]} />
                    </div>
                     
                     {/* Show command menu only in dashboard-like pages */}
                     {isAppPage && (
                        <div className="w-full max-w-sm lg:max-w-md">
                            <CommandMenu />
                        </div>
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
