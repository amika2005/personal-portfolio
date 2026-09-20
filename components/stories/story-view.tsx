"use client"

import { useEffect, useRef } from "react"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import { CHAPTERS, pad } from "./chapters"
import { setScrollLocked } from "@/components/SmoothScroll"

type Props = { index: number; onChange: (i: number) => void; onClose: () => void }

/** A chapter opened full screen. Portalled to <body> so the pinned strip's positioning can't trap it. */
export function StoryView({ index, onChange, onClose }: Props) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const chapter = CHAPTERS[index]
  const last = CHAPTERS.length - 1

  useEffect(() => {
    setScrollLocked(true)
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    return () => {
      setScrollLocked(false)
      opener?.focus()
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key === "ArrowRight" && index < last) onChange(index + 1)
      if (e.key === "ArrowLeft" && index > 0) onChange(index - 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [index, last, onChange, onClose])

  // wipe up on open, and re-run the photo + title entrance whenever the chapter changes
  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap.from("[data-story-photo]", { clipPath: "inset(100% 0% 0% 0%)", duration: 0.9, ease: "expo.out" })
      gsap.from("[data-story-photo] img", { scale: 1.25, duration: 1.2, ease: "expo.out" })
      gsap.from("[data-story-line]", { yPercent: 110, duration: 0.9, ease: "expo.out", stagger: 0.08, delay: 0.1 })
    }, root)
    return () => ctx.revert()
  }, [index])

  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    gsap.from(root, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" })
  }, [])

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Chapter ${index + 1}: ${chapter.title}`}
      data-lenis-prevent
      data-no-reveal
      className="fixed inset-0 z-[120] overflow-y-auto bg-[#0A0A0A] text-white"
    >
      <div className="flex min-h-full flex-col gap-8 px-6 pb-10 pt-6 sm:px-10 md:grid md:grid-cols-2 md:items-center md:gap-14 lg:px-14">
        <div className="flex items-center justify-between font-mono text-xs uppercase tracking-widest md:col-span-2 md:self-start">
          <span>
            Ch. {pad(index + 1)} / {pad(CHAPTERS.length)}
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="rounded-full border-[1.5px] border-current px-4 py-2 transition-opacity hover:opacity-70"
          >
            Close ✕
          </button>
        </div>

        <div data-story-photo className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden md:max-w-none md:h-[70svh] md:w-auto">
          <img src={chapter.image} alt={chapter.title} className="h-full w-full object-cover" />
        </div>

        <div className="flex flex-col gap-6">
          <div style={{ clipPath: "inset(-0.5em -0.5em 0 -0.5em)" }}>
            <h2 data-story-line className="text-[clamp(4rem,9vw,10rem)] leading-[0.95]">
              {chapter.title}
            </h2>
          </div>
          <div style={{ clipPath: "inset(-0.5em -0.5em 0 -0.5em)" }}>
            <p data-story-line className="max-w-lg text-xl leading-snug sm:text-2xl">
              {chapter.story}
            </p>
          </div>

          <div className="mt-4 flex gap-3 font-mono text-xs uppercase tracking-widest">
            <button
              type="button"
              disabled={index === 0}
              onClick={() => onChange(index - 1)}
              className="rounded-full border-[1.5px] border-current px-4 py-2 transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              ←︎ Prev
            </button>
            <button
              type="button"
              disabled={index === last}
              onClick={() => onChange(index + 1)}
              className="rounded-full border-[1.5px] border-current px-4 py-2 transition-opacity hover:opacity-70 disabled:opacity-30"
            >
              Next →︎
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
