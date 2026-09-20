"use client"

import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import { setScrollLocked } from "@/components/SmoothScroll"

const CV = "/cv.pdf"

const pill =
  "inline-flex items-center gap-2 rounded-full border-[1.5px] border-current px-5 py-2.5 font-mono text-xs uppercase tracking-widest transition-colors"

/** "View CV" opens the PDF full screen; "Download" is a plain download link. */
export function CvActions() {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`${pill} bg-current [&>span]:text-white dark:[&>span]:text-gray-950`}
      >
        <span>View CV ↗︎</span>
      </button>
      <a href={CV} download="Amika-Fernando-CV.pdf" className={`${pill} hover:opacity-70`}>
        Download PDF ↓︎
      </a>
      {open && <CvViewer onClose={() => setOpen(false)} />}
    </div>
  )
}

function CvViewer({ onClose }: { onClose: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    setScrollLocked(true)
    const opener = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose()
    window.addEventListener("keydown", onKey)
    if (rootRef.current && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.from(rootRef.current, { clipPath: "inset(100% 0% 0% 0%)", duration: 0.7, ease: "power4.inOut" })
    }
    return () => {
      window.removeEventListener("keydown", onKey)
      setScrollLocked(false)
      opener?.focus()
    }
  }, [onClose])

  return createPortal(
    <div
      ref={rootRef}
      role="dialog"
      aria-modal="true"
      aria-label="Amika Fernando's CV"
      data-lenis-prevent
      data-no-reveal
      className="fixed inset-0 z-[120] flex flex-col bg-[#0A0A0A] text-white"
    >
      <div className="flex items-center justify-between gap-4 px-6 py-5 sm:px-10">
        <span className="font-display text-3xl leading-none sm:text-4xl">Curriculum Vitae</span>
        <div className="flex gap-3">
          <a href={CV} download="Amika-Fernando-CV.pdf" className={`${pill} hidden hover:bg-white/10 sm:inline-flex`}>
            Download ↓︎
          </a>
          <button ref={closeRef} type="button" onClick={onClose} className={`${pill} hover:bg-white/10`}>
            Close ✕
          </button>
        </div>
      </div>
      <iframe src={CV} title="Amika Fernando's CV" className="mx-auto w-full max-w-4xl flex-1 bg-white px-0 sm:mb-6 sm:rounded" />
    </div>,
    document.body,
  )
}
