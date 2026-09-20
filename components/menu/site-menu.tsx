"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { gsap } from "gsap"
import useIsomorphicLayoutEffect from "@/hooks/use-isomorphic-layout-effect"
import { setScrollLocked } from "@/components/SmoothScroll"
import { RollText } from "@/components/ui/roll-text"
import { ColomboClock } from "@/components/ui/colombo-clock"

const RED = "#EF3B2D"
const INK = "#0A0A0A"
const EMAIL = "amikafernando123@gmail.com"
// same tilted cut as the intro: panel edges rise by tan(6°) across the screen
const RISE = `${(Math.tan((6 * Math.PI) / 180) * 50).toFixed(2)}vw`
const RISE_CLIP = { clipPath: "inset(-0.5em -100vw 0 -100vw)" }

type Preview = { kind: "image"; src: string; bg: string } | { kind: "type"; text: string; bg: string; fg: string }

const LINKS: { name: string; href: string; preview: Preview }[] = [
  { name: "Home", href: "/", preview: { kind: "image", src: "/hero-developer.webp", bg: RED } },
  { name: "Resume", href: "/resume", preview: { kind: "type", text: "CV", bg: RED, fg: "#141414" } },
  { name: "Stories", href: "/stories", preview: { kind: "image", src: "/images/stories/adventures.webp", bg: INK } },
  { name: "Blog", href: "/blog", preview: { kind: "type", text: "Journal", bg: "#F2EFE9", fg: "#141414" } },
]

const SOCIALS = [
  { name: "GitHub", href: "https://github.com/amika2005" },
  { name: "Instagram", href: "https://www.instagram.com/a4amiiika?igsh=OHprMDI3aTdrdW94" },
  { name: "WhatsApp", href: "https://wa.me/+94757975856" },
]

const normalize = (p: string) => p.replace(/\/+$/, "") || "/"

/** Two lines that draw together on hover and cross into an X when open. */
export function MenuIcon({ open }: { open: boolean }) {
  const line = "absolute left-0 h-[2px] w-full rounded-full bg-current transition-transform duration-500 ease-[cubic-bezier(0.7,0,0.2,1)]"
  return (
    <span aria-hidden className="relative block h-3 w-8">
      <span className={`${line} top-0 ${open ? "translate-y-[5px] rotate-45" : "group-hover:translate-y-[2px]"}`} />
      <span className={`${line} bottom-0 ${open ? "-translate-y-[5px] -rotate-45" : "group-hover:-translate-y-[2px]"}`} />
    </span>
  )
}

/**
 * Full-screen menu. Opening, red panels close in along the intro's tilted cut and the ink
 * menu opens out of that line; closing runs it backwards, splitting the red apart again.
 */
