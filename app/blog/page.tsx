import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SocialSidebar } from "@/components/social-slider"
import { JournalIndex, type JournalEntry } from "@/components/blog/journal-index"
import { blogPosts } from "./posts"
import { topicsFor } from "./topics"

export const metadata: Metadata = {
  title: "Journal — Amika Fernando",
  description: "Essays on AI, engineering craft and the way we build software.",
}

export default function BlogPage() {
  // posts are stored newest first; number them like issues, oldest = No.01
  const entries: JournalEntry[] = blogPosts.map((post, i) => ({
    slug: post.slug,
    no: blogPosts.length - i,
    title: post.title,
    subtitle: post.subtitle,
    date: post.date,
    readingTime: post.readingTime,
    topics: topicsFor(post.slug),
  }))

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <CustomCursor />
      <Header />
      <div className="hidden md:block">
        <SocialSidebar />
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-32 pt-20 sm:px-10 lg:px-14">
        <header className="mb-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60">Amika Fernando — Writing</p>
            <h1 className="mt-4 text-[clamp(5.5rem,21vw,19rem)] leading-[0.9]">Journal</h1>
          </div>
          <p className="max-w-xs font-mono text-xs uppercase leading-relaxed tracking-widest opacity-70 md:pb-6 md:text-right">
            {blogPosts.length} essays on AI, craft &amp; the way we build software
          </p>
        </header>

        <JournalIndex entries={entries} />
      </main>

      <Footer />
    </div>
  )
}
