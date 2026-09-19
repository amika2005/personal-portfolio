"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"
import { gsap } from "gsap"
import useIsomorphicLayoutEffect from "@/hooks/use-isomorphic-layout-effect"
import { holdReveals } from "@/lib/reveal-gate"
import { skipIntro } from "@/components/intro/split-intro"

const RED = "#EF3B2D"
const INK = "#141414"
const RISE_CLIP = { clipPath: "inset(-0.5em -0.5em 0 -0.5em)" }

const normalize = (path: string) => path.replace(/\/+$/, "") || "/"
// "/blog/some-post" → "blog", "/" → "home"
const labelFor = (path: string) => normalize(path).split("/")[1] || "home"

/**
 * Curtain between pages: clicking an internal link raises a red sheet, then an ink sheet
 * carrying the next page's name; the route changes under cover, and the sheets lift away.
 * Mounted once in the root layout, ahead of <TextReveal> so it can hold the heading reveals.
 */
export function PageTransition() {
  const pathname = usePathname()
  const router = useRouter()
  const redRef = useRef<HTMLDivElement>(null)
  const inkRef = useRef<HTMLDivElement>(null)
  const labelRef = useRef<HTMLSpanElement>(null)
  const state = useRef({ path: null as null | string, covered: false, busy: false, release: null as null | (() => void) })

  // The home page opens with its own intro; every other page is served already covered
  // so there's no flash of content before the sheets lift.
  // Kept from the first render: if this style changed on later renders, React would
  // overwrite the transforms GSAP writes to the sheets.
  const startCovered = useRef(normalize(pathname) !== "/").current

  const uncover = (delay: number) => {
    const s = state.current
    gsap
      .timeline({
        delay,
        onComplete: () => {
          gsap.set([redRef.current, inkRef.current], { yPercent: 100 })
          s.covered = false
          s.busy = false
        },
      })
      .to(inkRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" })
      // let the new page's headings start rising while the sheets are still parting
      .call(() => {
        s.release?.()
        s.release = null
      }, [], 0.25)
      .to(redRef.current, { yPercent: -100, duration: 0.7, ease: "power4.inOut" }, 0.1)
  }

  useIsomorphicLayoutEffect(() => {
    const s = state.current
    const sheets = [redRef.current, inkRef.current]
    // Strict Mode re-runs this effect without a route change; only react to real ones
    if (s.path === pathname) return
    const first = s.path === null
    s.path = pathname
    // home has no transition (it has the intro instead), including via back/forward
    if (!first && !s.covered && normalize(pathname) === "/") return

    if (first) {
      gsap.set(sheets, { y: 0, yPercent: startCovered ? 0 : 100 })
      if (!startCovered) return
      s.covered = true
      s.busy = true
      s.release = holdReveals()
      uncover(0.25)
      return
    }

    if (!s.covered) {
      // back/forward: nothing covered the old page, so cover instantly (before paint) and lift
      if (labelRef.current) labelRef.current.textContent = labelFor(pathname)
      gsap.set(sheets, { yPercent: 0 })
      gsap.set(labelRef.current, { yPercent: 0 })
      s.covered = true
      s.busy = true
      s.release = holdReveals()
    }
    uncover(0.1)
  }, [pathname])

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const cover = (href: string) => {
      const s = state.current
      if (s.busy) return
      s.busy = true
      s.covered = true
      skipIntro()
      router.prefetch(href)
      s.release = holdReveals()
      if (labelRef.current) labelRef.current.textContent = labelFor(new URL(href, location.href).pathname)

      gsap
        .timeline()
        .set([redRef.current, inkRef.current], { yPercent: 100 })
        .set(labelRef.current, { yPercent: 110 })
        .to(redRef.current, { yPercent: 0, duration: 0.45, ease: "power3.inOut" })
        .to(inkRef.current, { yPercent: 0, duration: 0.45, ease: "power3.inOut" }, 0.08)
        .to(labelRef.current, { yPercent: 0, duration: 0.45, ease: "expo.out" }, 0.3)
        // navigate as soon as the ink sheet has the screen; the label finishes rising on the way out
        .call(() => router.push(href), [], 0.55)
    }

    const onClick = (e: MouseEvent) => {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || (a.target && a.target !== "_self") || a.hasAttribute("download")) return
      const url = new URL(a.href, location.href)
      if (url.origin !== location.origin) return
      if (normalize(url.pathname) === normalize(location.pathname)) return
      // going home is a plain navigation, without the curtain or the intro
      if (normalize(url.pathname) === "/") return skipIntro()
      if (reduced) return

      // capture phase on document runs before React's root listener, so next/link never sees it
      e.preventDefault()
      e.stopPropagation()
      cover(url.pathname + url.search + url.hash)
    }

    document.addEventListener("click", onClick, true)
    // back/forward re-renders home without a click; mark the intro as seen before that render
    window.addEventListener("popstate", skipIntro)
    return () => {
      document.removeEventListener("click", onClick, true)
      window.removeEventListener("popstate", skipIntro)
    }
  }, [router])

  const sheet = "pointer-events-auto fixed inset-0 z-[150] will-change-transform"
  const initial = { transform: startCovered ? "translateY(0%)" : "translateY(100%)" }

  return (
    <div aria-hidden className="pointer-events-none">
      <div ref={redRef} className={sheet} style={{ ...initial, background: RED }} />
      <div ref={inkRef} className={`${sheet} flex items-center justify-center`} style={{ ...initial, background: INK }}>
        <div style={RISE_CLIP}>
          <span
            ref={labelRef}
            className="block font-display text-[clamp(5rem,20vw,19rem)] leading-[0.95] text-white"
          >
            {labelFor(pathname)}
          </span>
        </div>
      </div>
    </div>
  )
}
