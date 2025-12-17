"use client"

import { useEffect, useRef } from "react"

export function SnowEffect() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    canvas.width = width
    canvas.height = height

    const snowflakes: { x: number; y: number; radius: number; speed: number; opacity: number }[] = []
    const count = 100

    for (let i = 0; i < count; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    function update() {
      if (!ctx) return
      ctx.clearRect(0, 0, width, height)

      snowflakes.forEach((flake) => {
        // Draw
        ctx.beginPath()
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`
        ctx.fill()

        // Update
        flake.y += flake.speed
        flake.x += Math.sin(flake.y * 0.01) * 0.5 // Sway

        // Reset
        if (flake.y > height) {
          flake.y = -10
          flake.x = Math.random() * width
        }
      })

      requestAnimationFrame(update)
    }

    update()

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[50]"
      style={{ mixBlendMode: "screen" }}
    />
  )
}
