"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/sections/hero-section"
import { ProcessSection } from "@/components/sections/process-section"

import { CustomCursor } from "@/components/custom-cursor"
import { SplitIntro } from "@/components/intro/split-intro"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <SplitIntro />

      <CustomCursor />
      <Header />
      
      {/* Hero: full screen, the name behind the illustration */}
      <HeroSection />
      
      {/* My Process: stacked sticky panels */}
      <ProcessSection />
      
      {/* Signs You're Ready Section */}

      

      <Footer />
    </div>
  )
}