export function SiteMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const rootRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  // stays mounted through the closing animation
  const [shown, setShown] = useState(false)
  const [crossed, setCrossed] = useState(false)
  const [hovered, setHovered] = useState<number | null>(null)
  const current = LINKS.findIndex((l) => normalize(l.href) === normalize(pathname))

  useEffect(() => {
    if (open) setShown(true)
  }, [open])

  useEffect(() => () => setScrollLocked(false), [])

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current
    if (!root || !shown) return
    const q = gsap.utils.selector(root)
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    let tl: gsap.core.Timeline

    if (open) {
      setScrollLocked(true)
      setHovered(null)
      tl = gsap.timeline({ onComplete: () => closeRef.current?.focus() })
      if (reduced) {
        tl.fromTo(root, { opacity: 0 }, { opacity: 1, duration: 0.2 })
      } else {
        // set synchronously: inside the timeline it would only apply on the next tick, flashing the menu for a frame
        gsap.set(q("[data-menu-ink]"), { clipPath: "inset(50% 0% 50% 0%)" })
        tl.fromTo(q("[data-menu-top]"), { yPercent: -100 }, { yPercent: 0, duration: 0.55, ease: "power4.inOut" }, 0)
          .fromTo(q("[data-menu-bottom]"), { yPercent: 100 }, { yPercent: 0, duration: 0.55, ease: "power4.inOut" }, 0)
          .to(q("[data-menu-ink]"), { clipPath: "inset(0% 0% 0% 0%)", duration: 0.65, ease: "expo.inOut" }, 0.45)
          .fromTo(q("[data-menu-link]"), { yPercent: 110 }, { yPercent: 0, duration: 0.9, ease: "expo.out", stagger: 0.07 }, 0.75)
          .fromTo(q("[data-menu-fade]"), { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, stagger: 0.05 }, 0.85)
      }
      const cross = setTimeout(() => setCrossed(true), reduced ? 0 : 700)
      return () => {
        clearTimeout(cross)
        tl.kill()
      }
    }

    setCrossed(false)
    tl = gsap.timeline({
      onComplete: () => {
        setShown(false)
        setScrollLocked(false)
      },
    })
    if (reduced) {
      tl.to(root, { opacity: 0, duration: 0.2 })
    } else {
      tl.to(q("[data-menu-link]"), { yPercent: 110, duration: 0.35, ease: "power3.in", stagger: 0.03 }, 0)
        .to(q("[data-menu-fade]"), { opacity: 0, duration: 0.25 }, 0)
        .to(q("[data-menu-ink]"), { clipPath: "inset(50% 0% 50% 0%)", duration: 0.5, ease: "expo.inOut" }, 0.2)
        .to(q("[data-menu-top]"), { yPercent: -100, duration: 0.6, ease: "power4.inOut" }, 0.6)
        .to(q("[data-menu-bottom]"), { yPercent: 100, duration: 0.6, ease: "power4.inOut" }, 0.6)
    }
    return () => {
      tl.kill()
    }
  }, [open, shown])

  // Esc closes; Tab stays inside the menu while it's open
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
      if (e.key !== "Tab" || !rootRef.current) return
      const focusable = rootRef.current.querySelectorAll<HTMLElement>("a[href], button")
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  if (!shown) return null

  const panel = "absolute inset-0 will-change-transform"
  const preview = hovered ?? (current >= 0 ? current : 0)

  return createPortal(
    <div
      ref={rootRef}
      id="site-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      data-no-reveal
      data-lenis-prevent
      className="fixed inset-0 z-[130]"
    >
      {/* the red closes in along the cut */}
      <div
        data-menu-top
        className={panel}
        style={{ background: RED, clipPath: `polygon(0 0, 100% 0, 100% calc(50% - ${RISE} + 2px), 0 calc(50% + ${RISE} + 2px))` }}
      />
      <div
        data-menu-bottom
        className={panel}
        style={{ background: RED, clipPath: `polygon(0 calc(50% + ${RISE}), 100% calc(50% - ${RISE}), 100% 100%, 0 100%)` }}
      />

      {/* the menu itself opens out of that line */}
      <div data-menu-ink className="absolute inset-0 flex flex-col overflow-y-auto text-white" style={{ background: INK }}>
        <div className="flex h-16 shrink-0 items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14">
          <span className="font-display text-2xl leading-none md:text-3xl">
            <span className="text-[#EF3B2D]">A</span>MIKA
          </span>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="group flex items-center gap-3 font-mono text-xs uppercase tracking-widest"
          >
            <RollText text="Close" />
            <MenuIcon open={crossed} />
          </button>
        </div>

        <div className="grid flex-1 items-center gap-10 px-6 py-8 sm:px-10 md:grid-cols-[1fr_minmax(16rem,24rem)] lg:px-14">
          <nav aria-label="Main">
            <ol className="group/nav" onPointerLeave={() => setHovered(null)}>
              {LINKS.map((link, i) => (
                <li key={link.href} style={RISE_CLIP}>
                  <Link
                    href={link.href}
                    onClick={onClose}
                    onPointerEnter={() => setHovered(i)}
                    onFocus={() => setHovered(i)}
                    aria-current={i === current ? "page" : undefined}
                    className="group flex items-baseline gap-4 py-1 transition-opacity duration-300 group-hover/nav:opacity-30 hover:!opacity-100 focus-visible:!opacity-100 md:gap-6"
                  >
                    <span data-menu-link className="flex items-baseline gap-4 md:gap-6">
                      <span className="w-8 font-mono text-xs opacity-60 md:w-10">({String(i + 1).padStart(2, "0")})</span>
                      <span className="font-display text-[clamp(3.25rem,11vw,9rem)] uppercase leading-none">
                        <RollText text={link.name} stagger={0.02} />
                      </span>
                      {i === current && <span aria-hidden className="h-3 w-3 self-center rounded-full bg-[#EF3B2D]" />}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </nav>

          {/* preview of the hovered (or current) page */}
          <div data-menu-fade aria-hidden className="relative hidden aspect-[4/5] overflow-hidden md:block">
            {LINKS.map(({ preview: p, name }, i) => (
              <div
                key={name}
                className="absolute inset-0 grid place-items-center transition-[clip-path] duration-700 ease-[cubic-bezier(0.7,0,0.2,1)]"
                style={{
                  background: p.bg,
                  clipPath: i === preview ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)",
                  zIndex: i === preview ? 1 : 0,
                }}
              >
                {p.kind === "image" ? (
                  <img src={p.src} alt="" className="h-full w-full object-cover object-top" />
                ) : (
                  <span className="font-display text-[5.5rem] uppercase leading-none" style={{ color: p.fg }}>
                    {p.text}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* bottom row */}
        <div
          className="flex shrink-0 flex-col gap-4 border-t px-6 py-5 font-mono text-xs uppercase tracking-widest sm:px-10 md:flex-row md:items-center md:justify-between lg:px-14"
          style={{ borderColor: "rgba(255,255,255,0.15)" }}
        >
          <span data-menu-fade className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#EF3B2D]" /> Available for work
          </span>
          <span data-menu-fade className="flex flex-wrap gap-x-6 gap-y-2">
            {SOCIALS.map((s) => (
              <a key={s.name} href={s.href} target="_blank" rel="noopener noreferrer" className="group opacity-70 hover:opacity-100">
                <RollText text={s.name} />
              </a>
            ))}
            <a href={`mailto:${EMAIL}`} className="group opacity-70 hover:opacity-100">
              <RollText text="Email" />
            </a>
          </span>
          <span data-menu-fade className="opacity-70">
            Colombo, LK — <ColomboClock />
          </span>
        </div>
      </div>
    </div>,
    document.body,
  )
}
