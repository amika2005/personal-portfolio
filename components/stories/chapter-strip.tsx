"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { CHAPTERS, pad } from "./chapters"
import { StoryView } from "./story-view"
import { scrollToY } from "@/components/SmoothScroll"

gsap.registerPlugin(ScrollTrigger)

const LONGEST_TITLE = Math.max(...CHAPTERS.map((c) => c.title.length))

/**
 * The chapters as a film strip: on desktop the section pins and scrolling drives the strip
 * sideways; on phones the cards stack and each photo rises into place.
 */
export function ChapterStrip() {
  const sectionRef = useRef<HTMLElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const jumpRef = useRef<(i: number) => void>(() => {})
  const [active, setActive] = useState(0)
  const [open, setOpen] = useState<number | null>(null)

  useEffect(() => {
    const section = sectionRef.current
    const track = trackRef.current
    if (!section || !track) return

    const paint = (i: number) => setActive(i)

    const mm = gsap.matchMedia()

    mm.add(
      // matchMedia only runs this when one of these matches, so both widths need a query
      {
        desktop: "(min-width: 768px)",
        mobile: "(max-width: 767px)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const { desktop, reduced } = context.conditions as { desktop: boolean; reduced: boolean }
        const cards = gsap.utils.toArray<HTMLElement>("[data-chapter]", section)

        if (!desktop) {
          cards.forEach((card, i) => {
            ScrollTrigger.create({
              trigger: card,
              start: "top center",
              end: "bottom center",
              onToggle: (self) => self.isActive && paint(i),
            })
            if (!reduced) {
              // the photo rises into place as it wipes open, settling from a slight zoom
              const rise = { trigger: card, start: "top 95%", end: "top 40%", scrub: true }
              gsap.fromTo(
                card.querySelector("[data-chapter-media]"),
                { y: 120, clipPath: "inset(100% 0% 0% 0%)" },
                { y: 0, clipPath: "inset(0% 0% 0% 0%)", ease: "none", scrollTrigger: rise },
              )
              gsap.fromTo(card.querySelector("img"), { scale: 1.3 }, { scale: 1, ease: "none", scrollTrigger: rise })
            }
          })
          jumpRef.current = (i) => scrollToY(cards[i].getBoundingClientRect().top + window.scrollY - 96)
          return
        }

        const distance = () => track.scrollWidth - window.innerWidth
        const scroll = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
            // headings further down were measured before this pin added its spacer
            refreshPriority: 1,
            onUpdate: (self) => {
              if (progressRef.current) progressRef.current.style.transform = `scaleX(${self.progress})`
            },
          },
        })

        cards.forEach((card, i) => {
          const inStrip = { trigger: card, containerAnimation: scroll }

          ScrollTrigger.create({
            ...inStrip,
            start: "left center",
            end: "right center",
            onToggle: (self) => self.isActive && paint(i),
          })

          if (reduced) return
          gsap.fromTo(
            card.querySelector("[data-chapter-media]"),
            { clipPath: "inset(0% 0% 0% 100%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              ease: "none",
              scrollTrigger: { ...inStrip, start: "left 95%", end: "left 55%", scrub: true },
            },
          )
          gsap.fromTo(
            card.querySelector("img"),
            { xPercent: -8, scale: 1.15 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: { ...inStrip, start: "left right", end: "right left", scrub: true },
            },
          )
          gsap.from(card.querySelector("[data-chapter-title]"), {
            yPercent: 110,
            duration: 1,
            ease: "expo.out",
            scrollTrigger: { ...inStrip, start: "left 70%", toggleActions: "play none none reverse" },
          })
        })

        jumpRef.current = (i) => {
          const st = scroll.scrollTrigger!
          const card = cards[i]
          const x = card.offsetLeft + card.offsetWidth / 2 - window.innerWidth / 2
          const progress = gsap.utils.clamp(0, 1, x / distance())
          scrollToY(st.start + progress * (st.end - st.start))
        }

        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      },
    )

    return () => mm.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      data-no-reveal
      aria-label="Chapters"
      className="relative bg-[#0A0A0A] text-white md:h-[100svh] md:overflow-hidden"
    >
      {/* top rail */}
      <div className="pointer-events-none z-10 flex items-center justify-between px-6 pt-24 font-mono text-xs uppercase tracking-widest sm:px-10 md:absolute md:inset-x-0 md:top-0 lg:px-14">
        <span>Chapters</span>
        <span className="hidden tabular-nums md:inline">
          {pad(active + 1)} / {pad(CHAPTERS.length)}
        </span>
      </div>

      <div
        ref={trackRef}
        // the wide right padding lets the last chapter travel to the centre before the pin ends
        className="flex flex-col gap-20 px-6 pb-24 pt-10 sm:px-10 md:h-full md:w-max md:flex-row md:items-center md:gap-[6vw] md:px-0 md:py-0 md:pl-[8vw] md:pr-[40vw]"
      >
        <div className="md:w-[min(32vw,28rem)] md:shrink-0">
          <p className="font-display text-[clamp(3.5rem,7vw,7.5rem)] leading-[0.95]">
            Six chapters.
            <br />
            One story.
          </p>
          <p className="mt-6 font-mono text-xs uppercase tracking-widest opacity-70">
            <span className="hidden md:inline">Keep scrolling →︎</span>
            <span className="md:hidden">Keep scrolling ↓︎</span>
          </p>
        </div>

        {CHAPTERS.map((chapter, i) => (
          <article
            key={chapter.title}
            data-chapter
            className="w-full md:w-[min(34vw,calc((100svh_-_26rem)*0.8))] md:shrink-0"
          >
            <button
              type="button"
              onClick={() => setOpen(i)}
              className="group block w-full text-left"
              aria-label={`Chapter ${i + 1}: ${chapter.title}. Open the story`}
            >
              <div className="mb-3 flex items-baseline justify-between font-mono text-xs uppercase tracking-widest">
                <span>Ch. {pad(i + 1)}</span>
                <span className="opacity-60 transition-opacity group-hover:opacity-100">Read story +</span>
              </div>
              <div data-chapter-media className="relative aspect-[4/5] overflow-hidden bg-black/10">
                {/* hover zoom lives on this wrapper; GSAP owns the <img>'s transform for the parallax */}
                <div className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105">
                  <img
                    src={chapter.image}
                    alt={chapter.title}
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
              {/* titles share one size, set by the longest word: it may run into the gap between
                  cards, so the clip only hides the bottom edge (for the rise), never the sides */}
              <div className="mt-4" style={{ clipPath: "inset(-0.5em -100vw 0 -100vw)" }}>
                <h3
                  data-chapter-title
                  className="whitespace-nowrap font-display text-[length:min(6rem,calc((100vw_-_5rem)/(var(--chars)*0.47)))] leading-[0.95] md:text-[length:min(6rem,calc((min(34vw,calc((100svh_-_26rem)*0.8))_+_4.8vw)/(var(--chars)*0.47)))]"
                  style={{ "--chars": LONGEST_TITLE } as React.CSSProperties}
                >
                  {chapter.title}
                </h3>
              </div>
              <p className="mt-2 max-w-sm text-base leading-snug opacity-80">{chapter.story}</p>
            </button>
          </article>
        ))}
      </div>

      {/* timeline */}
      <div className="absolute inset-x-0 bottom-8 hidden px-10 md:block lg:px-14">
        <div className="relative h-px" style={{ backgroundColor: "color-mix(in srgb, currentColor 25%, transparent)" }}>
          <div ref={progressRef} className="absolute inset-0 origin-left scale-x-0 bg-current" />
        </div>
        <ol className="mt-3 flex justify-between font-mono text-[11px] uppercase tracking-widest">
          {CHAPTERS.map((chapter, i) => (
            <li key={chapter.title}>
              <button
                type="button"
                onClick={() => jumpRef.current(i)}
                className={`transition-opacity ${i === active ? "opacity-100" : "opacity-50 hover:opacity-100"}`}
                aria-current={i === active ? "step" : undefined}
              >
                {pad(i + 1)} {chapter.title}
              </button>
            </li>
          ))}
        </ol>
      </div>

      {open !== null && <StoryView index={open} onChange={setOpen} onClose={() => setOpen(null)} />}
    </section>
  )
}
