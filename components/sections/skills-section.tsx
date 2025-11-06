"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { HoverButton } from "@/components/ui/hover-button"

export function SkillsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { 
        threshold: 0.3,
        rootMargin: '-50px 0px'
      }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 lg:py-24 px-4 sm:px-6">
      {/* Section Title */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-3 sm:mb-4 text-black dark:text-white">
          My Top Skills
        </h2>
        <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl mx-auto">
        {/* Skills content */}
        <div
          className={`space-y-6 sm:space-y-8 ${isVisible ? "animate-slide-in-left" : "opacity-0 -translate-x-full"}`}
        >
          <div className="space-y-3 sm:space-y-4">
            <p className="text-base sm:text-lg text-muted-foreground">
              What I do
            </p>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold tracking-tight leading-tight sm:leading-none">
              Designer & <br className="hidden sm:block" />
              Developer.
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground uppercase tracking-wider">
              FULL-STACK EXPERTISE
            </p>
          </div>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-md leading-relaxed">
            I create beautiful user interfaces and build robust applications. From concept to deployment, I handle both the creative and technical aspects of web development.
          </p>

          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-base sm:text-lg">UI/UX Design & Prototyping</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-base sm:text-lg">Frontend Development</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
              <span className="text-base sm:text-lg">Backend Development</span>
            </div>
          </div>

        </div>

        {/* Skills illustration */}
        <div
          className={`flex justify-center lg:justify-end ${isVisible ? "animate-slide-in-right" : "opacity-0 translate-x-full"}`}
        >
          <div className="relative w-full max-w-lg mx-auto lg:mx-0">
            {/* Design icon - Hidden on mobile, shown on sm and up */}
            <div className="hidden sm:block absolute -left-6 sm:-left-8 top-4 sm:top-8 animate-bounce-gentle z-10">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Main skills graphic */}
            <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden">
              <img
                src="/dev and des.png"
                alt="Skills showcase"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Code icon */}
            <div className="absolute -right-8 bottom-8 animate-bounce-gentle-delayed z-10">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
