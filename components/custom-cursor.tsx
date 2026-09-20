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

    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" })
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" })
    const ringX = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" })
    const ringY = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" })
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
        ringSX(1 + speed / 160)
        ringSY(1 - speed / 320)
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
    const size = mode === "text" ? 104 : mode === "link" ? 64 : 34
    gsap.to(ring, {
      width: size,
      height: size,
      backgroundColor: mode === "idle" ? "rgba(239,59,45,0)" : RED,
      borderColor: mode === "idle" ? RED : "rgba(239,59,45,0)",
      duration: 0.4,
      ease: "power3.out",
    })
    gsap.to(dot, { scale: mode === "idle" ? 1 : 0, duration: 0.3, ease: "power3.out" })
  }, [mode, enabled])

  if (!enabled) return null

  return (
    <>
      {/* the dot, inverted against whatever is under it */}
      <div ref={dotRef} className="pointer-events-none fixed left-0 top-0 z-[9999] mix-blend-difference">
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="h-2.5 w-2.5 rounded-full bg-white" />
        </div>
      </div>

      {/* the trailing ring */}
      <div ref={ringRef} className="pointer-events-none fixed left-0 top-0 z-[9998]">
        <div className="flex -translate-x-1/2 -translate-y-1/2 items-center justify-center">
          <div
            ref={innerRef}
            className="flex items-center justify-center rounded-full border"
            style={{ width: 34, height: 34, borderColor: RED, backgroundColor: "rgba(239,59,45,0)" }}
          >
            {mode === "link" && (
              <svg aria-hidden viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="#141414" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17L17 7" />
                <path d="M8 7h9v9" />
              </svg>
            )}
            {mode === "text" && label && (
              <span className="px-3 text-center font-display text-sm uppercase leading-none tracking-wide text-[#141414]">
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
