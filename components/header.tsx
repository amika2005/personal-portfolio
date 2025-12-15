"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { Briefcase, User, BookOpen, Quote, Menu, X, PenSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"

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

  const menuVariants: Variants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: "85vh",
      transition: {
        duration: 0.3,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    closed: { opacity: 0, x: -20 },
    open: { opacity: 1, x: 0 }
  }

  return (
    <header className={cn(
      "sticky top-0 z-40 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-shadow duration-300",
      isScrolled && "shadow-sm"
    )}>
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left side - Brand name */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
            <span className="text-xl md:text-2xl font-bold tracking-tight">
              <span className="text-sky-500">A</span>
              <span className="text-black dark:text-white">MIKA</span>
            </span>
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
            className="md:hidden p-2 -mr-2 text-muted-foreground hover:text-foreground transition-colors relative z-50 w-10 h-10 flex items-center justify-center"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            <div className="flex flex-col gap-1.5 align-center justify-center">
              <motion.span 
                animate={isMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-current block origin-center transition-transform"
              />
              <motion.span 
                animate={isMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                className="w-6 h-0.5 bg-current block transition-opacity"
              />
              <motion.span 
                animate={isMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                className="w-6 h-0.5 bg-current block origin-center transition-transform"
              />
            </div>
          </button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="md:hidden bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 overflow-hidden border-t"
          >
            <motion.div className="container px-4 sm:px-6 pb-6 pt-4 flex flex-col space-y-4">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <motion.div key={item.name} variants={itemVariants}>
                    <Link
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
                  </motion.div>
                )
              })}
              <motion.div variants={itemVariants}>
                <a
                  href="mailto:amikafernando123@gmail.com"
                  className="flex items-center gap-3 py-2 px-3 rounded-lg text-base font-medium text-muted-foreground hover:bg-accent/50 transition-colors"
                >
                  <span className="h-5 w-5 flex items-center justify-center">@</span>
                  <span>Email Me</span>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
