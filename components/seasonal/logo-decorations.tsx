"use client"

import { motion } from "framer-motion"

export function SantaHat() {
  return (
    <motion.svg
      initial={{ opacity: 0, rotate: -20, scale: 0.8 }}
      animate={{ opacity: 1, rotate: -15, scale: 1 }}
      transition={{ delay: 0.5, type: "spring" }}
      viewBox="0 0 100 100"
      className="absolute -top-6 -left-4 w-12 h-12 z-50 pointer-events-none"
    >
      {/* Red Hat Base */}
      <path d="M10,80 Q50,-10 90,80 Z" fill="#D32F2F" />
      {/* White Pom Pom */}
      <circle cx="50" cy="5" r="8" fill="white" />
      {/* White Trim */}
      <rect x="5" y="75" width="90" height="15" rx="5" fill="white" />
    </motion.svg>
  )
}

export function KohaBird() {
  return (
    <motion.div
       className="absolute -top-8 right-0 w-12 h-12 pointer-events-none z-50"
       initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
    >
        {/* Simple stylized bird SVG */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
            <path d="M20,60 Q20,30 50,30 Q80,30 80,60 Q80,80 50,80 Q20,80 20,60 Z" fill="#111" /> {/* Body */}
            <circle cx="70" cy="45" r="3" fill="red" /> {/* Eye (Koha has red eyes) */}
            <path d="M80,45 L95,50 L80,55 Z" fill="#FFC107" /> {/* Beak */}
            <path d="M20,60 L5,50 L20,70 Z" fill="#111" /> {/* Tail */}
        </svg>
    </motion.div>
  )
}

export function VesakLantern() {
  return (
      <motion.div
        className="absolute top-full right-0 mt-2 w-10 h-16 pointer-events-none z-50 origin-top"
        initial={{ rotate: 5 }}
        animate={{ rotate: -5 }}
        transition={{ repeat: Infinity, repeatType: "mirror", duration: 2, ease: "easeInOut" }}
      >
        <svg viewBox="0 0 60 100" className="w-full h-full drop-shadow-[0_0_15px_rgba(255,165,0,0.8)]">
             {/* Main Lantern Body (Octagonal-ish) */}
             <path d="M10,20 L50,20 L60,50 L50,80 L10,80 L0,50 Z" fill="#FFD700" stroke="#ff8c00" strokeWidth="2" />
             {/* Frills */}
             <path d="M10,80 L10,100 M20,80 L20,100 M30,80 L30,100 M40,80 L40,100 M50,80 L50,100" stroke="#FFD700" strokeWidth="1" />
             {/* Rope */}
             <line x1="30" y1="0" x2="30" y2="20" stroke="white" strokeWidth="1" />
        </svg>
      </motion.div>
  )
}
