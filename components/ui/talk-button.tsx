"use client"

import { motion } from "framer-motion"
import Link from "next/link"

export function TalkButton() {
  return (
    <Link 
      href="mailto:amikafernando123@gmail.com" 
      className="relative inline-block group px-6 py-3 text-white font-medium overflow-hidden"
    >
      <span className="relative z-10 flex items-center gap-2">
        <span>Let's Talk</span>
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          →
        </span>
      </span>
      
      {/* Animated background elements */}
      <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full">
        <span className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-700 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </span>
      
      {/* Glow effect */}
      <span className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-indigo-400/30 to-purple-500/30 blur-md" />
      
      {/* Border animation */}
      <span className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-white/20 transition-all duration-500" />
    </Link>
  )
}
