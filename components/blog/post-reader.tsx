"use client"

import { useEffect, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { scrollToY } from "@/components/SmoothScroll"

gsap.registerPlugin(ScrollTrigger)

type Props = { articleId: string; sections: { id: string; heading: string }[]; readingTime: string }

/** Reading progress along the top edge, and a sticky contents list that follows the article. */
export function PostReader({ articleId, sections, readingTime }: Props) {
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(0)
  const minutes = parseInt(readingTime, 10) || 0

  useEffect(() => {
    const article = document.getElementById(articleId)
    if (!article) return

    const triggers = [
      ScrollTrigger.create({
        trigger: article,
        start: "top 30%",
        end: "bottom bottom",
        onUpdate: (self) => setProgress(self.progress),
      }),
      ...sections.map((section, i) =>
        ScrollTrigger.create({
          trigger: document.getElementById(section.id),
          start: "top 40%",
          end: "bottom 40%",
          onToggle: (self) => self.isActive && setActive(i),
        }),
      ),
    ]
    return () => triggers.forEach((t) => t.kill())
  }, [articleId, sections])

  const jump = (id: string) => {
    const el = document.getElementById(id)
    if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY - 110)
  }

  const left = Math.max(0, Math.ceil(minutes * (1 - progress)))

  return (
    <>
      <div aria-hidden className="fixed inset-x-0 top-0 z-[60] h-[3px]">
        <div className="h-full origin-left bg-[#EF3B2D]" style={{ transform: `scaleX(${progress})` }} />
      </div>

      <nav aria-label="Contents" className="lg:sticky lg:top-28">
        <p className="font-mono text-xs uppercase tracking-widest opacity-60">Contents</p>
        <ol className="mt-4 space-y-3">
          {sections.map((section, i) => (
            <li key={section.id}>
              <button
                type="button"
                onClick={() => jump(section.id)}
                aria-current={i === active ? "location" : undefined}
                className={`flex gap-3 text-left text-sm leading-snug transition-opacity ${
                  i === active ? "opacity-100" : "opacity-50 hover:opacity-100"
                }`}
              >
                <span className="font-mono text-xs tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                <span>{section.heading}</span>
              </button>
            </li>
          ))}
        </ol>
        {minutes > 0 && (
          <p className="mt-6 font-mono text-xs uppercase tracking-widest opacity-60">
            {progress >= 0.99 ? "Finished" : `${left} min left`}
          </p>
        )}
      </nav>
    </>
  )
}

/** Copies the post URL, with a moment of confirmation. */
export function CopyLink() {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 1600)
        } catch {}
      }}
      className="rounded-full border-[1.5px] border-current px-4 py-2 font-mono text-xs uppercase tracking-widest transition-opacity hover:opacity-70"
    >
      {copied ? "Link copied ✓" : "Copy link"}
    </button>
  )
}
