"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { RELEASES } from "./data"

gsap.registerPlugin(ScrollTrigger)

/** Experience and education as a git log: the line draws with the scroll and a sticky tag tracks it. */
export function Timeline() {
  const listRef = useRef<HTMLOListElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)

  useEffect(() => {
    const list = listRef.current
    const line = lineRef.current
    if (!list || !line) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      const entries = gsap.utils.toArray<HTMLElement>("[data-release]")

      if (!reduced) {
        gsap.fromTo(
          line,
          { scaleY: 0 },
          { scaleY: 1, ease: "none", scrollTrigger: { trigger: list, start: "top 65%", end: "bottom 65%", scrub: true } },
        )
      }

      entries.forEach((entry, i) => {
        ScrollTrigger.create({
          trigger: entry,
          start: "top 65%",
          end: "bottom 65%",
          onToggle: (self) => self.isActive && setActive(i),
          // a dot fills once the drawn line has reached it
          onEnter: () => entry.setAttribute("data-passed", ""),
          onLeaveBack: () => entry.removeAttribute("data-passed"),
        })
        if (reduced) return
        // rises rather than slides in from the side, which pushed the page wider than a phone
        gsap.from(entry.querySelector("[data-release-body]"), {
          y: 50,
          opacity: 0,
          duration: 0.9,
          ease: "expo.out",
          scrollTrigger: { trigger: entry, start: "top 85%", toggleActions: "play none none reverse" },
        })
      })
    }, list)

    return () => ctx.revert()
  }, [])

  const current = RELEASES[active]

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(12rem,20rem)_1fr] md:gap-16">
      {/* sticky tag that follows the log */}
      <div className="md:sticky md:top-28 md:self-start">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60">Changelog</p>
        <p className="mt-3 hidden font-display text-[clamp(3rem,6vw,6rem)] leading-[0.95] tabular-nums md:block">
          {current.version}
        </p>
        <p className="mt-2 hidden font-mono text-xs uppercase tracking-widest opacity-60 md:block">
          {current.kind}
          {current.period ? ` · ${current.period}` : ""}
        </p>
      </div>

      <ol ref={listRef} className="relative">
        <div
          aria-hidden
          className="absolute bottom-0 left-[5px] top-2 w-px"
          style={{ backgroundColor: "color-mix(in srgb, currentColor 18%, transparent)" }}
        />
        <div ref={lineRef} aria-hidden className="absolute bottom-0 left-[5px] top-2 w-px origin-top bg-current" />

        {RELEASES.map((release) => (
          <li key={release.version} data-release className="group relative pb-16 pl-10 last:pb-0">
            <span
              aria-hidden
              className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-current bg-white transition-colors duration-300 group-data-[passed]:bg-current dark:bg-gray-950"
            />
            <div data-release-body>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-widest opacity-70">
                <span>{release.version}</span>
                <span>{release.kind}</span>
                {release.period && <span>{release.period}</span>}
              </div>
              <h3 className="mt-2 font-display text-[clamp(2rem,4vw,3.75rem)] leading-[0.95]">{release.title}</h3>
              <p className="mt-2 text-lg opacity-80">{release.org}</p>
              {release.note && <p className="mt-3 max-w-xl leading-relaxed opacity-70">{release.note}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
