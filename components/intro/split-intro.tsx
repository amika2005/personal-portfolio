"use client"

import { useRef, useState } from "react"
import { gsap } from "gsap"
import useIsomorphicLayoutEffect from "@/hooks/use-isomorphic-layout-effect"
import { holdReveals } from "@/lib/reveal-gate"

// module state survives client-side navigation but resets on a full reload,
// so the intro plays on refresh/first visit and not when navigating back home
let playedThisLoad = false

/** The intro only opens the site; once the visitor has navigated, coming home shouldn't replay it. */
export function skipIntro() {
  playedThisLoad = true
}

const BG = "#EF3B2D"
const INK = "#141414"
// the cut is tilted: the bar rotates by -TILT, and the panel clip-paths rise by tan(TILT) * 100vw across the screen
const TILT = 6
const RISE = `${(Math.tan((TILT * Math.PI) / 180) * 50).toFixed(2)}vw`

type Token = { t: string; dim?: boolean }
const CODE: Token[][] = [
  [{ t: "# portfolio.py", dim: true }],
  [{ t: "from amika import Engineer" }],
  [],
  [{ t: 'dev = Engineer(name="Amika Fernando")' }],
  [{ t: 'dev.stack = ["Next.js", "Python", "AI"]' }],
  [{ t: "dev.build(ideas, with_love=True)" }],
  [],
  [{ t: ">>> compiling experience...", dim: true }],
]

function Panel({ side }: { side: "top" | "bottom" }) {
  return (
    <div
      data-panel={side}
      className="absolute inset-0 flex flex-col items-center justify-center"
      style={{
        background: BG,
        color: INK,
        clipPath:
          side === "top"
            ? // overlaps the bottom panel by 2px so the anti-aliased diagonal edges don't leave a seam
              `polygon(0 0, 100% 0, 100% calc(50% - ${RISE} + 2px), 0 calc(50% + ${RISE} + 2px))`
            : `polygon(0 calc(50% + ${RISE}), 100% calc(50% - ${RISE}), 100% 100%, 0 100%)`,
      }}
    >
      <pre
        aria-hidden
        data-code
        className="w-[min(92vw,34rem)] font-mono text-[clamp(0.8rem,2.6vw,1.05rem)] leading-relaxed"
      >
        {CODE.map((line, i) => (
          <div key={i} className="min-h-[1.6em] whitespace-pre">
            {line.map((tok, j) =>
              tok.t.split("").map((char, k) => (
                <span key={`${j}-${k}`} data-char style={{ opacity: 0 }}>
                  <span className={tok.dim ? "opacity-50" : undefined}>{char}</span>
                </span>
              )),
            )}
            {i === CODE.length - 1 && (
              // GSAP fades the outer span; the pulse lives on the inner one because a CSS
              // animation's opacity would otherwise override GSAP's inline opacity: 0
              <span data-caret className="ml-1 inline-block translate-y-[0.2em]" style={{ opacity: 0 }}>
                <span className="block h-[1.1em] w-[0.55em] animate-pulse" style={{ background: INK }} />
              </span>
            )}
          </div>
        ))}
      </pre>

      <div className="absolute inset-x-0 bottom-[8vh] flex flex-col items-center gap-3 text-center">
        <div className="flex w-[min(60vw,14rem)] justify-between font-mono text-[11px] uppercase tracking-widest">
          <span>Loading...</span>
          <span data-count>000</span>
        </div>
        <p
          className="font-display leading-[0.9]"
          style={{ fontSize: "clamp(2.5rem, 7vw, 4.5rem)" }}
        >
          Amika Fernando
          <br />
          <span className="opacity-70">Software Engineer</span>
        </p>
      </div>
    </div>
  )
}

