"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialSlider } from "@/components/social-slider"
import { CustomCursor } from "@/components/custom-cursor"
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Quote, Heart, BookOpen, Users, ChevronLeft, ChevronRight } from 'lucide-react'

interface QuoteData {
  id: number
  text: string
  author: string
  category: 'life' | 'experience' | 'humanity'
}

const quotes: QuoteData[] = [
  // Life Quotes
  {
    id: 1,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "life"
  },
  {
    id: 2,
    text: "Life is what happens to you while you're busy making other plans.",
    author: "John Lennon",
    category: "life"
  },
  {
    id: 3,
    text: "The purpose of our lives is to be happy.",
    author: "Dalai Lama",
    category: "life"
  },
  {
    id: 4,
    text: "Get busy living or get busy dying.",
    author: "Stephen King",
    category: "life"
  },
  {
    id: 5,
    text: "You only live once, but if you do it right, once is enough.",
    author: "Mae West",
    category: "life"
  },
  {
    id: 16,
    text: "The biggest adventure you can take is to live the life of your dreams.",
    author: "Oprah Winfrey",
    category: "life"
  },
  {
    id: 17,
    text: "Life is really simple, but we insist on making it complicated.",
    author: "Confucius",
    category: "life"
  },
  {
    id: 20,
    text: "The way to get started is to quit talking and begin doing.",
    author: "Walt Disney",
    category: "life"
  },
  {
    id: 25,
    text: "Life is 10% what happens to us and 90% how we react to it.",
    author: "Charles R. Swindoll",
    category: "life"
  },
  {
    id: 26,
    text: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
    category: "life"
  },
  {
    id: 27,
    text: "Your future is created by what you do today, not tomorrow.",
    author: "Robert Kiyosaki",
    category: "life"
  },

  // Experience Quotes
  {
    id: 6,
    text: "The only source of knowledge is experience.",
    author: "Albert Einstein",
    category: "experience"
  },
  {
    id: 7,
    text: "Experience is the teacher of all things.",
    author: "Julius Caesar",
    category: "experience"
  },
  {
    id: 8,
    text: "Experience is not what happens to you; it's what you do with what happens to you.",
    author: "Aldous Huxley",
    category: "experience"
  },
  {
    id: 9,
    text: "The best way to predict the future is to create it.",
    author: "Peter Drucker",
    category: "experience"
  },
  {
    id: 10,
    text: "Experience is the hardest kind of teacher. It gives you the test first and the lesson afterward.",
    author: "Oscar Wilde",
    category: "experience"
  },
  {
    id: 18,
    text: "The beautiful thing about learning is that no one can take it away from you.",
    author: "B.B. King",
    category: "experience"
  },
  {
    id: 21,
    text: "The only way to do great work is to love what you do.",
    author: "Steve Jobs",
    category: "experience"
  },
  {
    id: 23,
    text: "Innovation distinguishes between a leader and a follower.",
    author: "Steve Jobs",
    category: "experience"
  },
  {
    id: 28,
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
    category: "experience"
  },
  {
    id: 29,
    text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
    author: "Winston Churchill",
    category: "experience"
  },
  {
    id: 30,
    text: "The future belongs to those who believe in the beauty of their dreams.",
    author: "Eleanor Roosevelt",
    category: "experience"
  },

  // Humanity Quotes
  {
    id: 11,
    text: "The best way to find yourself is to lose yourself in the service of others.",
    author: "Mahatma Gandhi",
    category: "humanity"
  },
  {
    id: 12,
    text: "We cannot solve our problems with the same thinking we used when we created them.",
    author: "Albert Einstein",
    category: "humanity"
  },
  {
    id: 13,
    text: "Be the change that you wish to see in the world.",
    author: "Mahatma Gandhi",
    category: "humanity"
  },
  {
    id: 14,
    text: "The greatness of a nation and its moral progress can be judged by the way its animals are treated.",
    author: "Mahatma Gandhi",
    category: "humanity"
  },
  {
    id: 15,
    text: "Darkness cannot drive out darkness: only light can do that. Hate cannot drive out hate: only love can do that.",
    author: "Martin Luther King Jr.",
    category: "humanity"
  },
  {
    id: 19,
    text: "The time is always right to do what is right.",
    author: "Martin Luther King Jr.",
    category: "humanity"
  },
  {
    id: 22,
    text: "In the end, we will remember not the words of our enemies, but the silence of our friends.",
    author: "Martin Luther King Jr.",
    category: "humanity"
  },
  {
    id: 24,
    text: "Our lives begin to end the day we become silent about things that matter.",
    author: "Martin Luther King Jr.",
    category: "humanity"
  },
  {
    id: 31,
    text: "The best and most beautiful things in the world cannot be seen or even touched - they must be felt with the heart.",
    author: "Helen Keller",
    category: "humanity"
  },
  {
    id: 32,
    text: "We make a living by what we get, but we make a life by what we give.",
    author: "Winston Churchill",
    category: "humanity"
  },
  {
    id: 33,
    text: "Compassion is the greatest form of love humans have to offer.",
    author: "Rachel Joy Scott",
    category: "humanity"
  }
]

const categories = [
  { id: 'life', name: 'Life', icon: Heart, color: 'from-pink-500 to-rose-500' },
  { id: 'experience', name: 'Experience', icon: BookOpen, color: 'from-blue-500 to-cyan-500' },
  { id: 'humanity', name: 'Humanity', icon: Users, color: 'from-green-500 to-emerald-500' }
]

