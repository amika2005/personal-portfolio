"use client"

import { usePathname } from "next/navigation"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import useIsomorphicLayoutEffect from "@/hooks/use-isomorphic-layout-effect"
import { onRevealsReady } from "@/lib/reveal-gate"

gsap.registerPlugin(ScrollTrigger, SplitText)

// Big display headings get the reveal automatically; anything else can opt in with data-reveal.
const TARGETS = "h1:not(.font-mono), h2:not(.font-mono), [data-reveal]"
const EXCLUDED = "[data-no-reveal], [role='dialog'], [data-panel]"

/**
 * Splits headings into masked lines that rise into place as they scroll into view.
 * Mounted once in the root layout; re-scans the page on every route change.
 */
export function TextReveal() {
  const pathname = usePathname()

  // layout effect: split + hide the lines before the browser paints the new route
  useIsomorphicLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let introDone = false
    const waiting: (() => void)[] = []
    const seen = new WeakSet<HTMLElement>()
    const ctx = gsap.context(() => {})

    const reveal = (el: HTMLElement) => {
      if (seen.has(el) || el.closest(EXCLUDED) || !el.textContent?.trim()) return
      seen.add(el)

      let entered = false
      let landed = false
      let tween: gsap.core.Tween | undefined
      const play = () => tween?.play()

      ctx.add(() => {
        SplitText.create(el, {
          type: "lines",
          mask: "lines",
          // re-splits when fonts load or the width changes; returning the tween lets
          // SplitText carry its progress over to the new lines
          autoSplit: true,
          onSplit(self) {
            // SplitText masks with overflow: clip, which crops Anton's tall glyphs and overshooting
            // rounds at our tight line-heights. The rise only needs the bottom edge hidden, so clip
            // just that, and drop the clip entirely once the line has landed.
            const masks = self.masks as HTMLElement[]
            masks.forEach((m) => {
              m.style.overflow = "visible"
              m.style.clipPath = "inset(-0.5em -0.5em 0 -0.5em)"
            })
            const unclip = () => {
              landed = true
              masks.forEach((m) => (m.style.clipPath = "none"))
            }
            // autoSplit re-splits on resize; a finished reveal won't fire onComplete again
            if (landed) unclip()

            tween = gsap.from(self.lines, {
              yPercent: 110,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.09,
              paused: true,
              onComplete: unclip,
            })
            if (entered && introDone) tween.play()
            return tween
          },
        })

        ScrollTrigger.create({
          trigger: el,
          start: "top 90%",
          once: true,
          onEnter: () => {
            entered = true
            if (introDone) play()
            else waiting.push(play)
          },
        })
      })
    }

    gsap.utils.toArray<HTMLElement>(TARGETS).forEach(reveal)

    // pages that render after mount (e.g. stories waits for isMounted) add their headings later
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches(TARGETS)) reveal(node)
          node.querySelectorAll<HTMLElement>(TARGETS).forEach(reveal)
        })
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })

    const unsubscribe = onRevealsReady(() => {
      introDone = true
      waiting.forEach((play) => play())
    })

    return () => {
      observer.disconnect()
      unsubscribe()
      ctx.revert()
    }
  }, [pathname])

  return null
}