export function SplitIntro() {
  const rootRef = useRef<HTMLDivElement>(null)
  const [done, setDone] = useState(() => playedThisLoad)

  // layout effect so the hold is in place before <TextReveal> (a later sibling up in the layout) checks it
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    const releaseReveals = holdReveals()

    const html = document.documentElement
    html.style.overflow = "hidden"
    const reveal = document.querySelector<HTMLElement>("[data-intro-reveal]")

    const finish = () => {
      html.style.overflow = ""
      playedThisLoad = true
      setDone(true)
      releaseReveals()
    }

    const counters = root.querySelectorAll<HTMLElement>("[data-count]")
    const progress = { value: 0 }
    const renderCount = () =>
      counters.forEach((el) => (el.textContent = String(Math.round(progress.value)).padStart(3, "0")))

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let tl: gsap.core.Timeline

    // context.revert() undoes every tween's inline styles, so React Strict Mode's
    // mount → unmount → mount doesn't leave the intro stuck on its first frame
    const ctx = gsap.context(() => {
      tl = gsap.timeline({ onComplete: finish })

      if (reduced) {
        tl.set("[data-char], [data-caret]", { opacity: 1 })
          .to(progress, { value: 100, duration: 0.6, onUpdate: renderCount })
          .to(root, { opacity: 0, duration: 0.5, delay: 0.3 })
        return
      }

      // both panels hold the same code, so type them in lockstep
      const chars = gsap.utils.toArray<HTMLElement>("[data-char]")
      const perPanel = chars.length / 2
      const typed = perPanel * 0.011
      tl.to(chars, { opacity: 1, duration: 0.01, stagger: (i) => (i % perPanel) * 0.011, ease: "none" }, 0)
        .to(progress, { value: 100, duration: typed, ease: "power2.inOut", onUpdate: renderCount }, 0)
        .to("[data-caret]", { opacity: 1, duration: 0.01 }, typed)
        .addLabel("cut", typed + 0.35)
        .to("[data-code]", { opacity: 0.25, duration: 0.4 }, "cut")
        .fromTo(
          "[data-bar]",
          { xPercent: -50, yPercent: -50, rotation: -TILT, scaleX: 0 },
          { scaleX: 1, duration: 0.6, ease: "expo.inOut" },
          "cut",
        )
        .addLabel("open", "cut+=0.65")
        .to("[data-panel='top']", { yPercent: -100, duration: 1, ease: "expo.inOut" }, "open")
        .to("[data-panel='bottom']", { yPercent: 100, duration: 1, ease: "expo.inOut" }, "open")
        .to("[data-bar]", { scaleY: 0, opacity: 0, duration: 0.35, ease: "power2.in" }, "open")
        // let the page's heading reveals start while the panels are still parting
        .call(releaseReveals, [], "open+=0.35")

      if (reveal) {
        tl.fromTo(
          reveal,
          { scale: 1.08, opacity: 0.4, transformOrigin: "50% 30%" },
          { scale: 1, opacity: 1, duration: 1.1, ease: "expo.out", clearProps: "transform,opacity,transformOrigin" },
          "open+=0.3",
        )
      }
    }, root)

    const skip = () => tl.progress(1)
    window.addEventListener("keydown", skip)
    root.addEventListener("click", skip)

    return () => {
      window.removeEventListener("keydown", skip)
      root.removeEventListener("click", skip)
      ctx.revert()
      html.style.overflow = ""
      releaseReveals()
    }
  }, [])

  if (done) return null

  return (
    <div
      ref={rootRef}
      data-intro-root
      data-lenis-prevent
      role="presentation"
      className="fixed inset-0 z-[100] cursor-pointer select-none overflow-hidden"
    >
      <span className="sr-only">Amika Fernando</span>
      <Panel side="top" />
      <Panel side="bottom" />
      {/* the cut */}
      <div
        data-bar
        className="pointer-events-none absolute left-1/2 top-1/2 h-[clamp(14px,2.2vw,28px)] w-[140vw]"
        style={{ background: INK, transform: `translate(-50%, -50%) rotate(-${TILT}deg) scaleX(0)` }}
      />
    </div>
  )
}
