"use client"

import Link from "next/link"

export function ViewWorksButton() {
  return (
    <Link 
      href="/works" 
      className="relative inline-flex items-center justify-center px-6 py-3 overflow-hidden text-white rounded-md group"
    >
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-500 group-hover:from-purple-700 group-hover:to-blue-600 transition-all duration-300"></span>
      <span className="relative z-10 flex items-center gap-2 font-mono text-sm font-medium tracking-wide">
        View My Works
        <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-blue-400/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
    </Link>
  )
}
