
"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Moon, Sun } from "lucide-react"
import { flushSync } from "react-dom"

import { cn } from "@/lib/utils"

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<"button"> {
  duration?: number
}

export const AnimatedThemeToggler = ({
  className,
  duration = 400,
  ...props
}: AnimatedThemeTogglerProps) => {
  const [isDark, setIsDark] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"))
    }

    updateTheme()

    const observer = new MutationObserver(updateTheme)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  const toggleTheme = useCallback(async () => {
    if (!buttonRef.current || !(document as any).startViewTransition) {
        const newTheme = !isDark
        document.documentElement.classList.toggle("dark", newTheme)
        localStorage.setItem("theme", newTheme ? "dark" : "light")
        setIsDark(newTheme)
        return;
    }

    await (document as any).startViewTransition(() => {
      flushSync(() => {
        const newTheme = !isDark
        document.documentElement.classList.toggle("dark", newTheme)
        localStorage.setItem("theme", newTheme ? "dark" : "light")
        setIsDark(newTheme)
      })
    }).ready

    const { top, left, width, height } =
      buttonRef.current.getBoundingClientRect()
    const x = left + width / 2
    const y = top + height / 2
    const maxRadius = Math.hypot(
      Math.max(left, window.innerWidth - left),
      Math.max(top, window.innerHeight - top)
    )

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
  }, [isDark, duration])

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
