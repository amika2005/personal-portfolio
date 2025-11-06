"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Briefcase, User, BookOpen, Quote, Menu, X, PenSquare } from "lucide-react"
import { useState, useEffect } from "react"

const navigation = [
  { name: "Resume", href: "/resume", icon: User },
  { name: "Quotes", href: "/quotes", icon: Quote },
  { name: "Stories", href: "/stories", icon: BookOpen },
  { name: "Blog", href: "/blog", icon: PenSquare },
]

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300",
      isScrolled && "shadow-sm"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Brand name */}
        <div className="flex items-center">
          <Link href="/" className="text-xl font-bold tracking-tight hover:opacity-80 transition-opacity">
            <span className="text-blue-600">A</span>MIKA
          </Link>
        </div>

        {/* Center - Email - Hidden on mobile */}
        <div className="hidden md:flex items-center">
          <a
            href="mailto:amikafernando123@gmail.com"
            className="text-sm text-muted-foreground hover:text-sky-500 transition-colors"
          >
            amikafernando123@gmail.com
          </a>
        </div>

        {/* Right side - Navigation */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 text-sm font-medium transition-colors hover:text-sky-500",
                    pathname === item.href ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          
          <ThemeToggle />
          
          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <div className={cn(
        "md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-all duration-300 overflow-hidden",
        isMenuOpen ? "max-h-64 py-4 border-t" : "max-h-0 py-0 border-t-0"
      )}>
        <div className="container px-4 sm:px-6">
          <div className="flex flex-col space-y-4">
            {navigation.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 py-2 px-3 rounded-lg text-base font-medium transition-colors",
                    pathname === item.href 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent/50"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
            <a
              href="mailto:amikafernando123@gmail.com"
              className="flex items-center gap-3 py-2 px-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-accent/50 transition-colors"
            >
              <span className="h-5 w-5 flex items-center justify-center">@</span>
              <span>Email Me</span>
            </a>
          </div>
        </div>
      </div>
    </header>
  )
}
