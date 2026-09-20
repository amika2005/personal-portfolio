"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import useIsomorphicLayoutEffect from "@/hooks/use-isomorphic-layout-effect"
import { onRevealsReady } from "@/lib/reveal-gate"
import { ColomboClock } from "@/components/ui/colombo-clock"

gsap.registerPlugin(ScrollTrigger)

const EMAIL = "amikafernando123@gmail.com"
// bottom-only clip: hides letters rising from below without cropping Anton's tall glyphs
const RISE_CLIP = { clipPath: "inset(-0.5em -100vw 0 -100vw)" }
// both lines share one size: as wide as the viewport allows, but short enough to leave room
// for the top row and bottom bar on short screens
const NAME_SIZE = "text-[length:min(calc((100vw_-_3rem)/3.9),30svh)] md:text-[length:min(calc((100vw_-_7rem)/3.9),30svh)]"

const Word = ({ text }: { text: string }) => (
  <span className="block" style={RISE_CLIP}>
    <span className="block">
      {text.split("").map((c, i) => (
        <span key={i} data-hero-char className="inline-block">
          {c}
        </span>
      ))}
    </span>
  </span>
)

/**
 * Full-screen hero: the name set edge to edge, the illustration standing in front of it.
 * The pointer moves the layers at different depths; scrolling pulls the name apart.
 */
