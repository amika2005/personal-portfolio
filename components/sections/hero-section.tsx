"use client"

import { Button } from "@/components/ui/button"
import { HoverButton } from "@/components/ui/hover-button"
import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="py-6 sm:py-8 lg:py-0">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Hero content */}
        <div
          className={`space-y-6 sm:space-y-8 ${isVisible ? "animate-slide-in-left animate-stagger-1" : "opacity-0 -translate-x-full"}`}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg text-gray-700 dark:text-gray-200 font-teko tracking-wide">
              It&apos;s me
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-teko font-bold tracking-tight leading-[0.8] uppercase">
              Amika <br className="hidden sm:block" />
              Fernando
            </h1>
            <p 
              className="mt-2 text-xl sm:text-2xl lg:text-3xl font-medium text-gray-700 dark:text-gray-200 leading-none tracking-wide uppercase"
              style={{ fontFamily: "'Teko', sans-serif" }}
            >
              SOFTWARE ENGINEER
            </p>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Software Engineer at Infinit Tech systems, with a passion for building complex applications with cutting-edge technologies.
          </p>

          <div className="mt-6">
            <HoverButton />
          </div>
        </div>

        {/* Profile illustration */}
        <div className={`relative w-full max-w-[280px] sm:max-w-md mx-auto lg:mx-0 ${isVisible ? "animate-fade-in-up animate-stagger-2" : "opacity-0"}`}>
            {/* Left speech bubble - "Developing" */}
            <div className="absolute -left-2 sm:-left-8 top-0 sm:top-2 lg:-left-6 lg:top-2 animate-bounce-gentle z-10">
              <img
                src="/dialog-1.png"
                alt="Speech bubble"
                className="w-24 h-24 sm:w-24 sm:h-24 lg:w-40 lg:h-32 object-contain dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 dark:invert"
              />
            </div>

            {/* Main illustration */}
            <div className="flex justify-center mt-8 sm:mt-0">
              <img
                src="/my-image.png"
                alt="amika-illustration"
                className="w-full h-auto object-contain"
              />
            </div>
            
            {/* Right speech bubble - "Designing" */}
            <div className="absolute -right-2 sm:-right-8 top-0 sm:top-2 lg:-right-6 lg:top-2 animate-bounce-gentle-delayed z-10">
              <img
                src="/dialog-2.png"
                alt="Speech bubble"
                className="w-30 h-20 sm:w-32 sm:h-32 lg:w-48 lg:h-36 object-contain dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 dark:invert"
              />
            </div>
          </div>
      </div>
    </section>
  )
}
