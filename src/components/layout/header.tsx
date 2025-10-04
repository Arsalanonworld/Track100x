import { MainNav } from "@/components/layout/main-nav";
import { UserNav } from "@/components/user-nav";
import Link from "next/link";

const WhaleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8 text-primary">
      <path d="M16.963 10.037c.781-1.25.625-2.852-.39-3.867l-1.07-1.07c-1.562-1.562-4.095-1.562-5.657 0L8.778 6.17c-1.562 1.562-1.562 4.095 0 5.657l1.07 1.07c1.015 1.015 2.617 1.172 3.867.39l.781 1.25a.75.75 0 001.272-.79l-.782-1.251.002-.002zm-1.13 2.139a.75.75 0 01-1.06 0l-1.07-1.07a2.501 2.501 0 010-3.536l1.068-1.068a2.5 2.5 0 013.536 0l1.07 1.07c.976.976.976 2.56 0 3.535l-1.07 1.07a.75.T5 0 01-1.06 0l-.53-.53-.53.53zM12 18a.75.75 0 01-.75-.75V15a.75.75 0 011.5 0v2.25A.75.75 0 0112 18zM9.062 14.938a.75.75 0 01-1.06-1.06l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5zM14.938 14.938a.75.75 0 11-1.06-1.06l1.5-1.5a.75.75 0 011.06 1.06l-1.5 1.5z" />
    </svg>
  );


export default function Header() {
    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background">
            <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
                <div className="flex gap-6 md:gap-10">
                    <Link href="/" className="flex items-center space-x-2">
                        <WhaleIcon />
                        <span className="inline-block font-bold font-headline text-xl">WhaleWatch</span>
                    </Link>
                    <MainNav />
                </div>

                <div className="flex flex-1 items-center justify-end space-x-4">
                    <nav className="flex items-center space-x-1">
                        <UserNav />
                    </nav>
                </div>
            </div>
        </header>
    )
}
