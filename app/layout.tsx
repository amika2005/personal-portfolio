import type React from "react"
import type { Metadata } from "next"
import { Inter, Teko } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { ThemeProvider } from "@/components/theme-provider"
import { Suspense } from "react"
import "./globals.css"
import SmoothScroll from "@/components/SmoothScroll"
import { SeasonalWrapper } from "@/components/seasonal/seasonal-wrapper"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const teko = Teko({
  subsets: ["latin"],
  variable: "--font-teko",
  weight: ["300", "400", "500", "600", "700"],
})

export const metadata: Metadata = {
  title: "Amika Fernando",
  description: "Portfolio of Amika Fernando, Intern Software Engineer specializing in frontend and backend development",
  icons: {
    icon:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230073ff'/></svg>",
    shortcut:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230073ff'/></svg>",
    apple:
      "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%230073ff'/></svg>",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${teko.variable} antialiased`}>
        <SmoothScroll>
          <Suspense fallback={null}>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
            <SeasonalWrapper />
            {children}
          </ThemeProvider>
        </Suspense>
        <Analytics />
        </SmoothScroll>
      </body>
    </html>
  )
}
