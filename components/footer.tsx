"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useState, useEffect, useRef } from "react"
import { Instagram, Facebook } from "lucide-react"
import { FaWhatsapp } from "react-icons/fa"

const navigation = [
  { name: "RESUME", href: "/resume" },
  { name: "STORIES", href: "/stories" },
  { name: "QUOTES", href: "/quotes" },
  { name: "BLOG", href: "/blog" },
]

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const pathname = usePathname()
  const [isVisible, setIsVisible] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    if (footerRef.current) {
      observer.observe(footerRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef as React.RefObject<HTMLElement>}
      className={cn(
        "relative mt-20 bg-gray-100 dark:bg-gray-900 overflow-hidden",
        className
      )}
    >
      {/* Arch background */}
      <div className="relative">
        <svg
          viewBox="0 0 1200 400"
          className={`w-full h-80 fill-gray-200 dark:fill-gray-800 transition-all duration-1000 ${isVisible ? 'animate-arch-rise' : 'translate-y-full opacity-0'}`}
          preserveAspectRatio="none"
        >
          <path d="M0,400 Q600,0 1200,400 L1200,400 L0,400 Z" />
        </svg>
        
        {/* Content overlay */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 pt-16">
          {/* Navigation */}
          <nav className="flex flex-wrap items-center justify-center gap-8 mb-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "text-sm font-bold tracking-wider transition-colors hover:text-primary uppercase",
                  pathname === item.href ? "text-primary" : "text-gray-700 dark:text-gray-300"
                )}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Divider line */}
          <div className="w-32 h-px bg-gray-400 dark:bg-gray-600 mb-6"></div>

          {/* Contact info */}
          <div className="space-y-4 mt-4">
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-6">
              Feel free to contact me anytime, anywhere
            </p>
            <a
              href="mailto:amikafernando123@gmail.com"
              className="text-gray-800 dark:text-gray-200 font-medium hover:text-primary transition-colors block"
            >
              amikafernando123@gmail.com
            </a>
            
            {/* Social Media Icons */}
            <div className="flex items-center justify-center gap-6 mt-4">
              <a
                href="https://www.instagram.com/a4amiiika?igsh=OHprMDI3aTdrdW94"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-pink-500 transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6 dark:filter dark:drop-shadow-[0_0_8px_rgba(236,72,153,0.8)] dark:brightness-125" />
              </a>
              <a
                href="https://www.facebook.com/profile.php?id=100077444513727"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-blue-600 transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6 dark:filter dark:drop-shadow-[0_0_8px_rgba(37,99,235,0.8)] dark:brightness-125" />
              </a>
              <a
                href="https://wa.me/+94757975856"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 dark:text-gray-400 hover:text-green-500 transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp className="h-6 w-6 dark:filter dark:drop-shadow-[0_0_8px_rgba(34,197,94,0.8)] dark:brightness-125" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom section */}
      <div className="bg-gray-200 dark:bg-gray-800 py-4">
        <div className="container mx-auto px-6 text-center">
          <div className="text-sm text-gray-600 dark:text-gray-400">
            © 2025 AMIKA FERNANDO. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  )
}
