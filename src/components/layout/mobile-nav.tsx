
'use client'

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { useRouter } from "next/navigation"
import { Menu, Rss, Trophy, LayoutDashboard, Compass, Eye, Star, Sparkles, Bell } from "lucide-react"
import type { NavItem } from "@/lib/types";

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"

function LogoIcon() {
  return (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
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

const iconMap: { [key: string]: React.ElementType } = {
  '/feed': Rss,
  '/leaderboard': Compass,
  '/watchlist': Eye,
  '/alerts': Bell,
  '/#features': Sparkles,
  '/#pricing': Star,
};

export function MobileNav({ items }: { items: NavItem[]}) {
  const [open, setOpen] = React.useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
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
          {items.map((item) => {
            const Icon = iconMap[item.href] || Star;
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
