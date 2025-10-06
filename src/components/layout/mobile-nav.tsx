'use client'

import * as React from "react"
import Link, { type LinkProps } from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Menu, BarChart, Bell, FileText, Eye, Rss } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet"
import { LogoIcon } from "./header"
import { useUser } from "@/firebase"

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { user } = useUser();

  const navItems = [
      { href: '/feed', label: 'Feed', icon: Rss, visible: true },
      { href: '/watchlist', label: 'Watchlist', icon: Eye, visible: !!user },
      { href: '/alerts', label: 'Alerts', icon: Bell, visible: true },
  ];

  const visibleItems = navItems.filter(item => item.visible);

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
            <SheetDescription className="sr-only">
                Main navigation menu.
            </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 pl-6 mt-4 text-lg font-medium flex-1">
          {visibleItems.map((item) => (
            <MobileLink
              key={item.href}
              href={item.href}
              onOpenChange={setOpen}
            >
              {item.label}
            </MobileLink>
          ))}
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
        router.push(href.toString())
        onOpenChange?.(false)
      }}
      className={cn(className)}
      {...props}
    >
      {children}
    </Link>
  )
}
