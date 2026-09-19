"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { cn } from "@/lib/utils"
import { scrollToTop } from "@/components/SmoothScroll"
import { RollText } from "@/components/ui/roll-text"
import { ColomboClock } from "@/components/ui/colombo-clock"

gsap.registerPlugin(ScrollTrigger)

// Same red and ink as the intro, so the site opens and closes on the same cut
const BG = "#EF3B2D"
const INK = "#141414"
const EMAIL = "amikafernando123@gmail.com"
const WORDMARK = "AMIKA FERNANDO"
// Hides text rising from below while leaving the top and sides free, so Anton's tall
// glyphs aren't cropped the way overflow: hidden crops them at tight line-heights
const RISE_CLIP = { clipPath: "inset(-0.5em -0.5em 0 -0.5em)" }

const MENU = [
  { name: "Home", href: "/" },
  { name: "Resume", href: "/resume" },
  { name: "Stories", href: "/stories" },
  { name: "Blog", href: "/blog" },
]

const SOCIALS = [
  { name: "GitHub", href: "https://github.com/amika2005" },
  { name: "Instagram", href: "https://www.instagram.com/a4amiiika?igsh=OHprMDI3aTdrdW94" },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=100077444513727" },
  { name: "WhatsApp", href: "https://wa.me/+94757975856" },
]

function FooterLink({ href, name, external }: { href: string; name: string; external?: boolean }) {
  const className = "group flex items-center justify-between gap-3 border-b py-2 text-lg sm:text-xl"
  const style = { borderColor: "color-mix(in srgb, currentColor 25%, transparent)" }
  const body = (
    <>
      <RollText text={name} />
      <span
        aria-hidden
        className="-translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100"
      >
        ↗
      </span>
    </>
  )

  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className} style={style}>
      {body}
    </a>
  ) : (
    <Link href={href} className={className} style={style}>
      {body}
    </Link>
  )
}

