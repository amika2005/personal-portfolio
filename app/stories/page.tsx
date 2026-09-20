import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CustomCursor } from "@/components/custom-cursor"
import { AboutPortrait } from "@/components/stories/about-portrait"
import { ChapterStrip } from "@/components/stories/chapter-strip"
import { NowPlaying } from "@/components/stories/now-playing"

export const metadata: Metadata = {
  title: "Stories — Amika Fernando",
  description: "A life in six chapters: the people, places and moments behind the code.",
}

const FACTS = [
  { label: "Based in", value: "Colombo, Sri Lanka" },
  { label: "Work", value: "Software Engineer, Infinit Tech Systems" },
  { label: "Off the clock", value: "Open source & the outdoors" },
]

export default function StoriesPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <CustomCursor />
      <Header />
      <div className="hidden md:block">
      </div>

      <main>
        {/* hero */}
        <section className="flex min-h-[85svh] flex-col items-center justify-center px-6 pt-10 text-center">
          <p className="mb-6 font-mono text-xs uppercase tracking-widest opacity-60">Amika Fernando — Stories</p>
          <h1 className="text-[clamp(5.5rem,22vw,20rem)] leading-[0.9]">Stories</h1>
          <p className="mt-6 max-w-md text-lg opacity-70">
            A life in six chapters: the people, places and moments behind the code.
          </p>
          <span className="mt-12 animate-bounce font-mono text-xs uppercase tracking-widest opacity-60">Scroll ↓︎</span>
        </section>

        {/* about */}
        <section className="mx-auto grid max-w-7xl gap-14 px-6 py-24 sm:px-10 md:grid-cols-12 md:items-start lg:px-14">
          <div className="md:col-span-6">
            <p className="mb-6 font-mono text-xs uppercase tracking-widest opacity-60">About</p>
            <h2 className="text-[clamp(2.5rem,5.2vw,5.5rem)] leading-[0.95]">
              Not just writing code. Engineering solutions that cross borders.
            </h2>
            <div className="mt-10 space-y-6 text-lg leading-relaxed opacity-80">
              <p data-reveal>
                Hello! I&apos;m Amika, a passionate developer and designer with a love for creating beautiful,
                functional digital experiences. With a background in both design and development, I bring a unique
                perspective to every project I work on.
              </p>
              <p data-reveal>
                I see technology as a powerful lever for change, but its true potential is unlocked only with a
                worldly perspective. Contributing to the global open-source community and embracing the challenges of
                outdoor adventures are integral to my growth, and they shape how I spend my time, on and off the
                screen.
              </p>
            </div>
            <dl
              className="mt-12 grid gap-6 border-t pt-6 sm:grid-cols-3"
              style={{ borderColor: "color-mix(in srgb, currentColor 20%, transparent)" }}
            >
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="font-mono text-[11px] uppercase tracking-widest opacity-60">{fact.label}</dt>
                  <dd className="mt-1 text-base">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          {/* top-aligned (not centred against the long copy) so the portrait sits up by the heading */}
          <div className="md:col-span-6 md:-mt-4">
            <AboutPortrait />
          </div>
        </section>

        <ChapterStrip />

        {/* outro */}
        <section className="flex min-h-[60svh] flex-col items-center justify-center gap-6 px-6 py-24 text-center">
          <p className="font-mono text-sm sm:text-base">
            &gt; the next chapter is being written<span className="animate-pulse">_</span>
          </p>
          <h2 className="text-[clamp(3.5rem,10vw,10rem)] leading-[0.95]">To be continued</h2>
        </section>
      </main>

      <NowPlaying />
      <Footer />
    </div>
  )
}
