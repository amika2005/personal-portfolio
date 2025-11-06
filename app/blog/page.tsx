import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SocialSidebar } from "@/components/social-slider"
import { blogPosts } from "./posts"



export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <CustomCursor />
      <SocialSidebar />

      <main className="relative mx-auto flex max-w-5xl gap-16 px-6 sm:px-10 lg:px-16 py-20">
        <div className="flex-1">
          <header className="flex flex-col gap-6 mb-16">
            <div className="flex flex-col gap-2 text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              <span>Welcome to my internet space!</span>
              <span>Writing about building, shipping, and thinking clearly.</span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
              Blog
              <span className="animate-blink">_</span>
            </h1>
            <p className="text-sm sm:text-base font-semibold uppercase tracking-[0.35em] text-gray-500 dark:text-gray-300 max-w-4xl leading-relaxed">
              How to Become a Good Coder in the Modern Era?
            </p>
            <p className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 max-w-5xl leading-relaxed">
            -Writing code that works is just the start. To be a great coder, write optimized, clean, and efficient code that scales and solves real problems.

Keep learning and use modern AI-powered tools to boost your skills and productivity.
            </p>
          </header>

          <section className="flex flex-col divide-y divide-gray-200 dark:divide-gray-800">
            {blogPosts.map((post) => (
              <article key={post.slug} className="py-10 first:pt-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-3 text-left"
                >
                  <div className="flex flex-col gap-2">
                    <time className="font-mono text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
                      {post.date} · {post.readingTime}
                    </time>
                    <h2 className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                      {post.title}
                    </h2>
                  </div>
                  <p className="text-base text-gray-600 dark:text-gray-300 max-w-3xl leading-relaxed">
                    {post.subtitle}
                  </p>
                </Link>
              </article>
            ))}
          </section>
        </div>

        <aside className="hidden lg:block w-48 space-y-6 pt-4">
          <div className="text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400"></div>
          <div className="flex flex-col gap-3">
            
          </div>
        </aside>
      </main>

      <Footer className="mt-8" />
    </div>
  )
}
