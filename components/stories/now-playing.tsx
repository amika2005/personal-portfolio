"use client"

import { useEffect, useRef, useState } from "react"

const TRACK = { title: "Night Changes", artist: "One Direction", src: "/Night-Changes.mp3" }
const BARS = 5

/**
 * Opt-in soundtrack: a spinning record plus equalizer bars driven by the music itself.
 * Nothing loads or plays until the visitor asks for it (browsers block autoplay anyway).
 */
export function NowPlaying() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const barsRef = useRef<(HTMLSpanElement | null)[]>([])
  const analyserRef = useRef<AnalyserNode | null>(null)
  const ctxRef = useRef<AudioContext | null>(null)
  const [playing, setPlaying] = useState(false)

  // equalizer: sample the analyser each frame while playing
  useEffect(() => {
    if (!playing) {
      barsRef.current.forEach((bar) => bar && (bar.style.transform = "scaleY(0.15)"))
      return
    }
    const analyser = analyserRef.current
    const data = analyser ? new Uint8Array(analyser.frequencyBinCount) : null
    let raf = 0
    const tick = () => {
      if (analyser && data) {
        analyser.getByteFrequencyData(data)
        const band = Math.floor(data.length / (BARS * 2))
        barsRef.current.forEach((bar, i) => {
          if (!bar) return
          let sum = 0
          for (let j = 0; j < band; j++) sum += data[i * band + j]
          bar.style.transform = `scaleY(${Math.max(0.15, sum / band / 255)})`
        })
      }
      raf = requestAnimationFrame(tick)
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [playing])

  useEffect(() => () => void ctxRef.current?.close(), [])

  const toggle = async () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
      return
    }
    // the analyser graph can only be built once per element, and only after a user gesture
    if (!ctxRef.current) {
      try {
        const ctx = new AudioContext()
        const analyser = ctx.createAnalyser()
        analyser.fftSize = 64
        ctx.createMediaElementSource(audio).connect(analyser)
        analyser.connect(ctx.destination)
        ctxRef.current = ctx
        analyserRef.current = analyser
      } catch {
        // no Web Audio: the music still plays, the bars just stay still
      }
    }
    await ctxRef.current?.resume()
    try {
      await audio.play()
      setPlaying(true)
    } catch {
      setPlaying(false)
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <button
        type="button"
        onClick={toggle}
        aria-pressed={playing}
        aria-label={playing ? `Pause ${TRACK.title}` : `Play ${TRACK.title}`}
        className="group flex items-center gap-3 rounded-full bg-[#141414] py-2 pl-2 pr-4 text-left sm:pr-5 text-white shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)] transition-transform hover:scale-[1.03]"
      >
        {/* the record */}
        <span
          aria-hidden
          className="relative grid h-11 w-11 animate-spin place-items-center rounded-full"
          style={{
            background:
              "repeating-radial-gradient(circle at center, #1d1d1d 0 2px, #0c0c0c 2px 4px)",
            animationDuration: "3s",
            animationPlayState: playing ? "running" : "paused",
          }}
        >
          <span className="h-4 w-4 rounded-full bg-[#EF3B2D]" />
          <span className="absolute h-1 w-1 rounded-full bg-[#141414]" />
        </span>

        {/* on phones it's just the record and the bars, so it doesn't cover the page */}
        <span className="hidden flex-col leading-tight sm:flex">
          <span className="font-mono text-[10px] uppercase tracking-widest text-white/60">
            {playing ? "Now playing" : "Sound off — tap to play"}
          </span>
          <span className="text-sm">
            {TRACK.title} <span className="text-white/50">· {TRACK.artist}</span>
          </span>
        </span>

        <span aria-hidden className="flex h-5 items-end gap-[3px] sm:ml-1">
          {Array.from({ length: BARS }, (_, i) => (
            <span
              key={i}
              ref={(el) => {
                barsRef.current[i] = el
              }}
              className="h-full w-[3px] origin-bottom rounded-full bg-[#EF3B2D] transition-transform duration-75"
              style={{ transform: "scaleY(0.15)" }}
            />
          ))}
        </span>
      </button>
      <audio ref={audioRef} src={TRACK.src} loop preload="none" onEnded={() => setPlaying(false)} />
    </div>
  )
}
