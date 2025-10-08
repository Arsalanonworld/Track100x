
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
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-7 w-7 text-primary"
    >
        <path d="M12 16C12 16 10 13.5 7 13.5C4 13.5 2 16 2 16" />
        <path d="M12 16C12 16 14 13.5 17 13.5C20 13.5 22 16 22 16" />
        <path d="M12 8C12 8 10 10.5 7 10.5C4 10.5 2 8 2 8" />
        <path d="M12 8C12 8 14 10.5 17 10.5C20 10.5 22 8 22 8" />
        <path d="M12.5 13.75C12.5 13.75 13.5 12.5 15 12.5C16.5 12.5 17.5 13.75 17.5 13.75" />
        <path d="M12.5 13.75C12.5 13.75 11.5 12.5 10 12.5C8.5 12.5 7.5 13.75 7.5 13.75" />
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
