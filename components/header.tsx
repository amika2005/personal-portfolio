"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { User, BookOpen, Quote, PenSquare } from "lucide-react"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSeason } from "./seasonal/seasonal-manager"
import { SantaHat, KohaBird, VesakLantern } from "./seasonal/logo-decorations"

const navigation = [
  { name: "Resume", href: "/resume", color: "#beef00" },
  { name: "Stories", href: "/stories", color: "#00eaff" },
  { name: "Quotes", href: "/quotes", color: "#ff0028" },
  { name: "Blog", href: "/blog", color: "#d300ff" },
  { name: "Contact", href: "mailto:amikafernando123@gmail.com", color: "#FF6B00" },
]

const desktopNav = [
  { name: "Resume", href: "/resume", icon: User, color: "#beef00" },
  { name: "Stories", href: "/stories", icon: BookOpen, color: "#00eaff" },
  { name: "Quotes", href: "/quotes", icon: Quote, color: "#ff0028" },
  { name: "Blog", href: "/blog", icon: PenSquare, color: "#d300ff" },
]

export function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  
  // New State for Menu Interaction
  const [hoveredColor, setHoveredColor] = useState<string | null>(null)
  const [isNavigating, setIsNavigating] = useState(false)
  
  const season = useSeason()

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
    setIsNavigating(false)
  }, [pathname])

  // Reset navigation state when menu closes
  useEffect(() => {
    if (!isMenuOpen) {
       setIsNavigating(false)
       setHoveredColor(null)
    }
  }, [isMenuOpen])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Handle Normal Navigation
  const handleNavigation = (href: string) => {
    setIsMenuOpen(false)
    router.push(href)
  }

  return (
    <>
      <header className={cn(
        "sticky top-0 z-40 w-full bg-background transition-shadow duration-300",
        isScrolled && "shadow-sm"
      )}>


        <div className="container flex h-16 items-center justify-between px-4 sm:px-6">
          {/* Left side - Brand name */}
          <motion.div 
            className="flex items-center"
            initial={false}
            animate={{ opacity: isMenuOpen ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Link href="/" className="group relative block perspective-1000">
               {/* Seasonal Decorations Container */}
               <AnimatePresence>
                 {season === "christmas" && <SantaHat />}
                 {season === "avurudu" && <KohaBird />}
                 {season === "vesak" && <VesakLantern />}
               </AnimatePresence>

              <div className="relative transition-all duration-500 transform-style-3d group-hover:rotate-x-180">
                {/* Front Face - AMIKA */}
                <div className="flex items-center backface-hidden">
                  <span className="text-xl md:text-2xl font-bold tracking-tight">
                    <span className="text-sky-500">A</span>
                    <span className="text-black dark:text-white">MIKA</span>
                  </span>
                </div>
                
                {/* Back Face - あみか (Hidden initially, shown on flip) */}
                <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-x-180 bg-background backdrop-blur-none">
                   <span className="text-xl md:text-2xl font-bold tracking-tight text-sky-500">
                    あみか
                  </span>
                </div>
              </div>
            </Link>
          </motion.div>

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
              {desktopNav.map((item) => {
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
            
            {/* Hamburger Button - Hides when menu is open to avoid duplicate close icon */}
            <motion.button
              className="md:hidden relative z-[100] w-12 h-12 flex items-center justify-center"
              onClick={() => setIsMenuOpen(true)}
              animate={{ opacity: isMenuOpen ? 0 : 1, pointerEvents: isMenuOpen ? 'none' : 'auto' }}
              aria-label="Open menu"
            >
              <div className="relative w-8 h-8">
                 {/* Standard Hamburger Lines */}
                 <div className="absolute top-[25%] left-0 w-8 h-[2px] bg-current rounded-full" />
                 <div className="absolute top-[50%] left-0 w-6 h-[2px] bg-current rounded-full translate-y-[-50%]" />
                 <div className="absolute top-[75%] left-0 w-8 h-[2px] bg-current rounded-full" />
              </div>
            </motion.button>
          </div>
        </div>
      </header>

      {/* Half Screen Mobile Menu - Dynamic Background & Transitions */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="menu-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[85] md:hidden bg-black/30"
              onClick={() => setIsMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              key="menu-panel"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                  "fixed top-0 right-0 bottom-0 z-[90] md:hidden flex flex-col justify-center shadow-2xl overflow-hidden w-1/2 bg-white dark:bg-gray-950 border-l border-gray-100 dark:border-gray-800"
              )}
            >
              {/* Close button - Explicitly Added Back */}
              <button
                onClick={() => setIsMenuOpen(false)}
                className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full group z-50 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
                aria-label="Close menu"
              >
                <div className="relative w-6 h-6">
                  <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black dark:bg-white rounded-full rotate-45" />
                  <span className="absolute top-1/2 left-0 w-full h-[2px] bg-black dark:bg-white rounded-full -rotate-45" />
                </div>
              </button>

              {/* Navigation Links */}
              <nav className="px-6 sm:px-8 relative z-10">
                <ul className="space-y-6">
                  {navigation.map((item, index) => {
                    const isActive = pathname === item.href
                    
                    // Simple hover color logic only
                    const isHovered = hoveredColor === item.color

                    return (
                      <motion.li
                        key={item.name}
                        className="overflow-hidden"
                      >
                        <motion.div
                          initial={{ y: "110%" }}
                          animate={{ y: "0%" }}
                          exit={{ y: "110%" }}
                          transition={{ 
                            delay: 0.1 + index * 0.1,
                            duration: 0.6,
                            ease: [0.22, 1, 0.36, 1]
                          }}
                        >
                          <Link
                            href={item.href}
                            onClick={(e) => {
                                e.preventDefault()
                                handleNavigation(item.href)
                            }}
                            onMouseEnter={() => setHoveredColor(item.color)}
                            onMouseLeave={() => setHoveredColor(null)}
                            className={cn(
                              "block text-5xl sm:text-7xl font-medium uppercase tracking-wide transition-all duration-300 hover:tracking-widest origin-left",
                              hoveredColor && hoveredColor === item.color 
                                ? "text-[--hover-color]" // Use inline style var for color
                                : (isActive ? "text-sky-500" : "text-black dark:text-white hover:text-sky-500")
                            )}
                            style={{ 
                                fontFamily: "'Teko', sans-serif",
                                "--hover-color": item.color
                            } as any}
                          >
                           {item.name}
                          </Link>
                        </motion.div>
                      </motion.li>
                    )
                  })}
                </ul>
              </nav>

              {/* Background Decoration Text */}
              <div className="absolute bottom-8 left-8 text-black/5 dark:text-white/5 text-9xl font-black pointer-events-none select-none z-0 hidden sm:block">
                MENU
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
