import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { CopyLink, PostReader } from "@/components/blog/post-reader"
import { blogPosts } from "../posts"
import { anchorFor, topicsFor } from "../topics"

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
    title: `${post.title} — Amika's Journal`,
    description: post.description,
  }
}

const hairline = { borderColor: "color-mix(in srgb, currentColor 18%, transparent)" }

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getPost(params.slug)

  if (!post) {
    notFound()
  }

  const index = blogPosts.indexOf(post)
  const no = blogPosts.length - index
  // posts are stored newest first
  const newer = blogPosts[index - 1]
  const older = blogPosts[index + 1]
  const sections = post.sections.map((section) => ({ id: anchorFor(section.heading), heading: section.heading }))

  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <CustomCursor />
      <Header />
      <div className="hidden md:block">
      </div>

      <main className="mx-auto max-w-7xl px-6 pb-24 pt-16 sm:px-10 lg:px-14">
        {/* hero */}
        <div className="border-b pb-14" style={hairline}>
          <Link href="/blog" className="font-mono text-xs uppercase tracking-widest opacity-60 transition-opacity hover:opacity-100">
            ←︎ Journal
          </Link>
          <p className="mt-10 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-widest opacity-70">
            <span>No.{String(no).padStart(2, "0")}</span>
            <span>{post.date}</span>
            <span>{post.readingTime}</span>
            {topicsFor(post.slug).map((topic) => (
              <span key={topic} className="text-[#EF3B2D]">
                #{topic}
              </span>
            ))}
          </p>
          <h1 className="mt-5 max-w-6xl text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.92]">{post.title}</h1>
          <p className="mt-8 max-w-3xl text-xl leading-relaxed opacity-75 sm:text-2xl">{post.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-12 lg:grid-cols-[15rem_1fr] lg:gap-20">
          <aside>
            <PostReader articleId="post-body" sections={sections} readingTime={post.readingTime} />
          </aside>

          <div className="max-w-3xl">
            <article id="post-body" className="space-y-16">
              {post.sections.map((section, i) => (
                <section key={section.heading} id={sections[i].id} className="scroll-mt-28 space-y-6">
                  <h2 className="text-[clamp(2rem,3.6vw,3.25rem)] leading-[0.95]">{section.heading}</h2>
                  {section.paragraphs.map((paragraph, j) => (
                    <p
                      key={j}
                      className={`text-lg leading-[1.75] opacity-80 ${
                        i === 0 && j === 0
                          ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-display first-letter:text-[4.75rem] first-letter:leading-[0.8] first-letter:text-[#EF3B2D]"
                          : ""
                      }`}
                    >
                      {paragraph}
                    </p>
                  ))}
                  {section.bullets && (
                    <ul className="space-y-3 border-l-2 border-[#EF3B2D] pl-6">
                      {section.bullets.map((bullet) => (
                        <li key={bullet} className="text-lg leading-relaxed opacity-80">
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </article>

            {post.references && post.references.length > 0 && (
              <aside className="mt-16 border-t pt-8" style={hairline}>
                <p className="font-mono text-xs uppercase tracking-widest opacity-60">Further reading</p>
                <ul className="mt-4 space-y-3">
                  {post.references.map((reference) => (
                    <li key={reference.url}>
                      <a
                        href={reference.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg underline decoration-[#EF3B2D] decoration-2 underline-offset-4 transition-opacity hover:opacity-70"
                      >
                        {reference.label} ↗︎
                      </a>
                    </li>
                  ))}
                </ul>
              </aside>
            )}

            <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t pt-8" style={hairline}>
              <p className="font-mono text-xs uppercase tracking-widest opacity-60">Thanks for reading</p>
              <CopyLink />
            </div>
          </div>
        </div>

        {/* keep reading */}
        <nav aria-label="More posts" className="mt-24 grid border-t md:grid-cols-2" style={hairline} data-no-reveal>
          {[
            { post: newer, label: "←︎ Newer" },
            { post: older, label: "Older →︎" },
          ].map(({ post: other, label }, i) =>
            other ? (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className={`group flex flex-col gap-4 border-b py-10 md:border-b-0 ${i === 1 ? "md:border-l md:pl-10 md:text-right" : "md:pr-10"}`}
                style={hairline}
              >
                <span className="font-mono text-xs uppercase tracking-widest opacity-60">{label}</span>
                <span className="font-display text-[clamp(1.9rem,3.5vw,3.25rem)] leading-[0.95] transition-colors group-hover:text-[#EF3B2D]">
                  {other.title}
                </span>
              </Link>
            ) : (
              <span key={label} className="hidden md:block" />
            ),
          )}
        </nav>
      </main>

      <Footer />
    </div>
  )
}
