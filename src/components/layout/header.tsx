
'use client';
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";
import { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";
import { CommandMenu } from "../command-menu";
import { LogoIcon } from "./sidebar";


export default function Header() {
    const { user, claims } = useUser();
    const [scrolled, setScrolled] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const pathname = usePathname();

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
                <div className="flex flex-1 items-center justify-start">
                    <div className="md:hidden">
                        <MobileNav />
                    </div>
                     <Link href="/" className="mr-6 hidden items-center space-x-2 md:flex">
                        <LogoIcon />
                        <span className="font-semibold text-lg">
                            Track100x
                        </span>
                    </Link>
                </div>
                
                <div className="hidden md:flex flex-1 items-center justify-center">
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    {isClient && user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
