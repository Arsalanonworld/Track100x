
import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import Link from "next/link";
import NotificationBell from "./notification-bell";
import { MobileNav } from "./mobile-nav";

export const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
        <path d="M12.378 1.602a.75.75 0 00-.756 0L3.34 6.324a.75.75 0 00.341 1.353l8.038-2.922a.75.75 0 01.756 0l8.038 2.922a.75.75 0 00.341-1.353L12.378 1.602z" />
        <path fillRule="evenodd" d="M12 21a.75.75 0 01-.75-.75v-8.69l-7.756-2.82a.75.75 0 01-.341-1.353L12 1.602l8.815 6.784a.75.75 0 01-.341 1.353L12.75 6.938v8.691c-.001.202-.07.39-.188.53l-4.5 5.25a.75.75 0 01-1.125 0l-4.5-5.25a.75.75 0 01-.188-.53V8.812a.75.75 0 01.94-1.303L12 10.439l7.756-2.82a.75.75 0 01.94 1.303v7.438a.75.75 0 01-.188.53l-4.5 5.25a.75.75 0 01-1.125 0l-4.5-5.25a.75.75 0 01-.188-.53v-2.37a.75.75 0 011.5 0v2.37a.75.75 0 01.188.53l4.5 5.25a.75.75 0 010 1.06l-4.5-4.5a.75.75 0 01-1.06 0l-4.5 4.5a.75.75 0 010-1.06l4.5-5.25a.75.75 0 01.53-.188h.001z" clipRule="evenodd" />
    </svg>
);


export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center">
                <MobileNav />
                <Link href="/" className="mr-6 flex items-center space-x-2">
                    <LogoIcon />
                    <span className="hidden font-bold sm:inline-block">Tack100x</span>
                </Link>
                <MainNav />
                <div className="flex flex-1 items-center justify-end space-x-2">
                    <NotificationBell />
                    <UserNav />
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
