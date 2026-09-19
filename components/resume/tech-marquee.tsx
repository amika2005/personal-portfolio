"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

/**
 * An endless ticker that follows the scroll: it runs with the scroll direction, speeds up and
 * leans (skews) with scroll velocity, then eases back to a slow drift.
 */
export function TechMarquee({ items }: { items: string[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let x = 0
    let direction = -1
    let boost = 0
    const skewTo = gsap.quickTo(track, "skewX", { duration: 0.5, ease: "power3.out" })

    const st = ScrollTrigger.create({
      onUpdate: (self) => {
        const v = self.getVelocity()
        direction = self.direction === 1 ? -1 : 1
        boost = Math.min(Math.abs(v) / 250, 14)
        skewTo(gsap.utils.clamp(-10, 10, v / -350))
      },
    })

    // the content is rendered twice, so wrapping at half the width is seamless
    const tick = (_time: number, deltaMs: number) => {
      const half = track.scrollWidth / 2
      x += direction * (1 + boost) * deltaMs * 0.05
      if (x <= -half) x += half
      if (x > 0) x -= half
      gsap.set(track, { x })
      boost *= 0.93
      if (boost < 0.2) skewTo(0)
    }
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      st.kill()
    }
  }, [])

  return (
    <div aria-hidden className="overflow-hidden bg-[#EF3B2D] py-6 text-[#141414] sm:py-8">
      <div ref={trackRef} className="flex w-max will-change-transform">
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <span
                key={item}
                className="flex items-center font-display text-[clamp(3rem,8vw,7.5rem)] leading-none"
              >
                {item}
                <span className="mx-[0.4em] text-[0.45em]">✦</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
