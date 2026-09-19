"use client"

import Link from "next/link"
import { useEffect, useMemo, useRef, useState } from "react"
import { gsap } from "gsap"
import { TOPICS, type Topic } from "@/app/blog/topics"

export type JournalEntry = {
  slug: string
  no: number
  title: string
  subtitle: string
  date: string
  readingTime: string
  topics: Topic[]
}

const pad = (n: number) => String(n).padStart(2, "0")
const hairline = { borderColor: "color-mix(in srgb, currentColor 18%, transparent)" }

/** Typographic cover for posts that have no artwork: the issue number over the first topic. */
function Cover({ entry, className = "" }: { entry: JournalEntry; className?: string }) {
  return (
    <div className={`relative flex flex-col justify-between overflow-hidden bg-[#EF3B2D] p-5 text-[#141414] ${className}`}>
      <span className="font-mono text-[10px] uppercase tracking-widest">
        {entry.topics[0] ?? "Journal"} · {entry.date}
      </span>
      <span className="font-display text-[5.5rem] leading-[0.8]">No.{pad(entry.no)}</span>
    </div>
  )
}

export function JournalIndex({ entries }: { entries: JournalEntry[] }) {
  const [topic, setTopic] = useState<Topic | "All">("All")
  const [query, setQuery] = useState("")
  // the last hovered post stays in the card so it can fade out with its content
  const [preview, setPreview] = useState<JournalEntry | null>(null)
  const [previewing, setPreviewing] = useState(false)
  const listRef = useRef<HTMLOListElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return entries.filter(
      (e) =>
        (topic === "All" || e.topics.includes(topic)) &&
        (!q || e.title.toLowerCase().includes(q) || e.subtitle.toLowerCase().includes(q)),
    )
  }, [entries, topic, query])

  // the newest post leads as the cover story until the list is being filtered
  const browsing = topic === "All" && !query.trim()
  const [featured, ...rest] = entries
  const rows = browsing ? rest : filtered

  // rows rise in on first view and whenever the filter changes
  useEffect(() => {
    const list = listRef.current
    if (!list || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap.from("[data-row]", { y: 40, opacity: 0, duration: 0.7, ease: "expo.out", stagger: 0.05 })
    }, list)
    return () => ctx.revert()
  }, [topic, query])

  // the preview card trails the pointer (desktop pointers only)
  useEffect(() => {
    const card = previewRef.current
    if (!card || window.matchMedia("(pointer: coarse)").matches) return
    const x = gsap.quickTo(card, "x", { duration: 0.5, ease: "power3.out" })
    const y = gsap.quickTo(card, "y", { duration: 0.5, ease: "power3.out" })
    const move = (e: PointerEvent) => {
      x(e.clientX + 24)
      y(e.clientY - 120)
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [])

  return (
    <div data-no-reveal>
      {browsing && featured && (
        <Link href={`/blog/${featured.slug}`} className="group mb-20 grid gap-8 md:grid-cols-[1fr_minmax(16rem,22rem)] md:gap-12">
          <div>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60">
              Latest · No.{pad(featured.no)} · {featured.date} · {featured.readingTime}
            </p>
            <h2 className="mt-4 text-[clamp(3rem,7vw,7.5rem)] leading-[0.95] transition-colors group-hover:text-[#EF3B2D]">
              {featured.title}
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed opacity-75">{featured.subtitle}</p>
            <span className="mt-6 inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
              Read the story
              <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
          </div>
          <Cover entry={featured} className="aspect-[4/5] transition-transform duration-500 group-hover:-rotate-2" />
        </Link>
      )}

      {/* filters */}
      <div className="flex flex-col gap-4 border-y py-5 md:flex-row md:items-center md:justify-between" style={hairline}>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by topic">
          {(["All", ...TOPICS] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTopic(t)}
              aria-pressed={topic === t}
              className={`rounded-full border px-4 py-1.5 font-mono text-xs uppercase tracking-widest transition-colors ${
                topic === t ? "border-transparent bg-[#EF3B2D] text-[#141414]" : "hover:border-current"
              }`}
              style={topic === t ? undefined : hairline}
            >
              {t}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 border-b pb-1 md:w-64" style={hairline}>
          <span aria-hidden className="font-mono text-xs opacity-60">⌕</span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search the journal"
            className="w-full bg-transparent font-mono text-sm outline-none placeholder:opacity-50"
          />
        </label>
      </div>

      <ol ref={listRef} onPointerLeave={() => setPreviewing(false)}>
        {rows.map((entry) => (
          <li key={entry.slug} data-row className="border-b" style={hairline}>
            <Link
              href={`/blog/${entry.slug}`}
              onPointerEnter={() => {
                setPreview(entry)
                setPreviewing(true)
              }}
              className="group grid grid-cols-[3rem_1fr] items-baseline gap-x-4 gap-y-2 py-7 md:grid-cols-[4rem_9rem_1fr_auto] md:gap-x-8"
            >
              <span className="font-mono text-xs opacity-50">No.{pad(entry.no)}</span>
              <span className="hidden font-mono text-xs uppercase tracking-widest opacity-60 md:block">{entry.date}</span>
              <h2 className="col-start-2 text-[clamp(1.9rem,4vw,3.5rem)] leading-[0.95] transition-transform duration-500 ease-out group-hover:translate-x-3 md:col-start-auto">
                {entry.title}
              </h2>
              <span className="col-start-2 font-mono text-xs uppercase tracking-widest opacity-60 md:col-start-auto">
                <span className="md:hidden">{entry.date} · </span>
                {entry.readingTime}
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>
          </li>
        ))}
      </ol>

      {rows.length === 0 && (
        <p className="py-16 text-center font-mono text-sm opacity-60">Nothing matches that yet. Try another topic.</p>
      )}

      {/* floating preview: GSAP moves the outer box, CSS fades/scales the inner one */}
      <div ref={previewRef} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 hidden w-64 md:block">
        <div
          className={`-rotate-3 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)] transition-[opacity,transform] duration-300 ${
            previewing ? "scale-100 opacity-100" : "scale-90 opacity-0"
          }`}
        >
          {preview && (
            <>
              <Cover entry={preview} className="aspect-[4/5]" />
              <p className="bg-[#141414] p-4 text-sm leading-snug text-white">{preview.subtitle}</p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
