"use client"

import { useEffect, useRef } from "react"
import Image from "next/image"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

type Step = {
  title: string
  description: string
  caption: string
  tags: string
  media: string
  type: "video" | "image"
  bg: string
  fg: string
  poster: string
  tilt: number
}

const STEPS: Step[] = [
  {
    title: "Research",
    description:
      "Every build starts with questions. I dig into user needs, business goals and the data behind them, so the product solves the right problem before a single pixel is drawn.",
    caption: "Understand the problem",
    tags: "interviews / data / insight",
    media: "/research.mp4",
    type: "video",
    bg: "#0A0A0A",
    fg: "#FFFFFF",
    poster: "#EF3B2D",
    tilt: 3,
  },
  {
    title: "Wireframe",
    description:
      "Next comes the skeleton. I map flows and layouts in low fidelity to shape seamless user journeys, testing structure early while changes are still cheap.",
    caption: "Map the journey",
    tags: "flows / layout / structure",
    media: "/wireframe.webp",
    type: "image",
    bg: "#9489D6",
    fg: "#0A0A0A",
    poster: "#0A0A0A",
    tilt: -4,
  },
  {
    title: "UI Design",
    description:
      "Then the skeleton gets a skin. Type, colour and spacing come together into interfaces that feel clear, consistent and a little bit bold.",
    caption: "Make it beautiful",
    tags: "type / colour / systems",
    media: "/UI_design.jpg",
    type: "image",
    bg: "#EF3B2D",
    fg: "#0A0A0A",
    poster: "#F2EFE9",
    tilt: 4,
  },
  {
    title: "Prototype",
    description:
      "Designs become something you can click. High-fidelity prototypes let us feel the product, catch friction and validate ideas with real people.",
    caption: "Make it real",
    tags: "clickable / testable / validated",
    media: "/Prototype.webp",
    type: "image",
    bg: "#BEEF00",
    fg: "#0A0A0A",
    poster: "#0A0A0A",
    tilt: -3,
  },
  {
    title: "Interaction",
    description:
      "Finally, motion. Micro-interactions and transitions that respond to every scroll, hover and tap, so the whole experience feels alive.",
    caption: "Make it move",
    tags: "motion / feedback / delight",
    media: "/interaction.mp4",
    type: "video",
    bg: "#F2EFE9",
    fg: "#0A0A0A",
    poster: "#9489D6",
    tilt: 3,
  },
]

const pad = (n: number) => String(n).padStart(2, "0")

function Poster({ step, index }: { step: Step; index: number }) {
  const onPoster = step.poster === "#0A0A0A" ? "#FFFFFF" : "#0A0A0A"

  return (
    <div
      data-poster
      className="relative aspect-[4/5] w-[min(76vw,calc((100svh_-_27rem)*0.75))] md:w-[min(34vw,30rem)] shadow-[0_30px_80px_-20px_rgba(0,0,0,0.55)]"
      style={{ background: step.poster, color: onPoster, transform: `rotate(${step.tilt}deg)` }}
    >
      <div className="absolute inset-[6%] overflow-hidden">
        {step.type === "video" ? (
          <video
            data-media
            src={step.media}
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover"
          />
        ) : (
          <Image src={step.media} alt={step.title} fill sizes="(min-width: 768px) 30rem, 64vw" className="object-cover" />
        )}
      </div>
      <span className="absolute left-[6%] top-[1.5%] font-mono text-[10px] uppercase tracking-[0.2em] sm:text-xs">
        Step {pad(index + 1)} / {pad(STEPS.length)}
      </span>
      <div className="absolute inset-x-[6%] bottom-[1%] flex items-end justify-between gap-4">
        <span className="pb-[3%] font-mono text-[10px] lowercase tracking-wide sm:text-xs">{step.tags}</span>
        <span className="font-display text-5xl leading-none sm:text-7xl">{pad(index + 1)}</span>
      </div>
    </div>
  )
}

