import type { CSSProperties } from "react"
import type { Metadata } from "next"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialSidebar } from "@/components/social-slider"
import { CustomCursor } from "@/components/custom-cursor"
import { TechMarquee } from "@/components/resume/tech-marquee"
import { Timeline } from "@/components/resume/timeline"
import { CvActions } from "@/components/resume/cv-viewer"
import { ACTIVITIES, LANGUAGES, MARQUEE, PROJECT, SOFT_SKILLS, STACK } from "@/components/resume/data"

export const metadata: Metadata = {
  title: "Resume — Amika Fernando",
  description: "Experience, education and the stack behind the work of Amika Fernando, Software Engineer.",
}

// dark text on light brand colours, white on dark ones
const textOn = (hex: string) => {
  const n = parseInt(hex.slice(1), 16)
  const lum = (0.299 * (n >> 16) + 0.587 * ((n >> 8) & 255) + 0.114 * (n & 255)) / 255
  return lum > 0.6 ? "#0A0A0A" : "#FFFFFF"
}

const label = "font-mono text-xs uppercase tracking-widest opacity-60"
const hairline = { borderColor: "color-mix(in srgb, currentColor 18%, transparent)" }

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <CustomCursor />
      <Header />
      <div className="hidden md:block">
        <SocialSidebar />
      </div>

      <main>
        {/* hero */}
        <section className="mx-auto flex min-h-[80svh] max-w-7xl flex-col justify-end px-6 pb-16 pt-24 sm:px-10 lg:px-14">
          <p className={label}>Amika Fernando — Resume</p>
          <h1 className="mt-4 text-[clamp(5.5rem,21vw,19rem)] leading-[0.9]">Resume</h1>
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="max-w-xl space-y-4">
              <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#EF3B2D] opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#EF3B2D]" />
                </span>
                Currently: Software Engineer @ Infinit Tech Systems
              </p>
              <p className="text-lg leading-relaxed opacity-80">
                Motivated, always learning, and happiest when shipping. I build complex applications end to end, from
                the interface down to the database.
              </p>
            </div>
            <CvActions />
          </div>
        </section>

        <TechMarquee items={MARQUEE} />

        {/* experience & education */}
        <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 lg:px-14">
          <h2 className="mb-16 text-[clamp(3.5rem,9vw,9rem)] leading-[0.95]">Experience &amp; education</h2>
          <Timeline />
        </section>

        {/* stack */}
        <section className="bg-[#0A0A0A] px-6 py-28 text-white sm:px-10 lg:px-14">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-16 text-[clamp(3.5rem,9vw,9rem)] leading-[0.95]">The stack</h2>
            {STACK.map((group) => (
              <div
                key={group.group}
                className="grid gap-6 border-t py-10 md:grid-cols-[minmax(14rem,22rem)_1fr] md:gap-12"
                style={hairline}
              >
                <div>
                  <h3 className="font-display text-[clamp(2.5rem,5vw,4.5rem)] leading-[0.95]">{group.group}</h3>
                  <p className="mt-2 max-w-xs opacity-60">{group.blurb}</p>
                </div>
                <ul className="flex flex-wrap content-start gap-3">
                  {group.tools.map(({ name, icon: Icon, color }) => (
                    <li key={name}>
                      <span
                        className="flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors duration-300 hover:border-transparent hover:bg-[var(--brand)] hover:text-[var(--on-brand)] sm:text-base"
                        style={{ ...hairline, "--brand": color, "--on-brand": textOn(color) } as CSSProperties}
                      >
                        <Icon aria-hidden className="h-4 w-4 sm:h-5 sm:w-5" />
                        {name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* featured project */}
        <section className="mx-auto max-w-7xl px-6 py-28 sm:px-10 lg:px-14">
          <p className={label}>Featured project</p>
          <div className="mt-6 grid gap-10 border-t pt-10 md:grid-cols-2 md:gap-16" style={hairline}>
            <h2 className="text-[clamp(4rem,10vw,10rem)] leading-[0.9]">{PROJECT.name}</h2>
            <div className="flex flex-col justify-end gap-6">
              <p data-reveal className="text-xl leading-snug sm:text-2xl">
                {PROJECT.pitch}
              </p>
              <ul className="flex flex-wrap gap-2 font-mono text-xs uppercase tracking-widest">
                {PROJECT.stack.map((tech) => (
                  <li key={tech} className="rounded-full border px-3 py-1.5" style={hairline}>
                    {tech}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* beyond the code */}
        <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-10 lg:px-14">
          <h2 className="mb-14 text-[clamp(3.5rem,9vw,9rem)] leading-[0.95]">Beyond the code</h2>
          <div className="grid gap-12 md:grid-cols-3">
            <div>
              <p className={label}>Languages</p>
              <ul className="mt-5 space-y-5">
                {LANGUAGES.map((lang) => (
                  <li key={lang.name}>
                    <div className="flex items-baseline justify-between">
                      <span className="text-lg">{lang.name}</span>
                      <span className="font-mono text-xs uppercase tracking-widest opacity-60">{lang.level}</span>
                    </div>
                    <div className="mt-2 h-1 rounded-full" style={{ backgroundColor: "color-mix(in srgb, currentColor 15%, transparent)" }}>
                      <div className="h-full rounded-full bg-[#EF3B2D]" style={{ width: `${lang.value * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={label}>Off the keyboard</p>
              <ul className="mt-5 space-y-6">
                {ACTIVITIES.map((activity) => (
                  <li key={activity.name}>
                    <p className="font-display text-4xl leading-none">{activity.name}</p>
                    <p className="mt-1 opacity-70">{activity.detail}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className={label}>How I work</p>
              <ul className="mt-5 flex flex-wrap gap-2">
                {SOFT_SKILLS.map((skill) => (
                  <li key={skill} className="rounded-full border px-4 py-2" style={hairline}>
                    {skill}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