export default function QuotesPage() {
  const [selectedCategory, setSelectedCategory] = useState<'life' | 'experience' | 'humanity'>('life')
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const filteredQuotes = quotes.filter(quote => quote.category === selectedCategory)
  const currentQuote = filteredQuotes[currentQuoteIndex]

  // Auto-advance quotes
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % filteredQuotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedCategory, filteredQuotes.length, isAutoPlaying])

  // Prevent hydration mismatch and loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
      setIsMounted(true)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const nextQuote = () => {
    setCurrentQuoteIndex((prev) => (prev + 1) % filteredQuotes.length)
  }

  const prevQuote = () => {
    setCurrentQuoteIndex((prev) => (prev - 1 + filteredQuotes.length) % filteredQuotes.length)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-sky-500 border-t-transparent rounded-full mx-auto mb-8"
            />
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
            >
              Loading Quotes...
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-gray-600 dark:text-gray-300"
            >
              Preparing inspiring words for you
            </motion.p>
          </div>
        </div>
      </div>
    )
  }

  if (!isMounted) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="hidden md:block">
        <SocialSlider />
      </div>

      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8 w-full">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-16 px-4 sm:px-6 lg:px-8 text-center relative"
        >
          {/* Floating particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-20 w-2 h-2 bg-sky-400 rounded-full animate-float-particle opacity-60" />
            <div className="absolute top-32 right-32 w-1 h-1 bg-purple-400 rounded-full animate-float-particle-delayed opacity-40" />
            <div className="absolute bottom-20 left-1/3 w-1.5 h-1.5 bg-pink-400 rounded-full animate-float-particle opacity-50" />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8 relative z-10"
          >
            <h1 className="text-6xl md:text-8xl font-bold text-gray-900 dark:text-white mb-4">
              <span className="gradient-text animate-text-shimmer">Quotes</span>
            </h1>
            <div className="h-1 w-32 bg-gradient-to-r from-sky-500 to-purple-500 mx-auto rounded-full mb-6 animate-width-expand" />
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Inspiring words that shape our perspective on life, experience, and humanity
            </p>
          </motion.div>
        </motion.div>

        {/* Category Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id

              return (
                <motion.button
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSelectedCategory(category.id as any)
                    setCurrentQuoteIndex(0)
                  }}
                  className={`group relative px-6 py-3 rounded-full font-medium transition-all duration-300 ${
                    isSelected
                      ? 'text-white shadow-lg animate-quote-glow'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${category.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
                  {isSelected && (
                    <motion.div
                      layoutId="activeCategory"
                      className={`absolute inset-0 rounded-full bg-gradient-to-r ${category.color}`}
                      initial={false}
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <div className="relative flex items-center gap-2">
                    <motion.div
                      animate={isSelected ? { rotate: [0, -10, 10, 0] } : {}}
                      transition={{ duration: 0.6, repeat: isSelected ? Infinity : 0, repeatDelay: 2 }}
                    >
                      <Icon size={20} />
                    </motion.div>
                    <span>{category.name}</span>
                  </div>
                </motion.button>
              )
            })}
          </div>
        </motion.div>

        {/* Quote Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <div className="relative min-h-[400px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${selectedCategory}-${currentQuoteIndex}`}
                initial={{ opacity: 0, y: 50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center px-8 py-12"
              >
                {/* Quote Icon */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", bounce: 0.4 }}
                  className="mb-8"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-sky-500 to-purple-500 text-white shadow-lg">
                    <Quote size={32} />
                  </div>
                </motion.div>

                {/* Quote Text */}
                <motion.blockquote
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-2xl md:text-3xl lg:text-4xl font-medium text-gray-900 dark:text-white leading-relaxed mb-8 max-w-3xl mx-auto"
                >
                  "{currentQuote?.text}"
                </motion.blockquote>

                {/* Author */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.8 }}
                  className="text-lg md:text-xl text-gray-600 dark:text-gray-300 font-light"
                >
                  — {currentQuote?.author}
                </motion.p>

                {/* Quote Counter */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                  className="mt-8 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400"
                >
                  <span>{currentQuoteIndex + 1}</span>
                  <span>/</span>
                  <span>{filteredQuotes.length}</span>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Arrows */}
            <button
              onClick={prevQuote}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-sky-500"
              aria-label="Previous quote"
            >
              <ChevronLeft size={24} />
            </button>

            <button
              onClick={nextQuote}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 text-gray-600 dark:text-gray-300 hover:text-sky-500"
              aria-label="Next quote"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* Auto-play Toggle */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="flex justify-center mt-8"
          >
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="px-6 py-3 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300 font-medium"
            >
              {isAutoPlaying ? 'Pause Auto-play' : 'Resume Auto-play'}
            </button>
          </motion.div>
        </motion.div>

        {/* Quote Grid Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          className="max-w-7xl mx-auto mt-20 px-4 sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
            All {categories.find(c => c.id === selectedCategory)?.name} Quotes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuotes.map((quote, index) => (
              <motion.div
                key={quote.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 quote-card-hover"
              >
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileHover={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    <Quote size={20} className="text-sky-500" />
                  </motion.div>
                </div>

                <motion.blockquote
                  className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  "{quote.text}"
                </motion.blockquote>

                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <motion.p
                    className="text-sm text-gray-500 dark:text-gray-400 font-medium"
                    whileHover={{ x: 5 }}
                    transition={{ duration: 0.2 }}
                  >
                    {quote.author}
                  </motion.p>
                </div>

                {/* Enhanced floating animation */}
                <div className="absolute -inset-1 bg-gradient-to-r from-sky-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-opacity duration-300 -z-10" />

                {/* Staggered floating particles */}
                <div className="absolute -top-2 -right-2 w-1 h-1 bg-sky-400 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-300"
                     style={{ animationDelay: `${index * 0.2}s` }} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
      <CustomCursor />
    </div>
  )
}