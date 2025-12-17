"use client"

import { useEffect, useRef } from "react"

class Particle {
  x: number
  y: number
  vx: number
  vy: number
  alpha: number
  color: string

  constructor(x: number, y: number, color: string) {
    this.x = x
    this.y = y
    // Random velocity
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 3 + 1
    this.vx = Math.cos(angle) * speed
    this.vy = Math.sin(angle) * speed
    this.alpha = 1
    this.color = color
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.vy += 0.05 // Gravity
    this.alpha -= 0.02 // Fade out
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.save()
    ctx.globalAlpha = this.alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
  }
}

export function FireworksEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let particles: Particle[] = []

    const colors = ["#ff0", "#f0f", "#0ff", "#0f0", "#f00"]

    function createExplosion(x: number, y: number) {
      const color = colors[Math.floor(Math.random() * colors.length)]
      for (let i = 0; i < 50; i++) {
        particles.push(new Particle(x, y, color))
      }
    }

    // Auto launch fireworks near the header area (top 20%)
    const interval = setInterval(() => {
        const x = Math.random() * window.innerWidth
        const y = Math.random() * (window.innerHeight * 0.3) // Top 30%
        createExplosion(x, y)
    }, 800)

    function animate() {
      if (!ctx || !canvas) return
      // Trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)" 
      ctx.fillRect(0, 0, canvas.width, canvas.height) // This assumes dark mode, might need transparent clear if overlay

      // Actually, since this is an overlay, we should create a trail using clearRect?
      // No, for overlay on website, we usually want distinct particles.
      // Let's just clearRect for transparency.
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p, index) => {
        p.update()
        p.draw(ctx)
        if (p.alpha <= 0) particles.splice(index, 1)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => clearInterval(interval)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
    />
  )
}
