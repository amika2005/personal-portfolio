"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  color: string
}

interface ParticleButtonProps 
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const ParticleButton = React.forwardRef<HTMLButtonElement, ParticleButtonProps>(
  ({ className, variant, size, asChild = false, children, ...props }, ref) => {
    const [particles, setParticles] = React.useState<Particle[]>([])
    const buttonRef = React.useRef<HTMLButtonElement>(null)
    const animationFrameRef = React.useRef<number>()
    const particleCount = 30
    const COLORS = ["#3B82F6"] // Blue color to match your theme
    const Comp = asChild ? Slot : "button"
    
    const createParticles = (x: number, y: number) => {
      const newParticles: Particle[] = []
      
      for (let i = 0; i < particleCount; i++) {
        const angle = (Math.PI * 2 * i) / particleCount
        const speed = 2 + Math.random() * 3
        const size = 2 + Math.random() * 3
        
        newParticles.push({
          x,
          y,
          size,
          speedX: Math.cos(angle) * speed,
          speedY: Math.sin(angle) * speed,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
        })
      }
      
      setParticles(newParticles)
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      createParticles(x, y)
      
      if (props.onClick) {
        props.onClick(e)
      }
    }

    React.useEffect(() => {
      const updateParticles = () => {
        setParticles(prevParticles => 
          prevParticles
            .map(particle => ({
              ...particle,
              x: particle.x + particle.speedX,
              y: particle.y + particle.speedY,
              speedY: particle.speedY + 0.1, // gravity
            }))
            .filter(particle => {
              const rect = buttonRef.current?.getBoundingClientRect()
              if (!rect) return false
              return (
                particle.x > -20 &&
                particle.x < rect.width + 20 &&
                particle.y > -20 &&
                particle.y < rect.height + 100
              )
            })
        )
        
        if (particles.length > 0) {
          animationFrameRef.current = requestAnimationFrame(updateParticles)
        }
      }
      
      if (particles.length > 0) {
        animationFrameRef.current = requestAnimationFrame(updateParticles)
      }
      
      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
      }
    }, [particles.length])

    return (
      <div className="relative inline-block">
        <Comp
          ref={(node: HTMLButtonElement) => {
            if (ref) {
              if (typeof ref === 'function') {
                ref(node)
              } else {
                ref.current = node
              }
            }
            // @ts-ignore
            buttonRef.current = node
          }}
          className={cn(
            buttonVariants({ variant, size, className }),
            "relative overflow-visible"
          )}
          onClick={handleClick}
          {...props}
        >
          <span className="relative z-10">
            <span className="absolute inset-0 w-full h-full bg-white/20 group-hover:bg-white/0 transition-all duration-500 group-hover:scale-150 opacity-0 group-hover:opacity-100 rounded-full" />
            <span className="relative">{children}</span>
            <span className="absolute -right-4 opacity-0 group-hover:opacity-100 group-hover:right-2 transition-all duration-300">→</span>
          </span>
        </Comp>
        
        <div className="absolute inset-0 pointer-events-none">
          {particles.map((particle, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                left: `${particle.x}px`,
                top: `${particle.y}px`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                transform: 'translate(-50%, -50%)',
                transition: 'transform 0.1s ease-out',
              }}
            />
          ))}
        </div>
      </div>
    )
  }
)

ParticleButton.displayName = 'ParticleButton'
