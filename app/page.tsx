"use client"

import { Header } from "@/components/header"
import { SocialSidebar } from "@/components/social-slider"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { SkillsSection } from "@/components/sections/skills-section"
import { TechnologiesSection } from "@/components/sections/technologies-section"
import { CustomCursor } from "@/components/custom-cursor"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [showMagic, setShowMagic] = useState(true)
  const [magicComplete, setMagicComplete] = useState(false)

  useEffect(() => {
    // Start magic animation on page load
    const timer = setTimeout(() => {
      setMagicComplete(true)
      setShowMagic(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Startup Magic Animation */}
      {showMagic && !magicComplete && (
        <div className="fixed inset-0 z-50 bg-blue-900 flex items-center justify-center animate-slide-up">
          <div className="text-center">
            <h1 className="text-6xl lg:text-8xl font-bold text-white animate-pulse">
              IT'S MAGIC
            </h1>
          </div>
        </div>
      )}

      <CustomCursor />
      <Header />
      <main className="container mx-auto px-6 py-8 max-w-5xl">
        <HeroSection />
        <div className="py-4"></div>
        <SkillsSection />
        <div className="py-16"></div>
        <TechnologiesSection />
        <SocialSidebar />
      </main>

      <Footer />
    </div>
  )
}
