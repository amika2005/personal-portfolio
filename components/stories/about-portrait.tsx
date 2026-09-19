"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

/** The About illustration, tilting gently toward the pointer. */
export function AboutPortrait() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const img = imgRef.current
    if (!wrap || !img) return
    if (window.matchMedia("(pointer: coarse), (prefers-reduced-motion: reduce)").matches) return

    const rotX = gsap.quickTo(img, "rotationX", { duration: 0.8, ease: "power3.out" })
    const rotY = gsap.quickTo(img, "rotationY", { duration: 0.8, ease: "power3.out" })
    const move = (e: PointerEvent) => {
      const r = wrap.getBoundingClientRect()
      rotY(((e.clientX - r.left) / r.width - 0.5) * 16)
      rotX(-((e.clientY - r.top) / r.height - 0.5) * 16)
    }
    const leave = () => {
      rotX(0)
      rotY(0)
    }
    wrap.addEventListener("pointermove", move)
    wrap.addEventListener("pointerleave", leave)
    return () => {
      wrap.removeEventListener("pointermove", move)
      wrap.removeEventListener("pointerleave", leave)
    }
  }, [])

  return (
    <div ref={wrapRef} className="[perspective:900px]">
      <img
        ref={imgRef}
        src="/About-me.png"
        alt="Illustration of Amika"
        width={484}
        height={515}
        className="mx-auto h-auto w-full max-w-[36rem] will-change-transform md:-ml-[9%] md:w-[118%] md:max-w-none"
      />
    </div>
  )
}
