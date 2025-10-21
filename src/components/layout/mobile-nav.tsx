
'use client'

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Rss, Trophy, LayoutDashboard, Compass, Eye, Star, Sparkles, Bell, Wallet, BarChart3, Settings } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

function LogoIcon() {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24"
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

const mainNavItems = [
    { href: '/feed', label: 'Whale Feed', icon: Rss },
    { href: '/leaderboard', label: 'Explore', icon: Compass },
    { href: '/watchlist', label: 'Watchlist', icon: Eye },
    { href: '/alerts', label: 'Alerts', icon: Bell },
    { href: '/portfolio', label: 'Portfolio', icon: Wallet },
];

const accountNavItems = [
    { href: '/account', label: 'My Account', icon: Settings },
    { href: '/upgrade', label: 'Upgrade to Pro', icon: Star, pro: true },
]


export function MobileNav() {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0 flex flex-col">
        <SheetHeader className="p-6 text-left border-b">
            <SheetTitle asChild>
                <MobileLink
                    href="/"
                    className="flex items-center"
                    onOpenChange={setOpen}
                    >
                    <LogoIcon />
                    <span className="ml-2 font-bold">Track100x</span>
                </MobileLink>
            </SheetTitle>
        </SheetHeader>
        <div className="flex flex-col gap-4 pl-6 mt-4 text-lg font-medium flex-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon || Star;
            return (
              <MobileLink
                key={item.href}
                href={item.href}
                onOpenChange={setOpen}
                className="flex items-center gap-3"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </MobileLink>
            );
          })}
        </div>
         <div className="flex flex-col gap-4 pl-6 py-4 text-lg font-medium border-t">
          {accountNavItems.map((item) => {
            const Icon = item.icon || Star;
            return (
              <MobileLink
                key={item.href}
                href={item.href}
                onOpenChange={setOpen}
                className="flex items-center gap-3"
              >
                <Icon className="h-5 w-5 text-muted-foreground" />
                {item.label}
              </MobileLink>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}

interface MobileLinkProps extends LinkProps {
  onOpenChange?: (open: boolean) => void
  children: React.ReactNode
  className?: string
}

function MobileLink({
  href,
  onOpenChange,
  className,
  children,
  ...props
}: MobileLinkProps) {
  const router = useRouter()
  return (
    <Link
      href={href}
      onClick={() => {
        if (href.toString().startsWith('/#')) {
            const id = href.toString().substring(2);
            document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
        } else {
            router.push(href.toString());
        }
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
