"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"

const RED = "#EF3B2D"

/**
 * The cursor: a red dot that tracks the pointer, and a ring that trails it, leans into the
 * direction of travel and stretches with speed. Over anything clickable the ring closes into a
 * filled red disc with an arrow; over [data-cursor-text] it opens into a labelled disc.
 */
export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<"idle" | "link" | "text">("idle")
  const [label, setLabel] = useState("")
  // pointer-driven only: phones and tablets keep their own (absent) cursor. It stays false
  // through the first render, so the markup — and the refs below — only exist on real pointers.
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(window.matchMedia("(hover: hover) and (pointer: fine)").matches)
  }, [])

  useEffect(() => {
    if (!enabled) return
    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    // centre both on the pointer here rather than with a CSS translate: GSAP applies the percent
    // shift with the move, so the ring's rotation can't swing its own centre off the dot
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 })

    const dotX = gsap.quickTo(dot, "x", { duration: 0.1, ease: "power3.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.1, ease: "power3.out" })
    // only a touch slower than the dot, so the ring stays around it instead of trailing behind
    const ringX = gsap.quickTo(ring, "x", { duration: 0.22, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.22, ease: "power3.out" })
    const ringRot = gsap.quickTo(ring, "rotation", { duration: 0.35, ease: "power3.out" })
    const ringSX = gsap.quickTo(ring, "scaleX", { duration: 0.35, ease: "power3.out" })
    const ringSY = gsap.quickTo(ring, "scaleY", { duration: 0.35, ease: "power3.out" })

    let x = 0
    let y = 0
    let lastX = 0
    let lastY = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      dotX(x)
      dotY(y)
      ringX(x)
      ringY(y)
    }

    // speed drives the lean: the ring rotates to the direction of travel and stretches along it
    const stretch = () => {
      const dx = x - lastX
      const dy = y - lastY
      lastX = x
      lastY = y
      const speed = Math.min(Math.hypot(dx, dy), 90)
      if (speed > 2) {
        ringRot((Math.atan2(dy, dx) * 180) / Math.PI)
        ringSX(1 + speed / 220)
        ringSY(1 - speed / 440)
      } else {
        ringSX(1)
        ringSY(1)
      }
    }
    gsap.ticker.add(stretch)

    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null
      const labelled = target?.closest?.("[data-cursor-text]") as HTMLElement | null
      if (labelled) {
        setLabel(labelled.dataset.cursorText || "")
        setMode("text")
        return
      }
      setLabel("")
      setMode(target?.closest?.('a, button, [role="button"], .cursor-pointer, input, select, textarea') ? "link" : "idle")
    }

    const press = (down: boolean) => () => gsap.to(ring, { scale: down ? 0.82 : 1, duration: 0.2, ease: "power3.out" })
    const show = (on: boolean) => () => gsap.to([dot, ring], { autoAlpha: on ? 1 : 0, duration: 0.2 })

    document.addEventListener("mousemove", onMove)
    document.addEventListener("mouseover", onOver)
    document.addEventListener("mousedown", press(true))
    document.addEventListener("mouseup", press(false))
    document.documentElement.addEventListener("mouseleave", show(false))
    document.documentElement.addEventListener("mouseenter", show(true))

    return () => {
      gsap.ticker.remove(stretch)
      document.removeEventListener("mousemove", onMove)
      document.removeEventListener("mouseover", onOver)
      document.removeEventListener("mousedown", press(true))
      document.removeEventListener("mouseup", press(false))
      document.documentElement.removeEventListener("mouseleave", show(false))
      document.documentElement.removeEventListener("mouseenter", show(true))
    }
  }, [enabled])

  // the ring animates between three resting states
  useEffect(() => {
    const ring = innerRef.current
    const dot = dotRef.current
    if (!ring || !dot) return
    // hover just zooms the ring and washes it in: the dot stays in the middle of it throughout
    const size = mode === "text" ? 104 : mode === "link" ? 64 : 34
    gsap.to(ring, {
      width: size,
      height: size,
      backgroundColor: mode === "idle" ? "rgba(239,59,45,0)" : "rgba(239,59,45,0.18)",
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(dot, { scale: mode === "text" ? 0 : 1, duration: 0.3, ease: "power3.out" })
  }, [mode, enabled])

  if (!enabled) return null

  return (
    <>
      {/* the dot, which takes the page's own ink colour and flips with the theme */}
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[9999]">
        <div>
          <div className="h-2.5 w-2.5 rounded-full bg-[#141414] shadow-[0_0_0_1.5px_rgba(255,255,255,0.6)] transition-colors duration-500 dark:bg-white dark:shadow-[0_0_0_1.5px_rgba(0,0,0,0.5)]" />
        </div>
      </div>

      {/* the ring that rides with it */}
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[9998]">
        <div className="flex items-center justify-center">
          <div
            ref={innerRef}
            className="flex items-center justify-center rounded-full border-[1.5px]"
            style={{ width: 34, height: 34, borderColor: RED, backgroundColor: "rgba(239,59,45,0)" }}
          >
            {mode === "text" && label && (
              <span className="px-3 text-center font-display text-sm uppercase leading-none tracking-wide text-[#141414] dark:text-white">
                {label}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* the system cursor stays hidden wherever this one is drawn */}
      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) {
          *,
          *::before,
          *::after {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  )
}