export function HeroSection() {
  const rootRef = useRef<HTMLElement>(null)
  const ctaRef = useRef<HTMLAnchorElement>(null)
  const ringRef = useRef<SVGSVGElement>(null)

  // hide everything before first paint, then play the entrance once any cover (intro/transition) lifts
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const ctx = gsap.context(() => {
      if (reduced) return
      gsap.set("[data-hero-char]", { yPercent: 110 })
      gsap.set("[data-hero-figure-in]", { yPercent: 18, opacity: 0 })
      gsap.set("[data-hero-fade]", { y: 24, opacity: 0 })
    }, root)

    const unsubscribe = onRevealsReady(() => {
      if (reduced) return
      ctx.add(() => {
        gsap
          .timeline()
          .to("[data-hero-char]", { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.035 })
          .to("[data-hero-figure-in]", { yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out" }, 0.15)
          .to("[data-hero-fade]", { y: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.08 }, 0.5)
      })
    })

    return () => {
      unsubscribe()
      ctx.revert()
    }
  }, [])

  // scroll: the name parts, the figure lifts and recedes
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ scrollTrigger: { trigger: root, start: "top top", end: "bottom top", scrub: true } })
        .to("[data-hero-first]", { xPercent: -35, ease: "none" }, 0)
        .to("[data-hero-last]", { xPercent: 35, ease: "none" }, 0)
        .to("[data-hero-figure]", { yPercent: -12, scale: 0.9, ease: "none" }, 0)
        .to("[data-hero-callout]", { opacity: 0, ease: "none" }, 0)
    }, root)
    return () => ctx.revert()
  }, [])

  // pointer: layers drift at different depths (desktop pointers only)
  useEffect(() => {
    const root = rootRef.current
    if (!root || window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return
    const layers = [
      { el: root.querySelector("[data-hero-name]"), depth: -14 },
      { el: root.querySelector("[data-hero-parallax]"), depth: 26 },
    ].map(({ el, depth }) => ({
      depth,
      x: gsap.quickTo(el, "x", { duration: 1, ease: "power3.out" }),
      y: gsap.quickTo(el, "y", { duration: 1, ease: "power3.out" }),
    }))
    const move = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5
      const ny = e.clientY / window.innerHeight - 0.5
      layers.forEach((l) => {
        l.x(nx * l.depth)
        l.y(ny * l.depth)
      })
    }
    window.addEventListener("pointermove", move)
    return () => window.removeEventListener("pointermove", move)
  }, [])

  // "Let's talk": a slowly turning text ring that spins up on hover, plus a magnetic pull
  useEffect(() => {
    const cta = ctaRef.current
    const ring = ringRef.current
    if (!cta || !ring || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    const spin = gsap.to(ring, { rotation: 360, duration: 14, ease: "none", repeat: -1, transformOrigin: "50% 50%" })
    const fast = () => gsap.to(spin, { timeScale: 4, duration: 0.6, ease: "power2.out" })
    const slow = () => gsap.to(spin, { timeScale: 1, duration: 0.8, ease: "power2.out" })
    cta.addEventListener("pointerenter", fast)
    cta.addEventListener("pointerleave", slow)
    return () => {
      cta.removeEventListener("pointerenter", fast)
      cta.removeEventListener("pointerleave", slow)
      spin.kill()
    }
  }, [])

  useEffect(() => {
    const cta = ctaRef.current
    if (!cta || window.matchMedia("(pointer: coarse)").matches) return
    const x = gsap.quickTo(cta, "x", { duration: 0.6, ease: "power3.out" })
    const y = gsap.quickTo(cta, "y", { duration: 0.6, ease: "power3.out" })
    const move = (e: PointerEvent) => {
      const r = cta.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.3)
      y((e.clientY - (r.top + r.height / 2)) * 0.3)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    cta.addEventListener("pointermove", move)
    cta.addEventListener("pointerleave", leave)
    return () => {
      cta.removeEventListener("pointermove", move)
      cta.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <section
      ref={rootRef}
      data-intro-reveal
      data-no-reveal
      // the sticky navbar sits above, so the hero takes the rest of the screen
      className="relative h-[calc(100svh-4rem)] min-h-[560px] overflow-hidden text-gray-900 dark:text-white"
    >
      {/* top row */}
      <div
        data-hero-fade
        className="absolute inset-x-0 top-5 z-20 flex items-center justify-between px-6 font-mono text-[11px] uppercase tracking-widest sm:px-10 sm:text-xs lg:px-14"
      >
        <span>(01) Software Engineer</span>
        <span className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF3B2D] opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-[#EF3B2D]" />
          </span>
          <span className="hidden sm:inline">Colombo, LK —</span> <ColomboClock />
        </span>
      </div>

      {/* the name, behind the illustration */}
      <h1
        data-hero-name
        aria-label="Amika Fernando"
        className={`absolute inset-x-0 top-[20%] z-0 px-6 font-display leading-[0.86] sm:px-10 md:top-16 lg:px-14 ${NAME_SIZE}`}
      >
        <span data-hero-first className="block will-change-transform" aria-hidden>
          <Word text="AMIKA" />
        </span>
        <span data-hero-last className="block text-right will-change-transform" aria-hidden>
          <Word text="FERNANDO" />
        </span>
      </h1>

      {/* the illustration, in front of the name */}
      {/* centred by flex rather than a translate, since GSAP owns the figure's transform */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex justify-center">
        {/* tall enough on phones too that the figure overlaps the name, as on desktop */}
        <div data-hero-figure className="h-[70svh] will-change-transform md:h-[80svh]">
          <div data-hero-parallax className="relative h-full">
            <div data-hero-figure-in className="relative h-full">
              <img
                src="/hero-developer.webp"
                alt="Illustration of Amika"
                width={1024}
                height={1536}
                className="h-full w-auto max-w-none select-none object-contain"
                draggable={false}
              />
              {/* callouts pinned to the figure, low enough to clear the name behind it */}
              <span
                data-hero-callout
                className="absolute right-full top-[66%] mr-2 hidden items-center whitespace-nowrap gap-3 font-mono text-xs uppercase tracking-widest md:flex"
              >
                (01) Developing
                <span aria-hidden className="h-px w-16 bg-current lg:w-24" />
              </span>
              <span
                data-hero-callout
                className="absolute left-full top-[76%] ml-2 hidden items-center whitespace-nowrap gap-3 font-mono text-xs uppercase tracking-widest md:flex"
              >
                <span aria-hidden className="h-px w-16 bg-current lg:w-24" />
                (02) Designing
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* bottom bar */}
      <div className="absolute inset-x-0 bottom-6 z-20 flex items-end justify-between gap-6 px-6 sm:bottom-8 sm:px-10 lg:px-14">
        <p data-hero-fade className="hidden max-w-xs text-base leading-relaxed opacity-80 md:block">
          Software Engineer at Infinit Tech Systems, building complex applications with cutting-edge technologies.
        </p>
        <span data-hero-fade className="font-mono text-[11px] uppercase tracking-widest opacity-70 md:hidden">
          Scroll ↓︎
        </span>
        <div data-hero-fade className="flex items-center gap-6">
          <span className="hidden font-mono text-xs uppercase tracking-widest opacity-70 md:inline">Scroll ↓︎</span>
          <a
            ref={ctaRef}
            href={`mailto:${EMAIL}`}
            aria-label="Let's talk: email Amika"
            className="group relative grid h-24 w-24 place-items-center md:h-32 md:w-32"
          >
            {/* the text ring turns on its own; GSAP speeds it up on hover */}
            <svg ref={ringRef} aria-hidden viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
              <defs>
                <path id="talk-ring" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
              </defs>
              {/* textLength spreads the phrase evenly round the whole ring (circumference ≈ 239) */}
              <text className="fill-current font-mono text-[10px] uppercase" letterSpacing="1">
                <textPath href="#talk-ring" textLength="236" lengthAdjust="spacing">
                  Let&apos;s talk • Let&apos;s talk •
                </textPath>
              </text>
            </svg>
            <span
              aria-hidden
              className="grid h-10 w-10 place-items-center rounded-full bg-[#EF3B2D] text-lg text-[#141414] transition-transform duration-500 ease-out group-hover:scale-125 group-hover:rotate-45 md:h-14 md:w-14 md:text-2xl"
            >
              ↗︎
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}
