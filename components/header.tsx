"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"
import { RollText } from "@/components/ui/roll-text"
import { MenuIcon, SiteMenu } from "@/components/menu/site-menu"
import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useSeason } from "./seasonal/seasonal-manager"
import { SantaHat, KohaBird, VesakLantern } from "./seasonal/logo-decorations"

const desktopNav = [
  { name: "Resume", href: "/resume" },
  { name: "Stories", href: "/stories" },
  { name: "Blog", href: "/blog" },
]

// trailingSlash routes come back as "/blog/", links are written "/blog"
const samePath = (a: string, b: string) => a.replace(/\/+$/, "") === b.replace(/\/+$/, "")

export function Header() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [overFooter, setOverFooter] = useState(false)
  const [scrolledAway, setScrolledAway] = useState(false)
  const menuBtnRef = useRef<HTMLButtonElement>(null)

  const season = useSeason()

  // the menu locks scrolling itself; on close, focus goes back to the button that opened it
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false)
    menuBtnRef.current?.focus()
  }, [])

  // Close the menu when the route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  // Slide away while scrolling down and come back on the way up. It also stays away while the
  // footer fills the screen: the footer carries its own menu and back-to-top, and the light
  // bar clashed with its red.
  useEffect(() => {
    let lastY = window.scrollY
    const handleScroll = () => {
      const y = window.scrollY
      setIsScrolled(y > 10)
      if (y < 80) setScrolledAway(false)
      else if (y > lastY + 4) setScrolledAway(true)
      else if (y < lastY - 4) setScrolledAway(false)
      lastY = y
      const footer = document.querySelector('footer')
      // once the footer covers half the screen (it can end just short of the top on tall screens)
      setOverFooter(!!footer && footer.getBoundingClientRect().top < window.innerHeight / 2)
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <>
      <header className={cn(
        // bg-background resolves to hsl(oklch(...)), which is invalid and left the bar transparent,
        // so its dark text vanished over the black sections
        "sticky top-0 z-40 w-full bg-white/85 backdrop-blur-md transition-[box-shadow,transform] duration-500 ease-out dark:bg-gray-950/85",
        isScrolled && "shadow-sm",
        (overFooter || scrolledAway) && !isMenuOpen && "-translate-y-full shadow-none"
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
                {/* Seasonal Decorations Container - Moved outside rotating div */}
                <AnimatePresence>
                  {season === "christmas" && <SantaHat />}
                  {season === "avurudu" && <KohaBird />}
                  {season === "vesak" && <VesakLantern />}
                </AnimatePresence>

              <div className="relative transition-all duration-500 transform-style-3d group-hover:rotate-x-180">
                {/* Front Face - AMIKA */}
                <div className="flex items-center backface-hidden">
                  <span className="font-display text-2xl leading-none md:text-3xl">
                    <span className="text-sky-500">A</span>
                    <span className="text-black dark:text-white">MIKA</span>
                  </span>
                </div>
                
                {/* Back Face - あみか (Hidden initially, shown on flip) */}
                <div className="absolute inset-0 flex items-center justify-center backface-hidden rotate-x-180 bg-white backdrop-blur-none dark:bg-gray-950">
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
              className="group font-mono text-xs uppercase tracking-widest text-gray-600 transition-colors hover:text-black dark:text-gray-400 dark:hover:text-white"
            >
              <RollText text="amikafernando123@gmail.com" stagger={0.006} />
            </a>
          </div>

          {/* Right side - Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {desktopNav.map((item) => {
                const active = samePath(pathname, item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative font-display text-xl uppercase leading-none tracking-wide transition-colors",
                      active ? "text-black dark:text-white" : "text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white",
                    )}
                  >
                    <RollText text={item.name} />
                    {active && <span aria-hidden className="absolute -bottom-2 left-0 h-[3px] w-full bg-[#EF3B2D]" />}
                  </Link>
                )
              })}
            </nav>
            
            <ThemeToggle />
            
            <button
              ref={menuBtnRef}
              type="button"
              onClick={() => setIsMenuOpen(true)}
              aria-expanded={isMenuOpen}
              aria-controls="site-menu"
              className="group flex h-12 items-center gap-3 font-mono text-xs uppercase tracking-widest"
            >
              <span className="hidden sm:inline">
                <RollText text="Menu" />
              </span>
              <MenuIcon open={false} />
            </button>
          </div>
        </div>
      </header>

      <SiteMenu open={isMenuOpen} onClose={closeMenu} pathname={pathname} />
    </>
  )
}
