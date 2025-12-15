"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle, Instagram, Mail, MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import Link from "next/link"

export function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [showMagic, setShowMagic] = useState(false)
  const [magicComplete, setMagicComplete] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !magicComplete) {
          setShowMagic(true)
          // Start magic animation sequence
          setTimeout(() => {
            setMagicComplete(true)
            setIsVisible(true)
          }, 2000)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [magicComplete])

  return (
    <>
      {/* Magic Animation Overlay */}
      {showMagic && !magicComplete && (
        <div className="fixed inset-0 z-50 bg-blue-900 flex items-center justify-center animate-slide-up">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-bold text-white animate-pulse">
              IT'S MAGIC
            </h1>
          </div>
        </div>
      )}

      <section ref={sectionRef} className="container mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Contact content */}
          <div className={`space-y-8 ${isVisible ? "animate-fade-in-up" : "opacity-0"}`}>
            <div className="relative">
              <div className="bg-white dark:bg-card rounded-2xl p-6 shadow-lg border max-w-sm mb-8">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-medium">Looking for a developer? 🚀</p>
                  <Link href="/resume">
                    <Button
                      size="lg"
                      className="bg-sky-500 hover:bg-sky-600 text-white rounded-full px-6 py-3 text-sm font-medium transition-all duration-200 hover:scale-105"
                    >
                      MY RESUME
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Right side content */}
          <div className={`space-y-8 ${isVisible ? "animate-fade-in-up animate-stagger-2" : "opacity-0"}`}>
            <div className="text-center space-y-8">
              <h2 className="text-3xl lg:text-4xl font-bold">Let's Connect</h2>

              <div className="space-y-6">
                <div className="flex items-center justify-center gap-3 text-lg text-muted-foreground">
                  <MapPin className="h-5 w-5 text-sky-500" />
                  <span>Colombo, Sri Lanka</span>
                </div>

                <div className="flex items-center justify-center gap-3">
                  <Mail className="h-5 w-5 text-sky-500" />
                  <a
                    href="mailto:amikafernando123@gmail.com"
                    className="text-xl font-medium hover:text-sky-500 transition-colors"
                  >
                    amikafernando123@gmail.com
                  </a>
                </div>

                <div className="flex justify-center items-center gap-6 pt-4">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-sky-500 bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 transition-all duration-200 hover:scale-110"
                  >
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Telegram</span>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:text-pink-500 bg-gray-100 dark:bg-gray-800 rounded-full w-12 h-12 transition-all duration-200 hover:scale-110"
                  >
                    <Instagram className="h-6 w-6" />
                    <span className="sr-only">Instagram</span>
                  </Button>
                </div>

                <div className="mt-8 p-4 bg-gradient-to-r from-sky-500/10 to-purple-500/10 rounded-xl border border-sky-200 dark:border-sky-800">
                  <p className="text-sm text-center text-muted-foreground">
                    "Ready to turn your ideas into reality! Let's build something amazing together."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
