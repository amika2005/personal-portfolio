import type React from "react"
import type { Metadata } from "next"
import { Anton, Inter } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import { TextReveal } from "@/components/text-reveal"
import { PageTransition } from "@/components/page-transition"
import { SeasonalWrapper } from "@/components/seasonal/seasonal-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const anton = Anton({
  subsets: ["latin"],
  variable: "--font-display",
  weight: "400",
})

export const metadata: Metadata = {
  title: "Amika Fernando",
  description: "Portfolio of Amika Fernando, Software Engineer specializing in frontend and backend development",
  // the tab icon is app/icon.svg — the wordmark's A in the site red
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${anton.variable} antialiased`}>
        <SmoothScroll>
          <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange={false}>
            <SeasonalWrapper />
            {children}
            {/* before TextReveal: its layout effect must hold the reveals first */}
            <PageTransition />
            <TextReveal />
          </ThemeProvider>
        </Suspense>
        <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