export function ProcessSection() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    // play the heavy videos only while their panel is on screen
    const videos = Array.from(section.querySelectorAll<HTMLVideoElement>("video[data-media]"))
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(({ target, isIntersecting }) => {
          const video = target as HTMLVideoElement
          if (isIntersecting) video.play().catch(() => {})
          else video.pause()
        }),
      { threshold: 0.25 },
    )
    videos.forEach((v) => io.observe(v))

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const ctx = gsap.context(() => {
      if (reduced) return
      const header = section.querySelector<HTMLElement>("[data-process-header]")!
      const panels = gsap.utils.toArray<HTMLElement>("[data-step]")

      // Sticky panels report shifted positions once they're stuck, so measure where each
      // panel naturally starts (header + the panels before it) from the section's top instead.
      const panelTop = (i: number) => header.offsetHeight + i * panels[0].offsetHeight
      const entering = (i: number) => ({
        trigger: section,
        start: () => `top+=${panelTop(i)} bottom`,
        end: () => `top+=${panelTop(i)} top`,
        scrub: true,
        invalidateOnRefresh: true,
      })

      panels.forEach((panel, i) => {
        // the poster settles from a steeper tilt as its panel slides up
        gsap.from(panel.querySelector("[data-poster]"), {
          yPercent: 25,
          rotation: `+=${i % 2 ? -10 : 10}`,
          ease: "none",
          scrollTrigger: entering(i),
        })

        // the panel underneath recedes and darkens while the next one covers it
        if (i === panels.length - 1) return
        gsap
          .timeline({ scrollTrigger: entering(i + 1) })
          .to(panel.querySelector("[data-step-inner]"), { scale: 0.92, ease: "none" }, 0)
          .to(panel.querySelector("[data-step-shade]"), { opacity: 0.6, ease: "none" }, 0)
      })
    }, section)

    return () => {
      io.disconnect()
      ctx.revert()
    }
  }, [])

  return (
    <section ref={sectionRef} className="relative">
      {/* sticks so the first panel slides up over it */}
      <div data-process-header className="sticky top-0 flex h-[38svh] items-end justify-center bg-white pb-[5svh] dark:bg-gray-950 md:h-[70vh] md:pb-[8vh]">
        <h2 className="text-center text-[clamp(4rem,12vw,11rem)] text-gray-900 dark:text-white">My Process</h2>
      </div>

      {STEPS.map((step, i) => (
        <article
          key={step.title}
          data-step
          className="sticky top-0 h-[100svh] overflow-hidden"
          style={{ background: step.bg, color: step.fg }}
        >
          {/* One grid, two arrangements: phones stack title → poster → copy → caption,
              desktop puts the copy on the left and the poster on the right. pt clears the navbar. */}
          <div
            data-step-inner
            className="relative grid h-full grid-cols-[1fr_auto] grid-rows-[auto_minmax(0,1fr)_auto_auto] gap-x-4 gap-y-5 px-6 pb-8 pt-20 [grid-template-areas:'title_num'_'poster_poster'_'desc_desc'_'cap_cap'] sm:px-10 md:grid-cols-2 md:grid-rows-[auto_auto_minmax(0,1fr)_auto_auto] md:gap-x-10 md:gap-y-6 md:pb-10 md:pt-24 md:[grid-template-areas:'num_poster'_'desc_poster'_'._poster'_'title_poster'_'cap_poster'] lg:px-14"
          >
            <span className="grid h-11 w-11 place-items-center self-start justify-self-end rounded-full border-[1.5px] border-current text-base [grid-area:num] sm:h-14 sm:w-14 sm:text-lg md:justify-self-start">
              {i + 1}
            </span>

            <p data-reveal className="max-w-xl text-[0.95rem] leading-snug [grid-area:desc] sm:text-xl md:text-2xl">
              {step.description}
            </p>

            {/* sized from the word's length so every title fills its space without clipping */}
            <h3
              data-reveal
              className="self-start whitespace-nowrap font-display text-[length:min(9rem,calc((100vw_-_7rem)/(var(--chars)*0.5)))] leading-[0.85] [grid-area:title] md:self-end md:text-[length:min(12.5rem,calc((50vw_-_5rem)/(var(--chars)*0.5)))]"
              style={{ "--chars": step.title.length } as React.CSSProperties}
            >
              {step.title}
            </h3>

            <div
              className="flex items-center justify-between border-t pt-4 text-base [grid-area:cap] sm:text-xl"
              style={{ borderColor: "color-mix(in srgb, currentColor 30%, transparent)" }}
            >
              <span>{step.caption}</span>
              <span aria-hidden className="font-mono text-sm opacity-70">
                {pad(i + 1)} — {pad(STEPS.length)}
              </span>
            </div>

            <div className="flex min-h-0 items-center justify-center [grid-area:poster] md:justify-end">
              <Poster step={step} index={i} />
            </div>
          </div>
          <div data-step-shade className="pointer-events-none absolute inset-0 bg-black opacity-0" />
        </article>
      ))}
    </section>
  )
}
