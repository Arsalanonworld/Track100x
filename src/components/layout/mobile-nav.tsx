
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
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-6 w-6 text-primary"
    >
      <path d="M12 11.25a.75.75 0 100-1.5.75.75 0 000 1.5z" />
      <path
        fillRule="evenodd"
        d="M2.25 3.385c0-.83.824-1.408 1.61-.99L11.25 7.5v.033l-9.615-5.138A1.125 1.125 0 012.25 3.385zm19.5 0a1.125 1.125 0 00-2.228.415L12.75 7.533V7.5L20.14 2.395c.787-.418 1.61.16 1.61.99zM12 8.283l-9.75 5.186V15.75l9.75-5.186v-2.28zm0-2.28L21.75 11.25V9.75L12 4.564v1.436zM3.86 16.245l7.39 3.92V21l-8.25-4.385A1.125 1.125 0 013.86 15zM12.75 21v-1.165l7.39-3.92a1.125 1.125 0 011.855 1.165L12.75 21z"
        clipRule="evenodd"
      />
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
