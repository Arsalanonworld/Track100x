
'use client';
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";
import { useUser } from "@/firebase";

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
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="15" y1="9" x2="9" y2="15" strokeWidth="2.5" />
      <line x1="9" y1="9" x2="15" y2="15" strokeWidth="2.5" />
    </svg>
);


export default function Header() {
    const { user, claims } = useUser();

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center justify-between">
                <div className="flex items-center">
                    <MobileNav />
                     <Link href="/" className="mr-6 flex items-center space-x-2">
                        <LogoIcon />
                        <span className="font-bold inline-block">Track100x</span>
                    </Link>
                    <MainNav />
                </div>

                <div className="flex items-center space-x-2">
                    {user && <NotificationBell />}
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
