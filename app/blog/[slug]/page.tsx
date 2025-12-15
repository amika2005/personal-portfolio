import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { SocialSidebar } from "@/components/social-slider"
import { blogPosts } from "../posts"

const getPost = (slug: string) => blogPosts.find((post) => post.slug === slug)

type BlogPostPageProps = {
  params: {
    slug: string
  }
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }))
}

export function generateMetadata({ params }: BlogPostPageProps): Metadata {
  const post = getPost(params.slug)

  if (!post) {
    return {
      title: "Blog post not found",
    }
  }

  return {
    title: `${post.title} — Amika's Blog`,
    description: post.description,
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Header />
      <CustomCursor />
      <SocialSidebar />

      <main className="relative mx-auto flex max-w-4xl flex-col gap-12 px-6 sm:px-10 lg:px-12 py-20">
        <div className="flex flex-col gap-6">
          <Link
            href="/blog"
            className="font-mono text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            ← Back to all posts
          </Link>

          <time className="font-mono text-xs uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
            {post.date} · {post.readingTime}
          </time>
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
            {post.title}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            {post.subtitle}
          </p>
        </div>

        <article className="space-y-12">
          {post.sections.map((section) => (
            <section key={section.heading} className="space-y-6">
              <div className="space-y-2">
                <h2 className="font-mono text-xl sm:text-2xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph, index) => (
                  <p key={index} className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
              {section.bullets && (
                <ul className="list-disc list-inside text-base sm:text-lg text-gray-600 dark:text-gray-300 space-y-2">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </article>

        {post.references && post.references.length > 0 && (
          <aside className="space-y-4 border-t border-gray-200 dark:border-gray-800 pt-8">
            <h3 className="font-mono text-sm uppercase tracking-[0.35em] text-gray-500 dark:text-gray-400">
              Further reading
            </h3>
            <ul className="space-y-3">
              {post.references.map((reference) => (
                <li key={reference.url}>
                  <a
                    href={reference.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-base text-sky-600 dark:text-sky-400 hover:underline"
                  >
                    {reference.label}
                  </a>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </main>

      <Footer className="mt-8" />
    </div>
  )
}
