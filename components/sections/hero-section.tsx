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
            <p className="text-base sm:text-lg text-muted-foreground">
              It's me
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-tight sm:leading-none">
              Amika <br className="hidden sm:block" />
              Fernando
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground uppercase tracking-wider">
              INTERN SOFTWARE ENGINEER
            </p>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            Intern Software Engineer at Infinit Lanka, with a passion for building complex applications with cutting-edge technologies.
          </p>

          <div className="mt-6">
            <HoverButton />
          </div>
        </div>

        {/* Profile illustration */}
        <div
          className={`flex justify-center lg:justify-end ${isVisible ? "animate-fade-in-up animate-stagger-2" : "opacity-0"}`}
        >
          <div className="relative w-full max-w-md mx-auto lg:mx-0">
            {/* Left speech bubble - Visible on all screens */}
            <div className="absolute left-4 sm:-left-8 top-0 sm:top-2 lg:-left-6 lg:top-2 animate-bounce-gentle z-10">
              <img
                src="/dialog-1.png"
                alt="Speech bubble"
                className="w-38 h-28 sm:w-24 sm:h-24 lg:w-40 lg:h-32 object-contain dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 dark:invert"
              />
            </div>

            {/* Main illustration */}
            <div className="flex justify-center">
              <img
                src="/my-image.png"
                alt="amika-illustration"
                className="w-3/4 sm:w-full h-auto max-w-xs sm:max-w-md lg:max-w-none lg:w-96 lg:h-auto object-contain"
              />
            </div>
            
            {/* Right speech bubble - Visible on all screens */}
            <div className="absolute right-4 sm:-right-8 top-0 sm:top-2 lg:-right-6 lg:top-2 animate-bounce-gentle-delayed z-10">
              <img
                src="/dialog-2.png"
                alt="Speech bubble"
                className="w-30 h-28 sm:w-32 sm:h-32 lg:w-48 lg:h-36 object-contain dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 dark:invert"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
