
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"
import { useTheme } from "next-themes"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 500,
  ...props
}: AnimatedThemeTogglerProps) => {
  const { theme, setTheme } = useTheme()
  const [isDark, setIsDark] = useState(theme === "dark")
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setIsDark(theme === "dark")
  }, [theme])

  const toggleTheme = useCallback(async () => {
    const newTheme = isDark ? "light" : "dark"

    if (
      !buttonRef.current ||
      !(document as any).startViewTransition
    ) {
      setTheme(newTheme)
      return
    }

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    const transition = (document as any).startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    })

    await transition.ready
    
    document.documentElement.animate(
        {
            clipPath: [
            `circle(0px at ${x}px ${y}px)`,
            `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
        },
        {
            duration,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)",
        }
    )
  }, [isDark, duration, setTheme])

  return (
    <button
      ref={buttonRef}
      onClick={toggleTheme}
      className={cn("relative h-10 w-10 p-2", className)}
      {...props}
    >
      <span className="absolute inset-0 flex items-center justify-center transform transition-transform duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0">
        <Sun />
      </span>
      <span className="absolute inset-0 flex items-center justify-center transform transition-transform duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100">
        <Moon />
      </span>
      <span className="sr-only">Toggle theme</span>
    </button>
  )
}
