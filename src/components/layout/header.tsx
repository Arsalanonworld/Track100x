import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import { Button } from "@/components/ui/button";
import { Sun } from "lucide-react";
import Link from "next/link";

export const LogoIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7 text-primary">
        <path d="M12.378 1.602a.75.75 0 00-.756 0L3.34 6.324a.75.75 0 00.341 1.353l8.038-2.922a.75.75 0 01.756 0l8.038 2.922a.75.75 0 00.341-1.353L12.378 1.602z" />
        <path fillRule="evenodd" d="M12 21a.75.75 0 01-.75-.75v-8.69l-7.756-2.82a.75.75 0 01-.341-1.353L12 1.602l8.815 6.784a.75.75 0 01-.341 1.353L12.75 6.938v8.691c-.001.202-.07.39-.188.53l-4.5 5.25a.75.75 0 01-1.125 0l-4.5-5.25a.75.75 0 01.938-1.124l4.062 4.74v-7.19l-4.756-1.73a.75.75 0 01.682-1.306L12 9.363l4.756-1.731a.75.75 0 01.682 1.306l-4.756 1.73v7.19l4.062-4.74a.75.75 0 11.937 1.125l-4.5 5.25a.75.75 0 01-.563.27z" clipRule="evenodd" />
    </svg>
  );


export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-sm">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <LogoIcon />
                        <span className="inline-block font-bold text-xl">Track100x</span>
                    </Link>
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-2">
                    <Button variant="ghost" size="icon">
                        <Sun className="h-5 w-5"/>
                        <span className="sr-only">Toggle theme</span>
                    </Button>
                    <UserNav />
                </div>
            </div>
        </header>
    )
}
