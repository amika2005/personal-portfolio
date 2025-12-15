"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"
import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const handleToggle = async (e: React.MouseEvent<HTMLButtonElement>) => {
    const isDark = resolvedTheme === "dark"
    const newTheme = isDark ? "light" : "dark"

    /**
     * Get click coordinates (x, y)
     * Using the actual click position on the screen
     */
    const x = e.clientX
    const y = e.clientY

    /**
     * Calculate the maximum radius needed to cover the entire viewport
     * We need to find the distance to the furthest corner
     */
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    )

    /**
     * Check if View Transitions API is supported
     * Falls back to instant theme change if not supported
     */
    // @ts-ignore - View Transitions API types
    if (!document.startViewTransition) {
      setTheme(newTheme)
      return
    }

    /**
     * Start the View Transition
     * The callback contains the DOM changes (theme switch)
     * flushSync ensures React updates the DOM synchronously
     */
    // @ts-ignore - View Transitions API types
    const transition = document.startViewTransition(() => {
      flushSync(() => {
        setTheme(newTheme)
      })
    })

    /**
     * Wait for the transition to be ready
     * This is when the browser has captured the "old" and "new" states
     */
    await transition.ready

    /**
     * Animate the ::view-transition-new(root) pseudo-element
     * with a circular clip-path expanding from click position
     */
    document.documentElement.animate(
      {
        clipPath: [
          `circle(0px at ${x}px ${y}px)`,
          `circle(${endRadius}px at ${x}px ${y}px)`
        ]
      },
      {
        duration: 500,
        easing: "ease-in-out",
        pseudoElement: "::view-transition-new(root)"
      }
    )
  }

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      ref={buttonRef}
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className="w-9 h-9 hover:bg-muted transition-colors relative"
    >
      {/* Sun icon - shows in dark mode (click to go light) */}
      <Sun 
        className={`h-4 w-4 absolute transition-all duration-300 ${
          resolvedTheme === "dark" 
            ? "rotate-0 scale-100" 
            : "rotate-90 scale-0"
        }`} 
      />
      {/* Moon icon - shows in light mode (click to go dark) */}
      <Moon 
        className={`h-4 w-4 absolute transition-all duration-300 ${
          resolvedTheme === "dark" 
            ? "-rotate-90 scale-0" 
            : "rotate-0 scale-100"
        }`} 
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
