
'use client';
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { AuthDialog } from "../auth/auth-dialog";
import { useState } from "react";

export const LogoIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-primary"
    >
      <path d="M8 3H16" />
      <path d="M12 3V9" />
      <path d="M12 15a6 6 0 1 0 0-12 6 6 0 0 0 0 12z" />
      <path d="m21 21-4.35-4.35" />
    </svg>
);


export default function Header() {
    const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <MobileNav />
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LogoIcon />
                        <span className="hidden font-bold sm:inline-block">Tack100x</span>
                    </Link>
                    <MainNav />
                </div>

                <div className="flex items-center space-x-2">
                    <NotificationBell />
                    <UserNav onLoginClick={() => setIsAuthDialogOpen(true)} />
                    <ThemeToggle />
                </div>
            </div>
             <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} />
        </header>
    );
}
