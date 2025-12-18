"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialSidebar } from "@/components/social-slider"
import { CustomCursor } from "@/components/custom-cursor"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Heart, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react'

const quotes = [
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  },
  {
    id: 2,
    text: "Talk is cheap. Show me the code.",
    author: "Linus Torvalds"
  },
  {
    id: 3,
    text: "The best way to predict the future is to invent it.",
    author: "Alan Kay"
  },
  {
    id: 4,
    text: "When something is important enough, you do it even if the odds are not in your favor.",
    author: "Elon Musk"
  },
  {
    id: 5,
    text: "Software is eating the world.",
    author: "Marc Andreessen"
  }
]

export default function QuotesPage() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)

  const currentQuote = quotes[currentQuoteIndex]

  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Auto-advance quotes
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % quotes.length)
  }

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + quotes.length) % quotes.length)
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      <Header />
      <div className="hidden md:block">
        <SocialSidebar />
      </div>

      <main className="flex-1 py-16 md:py-24 px-4 sm:px-6 lg:px-8 w-full max-w-7xl mx-auto">
        {/* Minimal Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 relative"
        >
          <div className="inline-block relative mb-4">
            <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-gray-900 dark:text-white mb-2" style={{ fontFamily: "'Teko', sans-serif" }}>
              Tech Wisdom
            </h1>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto rounded-full"
            />
          </div>
          <p className="text-gray-500 dark:text-gray-400 font-medium tracking-wide text-sm md:text-base uppercase max-w-md mx-auto">
            Insights from the visionaries shaping our future.
          </p>
        </motion.div>

        {/* Featured Quote - 3D Animation */}
        <div className="relative mb-32 max-w-4xl mx-auto perspective-1000" style={{ perspective: "1000px" }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={currentQuoteIndex}
              initial={{ rotateX: 90, opacity: 0, scale: 0.8 }}
              animate={{ rotateX: 0, opacity: 1, scale: 1 }}
              exit={{ rotateX: -90, opacity: 0, scale: 0.8 }}
              transition={{ 
                duration: 0.6, 
                ease: [0.23, 1, 0.32, 1], // Cubic bezier for smooth "surprise" feel
                scale: { duration: 0.4 }
              }}
              style={{ transformStyle: "preserve-3d", transformOrigin: "center center -100px" }}
              className="text-center"
            >
              <div className="mb-8 transform-style-3d">
                <Quote className="mx-auto text-gray-300 dark:text-gray-700 w-12 h-12" />
              </div>
              
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-gray-900 dark:text-white mb-8 backface-hidden" style={{ fontFamily: "'Teko', sans-serif" }}>
                "{currentQuote?.text}"
              </h2>

              <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium transform-style-3d">
                — {currentQuote?.author}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Minimal Controls */}
          <div className="flex items-center justify-center gap-8 mt-16">
            <button onClick={prevQuote} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <ChevronLeft size={24} />
            </button>
            
            <div className="text-sm font-mono text-gray-400 tracking-widest">
              {String(currentQuoteIndex + 1).padStart(2, '0')} / {String(quotes.length).padStart(2, '0')}
            </div>
            
            <button onClick={nextQuote} className="p-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors">
              <ChevronRight size={24} />
            </button>
          </div>

           <div className="flex justify-center mt-8">
             <button
               onClick={() => setIsAutoPlaying(!isAutoPlaying)}
               className={`text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-lg transition-colors ${isAutoPlaying ? 'text-gray-900 dark:text-white bg-gray-100 dark:bg-gray-800' : 'text-gray-400'}`}
             >
               {isAutoPlaying ? 'Running' : 'Paused'}
             </button>
           </div>
        </div>

        {/* Minimal List View for All Quotes */}
        <div className="max-w-3xl mx-auto border-t border-gray-100 dark:border-gray-800 pt-24">
          <h3 className="text-2xl font-black uppercase text-center mb-12 tracking-tight text-gray-900 dark:text-white" style={{ fontFamily: "'Teko', sans-serif" }}>
            Full Collection
          </h3>
          
          <div className="space-y-16">
            {quotes.map((quote, index) => {
              const words = quote.text.split(" ");
              
              const containerVariants = {
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.03,
                    delayChildren: 0.1
                  }
                }
              };

              const wordVariants = {
                hidden: { opacity: 0, y: 10, filter: "blur(8px)" },
                visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.4 } }
              };

              return (
                <motion.div
                  key={quote.id}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                  variants={containerVariants}
                  className="group flex flex-col items-center text-center p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50 rounded-2xl transition-colors"
                >
                  <p className="text-xl md:text-3xl font-serif italic text-gray-800 dark:text-gray-200 mb-4 leading-relaxed max-w-2xl flex flex-wrap justify-center gap-x-2">
                    {words.map((word, i) => (
                      <motion.span
                        key={i}
                        variants={wordVariants}
                        className="inline-block"
                      >
                        {word}
                      </motion.span>
                    ))}
                  </p>
                  <motion.span 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-sky-500 transition-colors"
                  >
                    — {quote.author}
                  </motion.span>
                </motion.div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
      <CustomCursor />
    </div>
  )
}