export function Footer({ className }: { className?: string }) {
  const wrapRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const wordmarkRef = useRef<HTMLParagraphElement>(null)
  const topBtnRef = useRef<HTMLButtonElement>(null)
  // null until measured; "reveal" pins the footer under the page, "flow" is for screens it doesn't fit
  const [layout, setLayout] = useState<{ height: number; mode: "reveal" | "flow" } | null>(null)
  const [copied, setCopied] = useState(false)

  // Measure the footer so its clip wrapper is exactly as tall as it, and fit the wordmark edge to edge
  useEffect(() => {
    const panel = panelRef.current
    const wordmark = wordmarkRef.current
    if (!panel || !wordmark) return

    const measure = () => {
      wordmark.style.fontSize = "100px"
      const box = wordmark.parentElement!
      const cs = getComputedStyle(box)
      const target = box.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight)
      const fitWidth = (100 * target) / wordmark.scrollWidth
      wordmark.style.fontSize = `${fitWidth}px`

      // On wide-but-short screens the edge-to-edge wordmark makes the footer taller than the
      // viewport, which pushes its top row up under the sticky navbar. Give up some width instead.
      // Only when a modest shrink gets it to fit; otherwise it becomes a normal footer anyway.
      const overflow = panel.offsetHeight - window.innerHeight
      const shrunk = fitWidth - overflow / 0.9
      if (overflow > 0 && shrunk >= fitWidth * 0.55) wordmark.style.fontSize = `${shrunk}px`

      const height = panel.offsetHeight
      setLayout({ height, mode: height <= window.innerHeight ? "reveal" : "flow" })
    }

    measure()
    document.fonts.ready.then(measure)
    const ro = new ResizeObserver(measure)
    ro.observe(panel)
    window.addEventListener("resize", measure)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", measure)
    }
  }, [])

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap || !layout) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const ctx = gsap.context(() => {
      const replay = { trigger: wrap, toggleActions: "play none none reverse" }

      if (layout.mode === "reveal") {
        // content drifts up as the page lifts off it, so it feels like it was underneath all along
        gsap.fromTo(
          "[data-footer-content]",
          { yPercent: -25 },
          { yPercent: 0, ease: "none", scrollTrigger: { trigger: wrap, start: "top bottom", end: "bottom bottom", scrub: true } },
        )
      }

      gsap.from("[data-wordmark-char]", {
        yPercent: 110,
        duration: 1.2,
        ease: "expo.out",
        stagger: 0.035,
        scrollTrigger: { ...replay, start: "top 85%" },
      })
      gsap.from("[data-cta-line]", {
        yPercent: 110,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: { ...replay, start: "top 45%" },
      })
      gsap.from("[data-term-char]", {
        opacity: 0,
        duration: 0.01,
        stagger: 0.035,
        ease: "none",
        scrollTrigger: { ...replay, start: "top 35%" },
      })
    }, wrap)

    return () => ctx.revert()
  }, [layout?.mode])

  // magnetic back-to-top button
  useEffect(() => {
    const btn = topBtnRef.current
    if (!btn || window.matchMedia("(pointer: coarse)").matches) return
    const x = gsap.quickTo(btn, "x", { duration: 0.6, ease: "power3.out" })
    const y = gsap.quickTo(btn, "y", { duration: 0.6, ease: "power3.out" })
    const move = (e: MouseEvent) => {
      const r = btn.getBoundingClientRect()
      x((e.clientX - (r.left + r.width / 2)) * 0.35)
      y((e.clientY - (r.top + r.height / 2)) * 0.35)
    }
    const leave = () => {
      x(0)
      y(0)
    }
    btn.addEventListener("mousemove", move)
    btn.addEventListener("mouseleave", leave)
    return () => {
      btn.removeEventListener("mousemove", move)
      btn.removeEventListener("mouseleave", leave)
    }
  }, [])

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {}
  }

  const reveal = layout?.mode !== "flow"

  return (
    <footer
      ref={wrapRef}
      data-no-reveal
      className={cn("relative", className)}
      // the clip-path confines the fixed panel to this box, so it's only seen as the page scrolls off it
      style={
        reveal
          ? { height: layout ? layout.height : "100svh", clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }
          : undefined
      }
    >
      <div
        ref={panelRef}
        className={cn("left-0 w-full overflow-hidden", reveal ? "fixed bottom-0" : "relative")}
        style={{ background: BG, color: INK }}
      >
        <div data-footer-content className="flex flex-col gap-8 px-6 pt-[4.5rem] sm:gap-10 sm:px-10 sm:pt-20 lg:px-14">
          {/* status bar */}
          <div className="font-mono text-xs uppercase tracking-widest">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-8">
              <span className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#141414] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#141414]" />
                </span>
                Available for work
              </span>
              <span>
                Colombo, LK — <ColomboClock />
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-y-10 md:grid-cols-[1.7fr_1fr_1fr] md:gap-x-12">
            {/* CTA */}
            <div className="col-span-2 md:col-span-1">
              <p className="mb-3 font-mono text-xs uppercase tracking-widest opacity-70">Have an idea?</p>
              <a href={`mailto:${EMAIL}`} className="group inline-block">
                {/* Anton's caps are 0.87em tall, so anything under ~0.95 stacks the two lines on each other */}
                <h2 className="text-[clamp(3.25rem,7.5vw,8.5rem)] leading-[0.95]">
                  <span className="block" style={RISE_CLIP}>
                    <span data-cta-line className="block">
                      Let&apos;s make
                    </span>
                  </span>
                  <span className="block" style={RISE_CLIP}>
                    <span data-cta-line className="flex items-center gap-[0.15em]">
                      it click
                      <span
                        aria-hidden
                        className="inline-block text-[0.6em] transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)] group-hover:-translate-y-[0.1em] group-hover:translate-x-[0.1em] group-hover:rotate-45"
                      >
                        ↗
                      </span>
                    </span>
                  </span>
                </h2>
              </a>
              <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-4">
                <a href={`mailto:${EMAIL}`} className="group text-[0.95rem] sm:text-2xl">
                  <RollText text={EMAIL} stagger={0.008} />
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  className="rounded-full border-[1.5px] border-current px-3 py-1.5 font-mono sm:px-4 text-xs uppercase tracking-widest transition-colors hover:bg-[#141414] hover:text-[#EF3B2D]"
                >
                  {copied ? "Copied ✓" : "Copy"}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-8">
              <nav aria-label="Footer">
                <p className="mb-3 font-mono text-xs uppercase tracking-widest opacity-70">Menu</p>
                {MENU.map((item) => (
                  <FooterLink key={item.name} {...item} />
                ))}
              </nav>
              <pre aria-hidden className="hidden font-mono text-xs leading-relaxed sm:block">
                <span className="opacity-70">$ </span>
                {'echo "thanks for scrolling"'.split("").map((c, i) => (
                  <span key={i} data-term-char>
                    {c}
                  </span>
                ))}
                {"\n"}
                {"thanks for scrolling".split("").map((c, i) => (
                  <span key={`o${i}`} data-term-char>
                    {c}
                  </span>
                ))}
                <span className="ml-1 inline-block h-[1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-[#141414]" />
              </pre>
            </div>

            <div>
              <p className="mb-3 font-mono text-xs uppercase tracking-widest opacity-70">Socials</p>
              {SOCIALS.map((item) => (
                <FooterLink key={item.name} {...item} external />
              ))}
              {/* down here rather than in the top row, where it sat under the sticky navbar */}
              <div className="mt-5 flex justify-end sm:mt-8">
                <button
                  ref={topBtnRef}
                  type="button"
                  onClick={scrollToTop}
                  aria-label="Back to top"
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#141414] text-[10px] text-[#EF3B2D] transition-transform hover:scale-110 sm:h-20 sm:w-20"
                >
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-lg leading-none">↑</span>
                    Top
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* the intro's cut, echoed */}
          <div aria-hidden className="relative -mx-6 h-3 sm:-mx-10 lg:-mx-14">
            <div className="absolute left-[-5%] top-0 h-full w-[110%] -rotate-1 bg-[#141414]" />
          </div>
        </div>

        {/* edge-to-edge wordmark (centred when it has to shrink to fit the screen's height) */}
        <div className="px-6 pt-2 text-center sm:px-10 lg:px-14" style={RISE_CLIP}>
          <p
            ref={wordmarkRef}
            aria-label={WORDMARK}
            className="inline-block whitespace-nowrap font-display leading-[0.9]"
          >
            {WORDMARK.split("").map((c, i) => (
              <span key={i} aria-hidden data-wordmark-char className="inline-block">
                {c === " " ? " " : c}
              </span>
            ))}
          </p>
        </div>

        <div className="flex flex-wrap justify-between gap-2 px-6 pb-4 pt-2 font-mono text-[10px] uppercase tracking-widest opacity-70 sm:px-10 lg:px-14">
          <span>© {new Date().getFullYear()} Amika Fernando</span>
          <span>Designed &amp; built in Sri Lanka</span>
        </div>
      </div>
    </footer>
  )
}
