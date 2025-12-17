"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

// Register GSAP plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

const skills = [
  { 
    name: "RESEARCH", 
    media: "/research.mp4", 
    type: "video",
    description: "Uncovering user needs through deep analysis and data-driven insights.",
    color: "#beef00" // Neon Green
  },
  { 
    name: "WIREFRAME", 
    media: "/wireframe.webp", 
    type: "image",
    description: "Building the skeletal blueprint to map out seamless user journeys.",
    color: "#ff0028" // Neon Red
  },
  { 
    name: "UI DESIGN", 
    media: "/UI_design.jpg", 
    type: "image",
    description: "Crafting visually stunning interfaces that captivate and engage.",
    color: "#00eaff" // Neon Cyan
  },
  { 
    name: "PROTOTYPE", 
    media: "/Prototype.webp", 
    type: "image",
    description: "Bringing designs to life with interactive, high-fidelity models.",
    color: "#d300ff" // Neon Purple
  },
  { 
    name: "INTERACTION", 
    media: "/interaction.mp4", 
    type: "video",
    description: "Creating fluid, intuitive movements that respond to every touch.",
    color: "#FF6B00" // Neon Orange
  },
]

export function GsapSkillsSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const skillItemsRef = useRef<HTMLDivElement[]>([])
  const mediaContainerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    
    const container = containerRef.current
    const leftCol = leftColRef.current
    const rightCol = rightColRef.current
    const skillItems = skillItemsRef.current
    const mediaContainer = mediaContainerRef.current
    const titleEl = titleRef.current
    const backgroundEl = backgroundRef.current

    if (!container || !leftCol || !rightCol || !mediaContainer) return

    const ctx = gsap.context(() => {
      // Animate the title when section comes into view - Fade In Down
      if (titleEl) {
        gsap.fromTo(titleEl, 
          { 
            y: -100, 
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 60%", /* Trigger a bit earlier */
              toggleActions: "play none none reverse"
            }
          }
        )
      }

      // Pin the left column while scrolling through skills
      ScrollTrigger.create({
        trigger: rightCol,
        start: "top top",
        end: "bottom bottom",
        pin: leftCol,
        pinSpacing: false,
      })

      // Track current active skill
      let currentSkillIndex = -1

      // Create ScrollTrigger for each skill item
      skillItems.forEach((item, index) => {
        if (!item) return

        // Trigger for activating skill and changing media
        ScrollTrigger.create({
          trigger: item,
          start: "top 60%", // Activate when item is near vertical center
          end: "bottom 40%",
          onEnter: () => {
             if (currentSkillIndex !== index) {
               currentSkillIndex = index
               activateSkill(index)
             }
          },
          onEnterBack: () => {
             if (currentSkillIndex !== index) {
               currentSkillIndex = index
               activateSkill(index)
             }
          },
          // Specific logic for the first item: if we scroll back up above it, reset background
          onLeaveBack: () => {
             if (index === 0 && backgroundEl) {
               currentSkillIndex = -1
               // Reset background to transparent
               gsap.to(backgroundEl, {
                 opacity: 0,
                 duration: 0.5,
                 ease: "power2.out"
               })
             }
          },
          // Specific logic for the last item: if we scroll down past it, fade out background
          onLeave: () => {
             if (index === skillItems.length - 1 && backgroundEl) {
               // Reset index so onEnterBack triggers reuse
               currentSkillIndex = -1 
               
               // Reset background to transparent
               gsap.to(backgroundEl, {
                 opacity: 0,
                 duration: 0.5,
                 ease: "power2.out"
               })
             }
          }
        })
      })

      // Function to activate a skill and change media/background
      function activateSkill(index: number) {
        // Remove active from all
        skillItems.forEach(item => item?.classList.remove("active"))
        // Add active to current
        skillItems[index]?.classList.add("active")
        
        // Update background color using a very subtle opacity to maintain readability
        if (backgroundEl) {
          gsap.to(backgroundEl, {
            backgroundColor: skills[index].color,
            opacity: 0.15, // Low opacity for subtle tint
            duration: 0.8,
            ease: "power2.inOut"
          })
        }

        // Update media
        if (mediaContainer) {
          const allMedia = mediaContainer.querySelectorAll('.skill-media')
          allMedia.forEach((media, i) => {
            const el = media as HTMLElement
            if (i === index) {
              // Show this media with fall-down animation
              gsap.set(el, { zIndex: 10 })
              gsap.fromTo(el, 
                { 
                  opacity: 0, 
                  y: -100,
                  scale: 1.05
                },
                { 
                  opacity: 1, 
                  y: 0,
                  scale: 1, 
                  duration: 0.7, 
                  ease: "power3.out"
                }
              )
              // Play video if it's a video
              const video = el.querySelector('video')
              if (video) {
                video.currentTime = 0
                video.play()
              }
            } else {
              // Hide other media - fall down and fade out
              gsap.to(el, { 
                opacity: 0, 
                y: 50,
                scale: 0.95,
                duration: 0.4,
                ease: "power2.in",
                onComplete: () => { gsap.set(el, { zIndex: 1 }) }
              })
              // Pause video if it's a video
              const video = el.querySelector('video')
              if (video) {
                video.pause()
              }
            }
          })
        }
      }

      // NO initial activation - wait for scroll
      // setTimeout(() => activateSkill(0), 100)

    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <>
      {/* Google Font for bold typography */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');
        
        .skill-item {
          transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Split Text Animation Styles */
        .split-text-wrapper {
          position: relative;
          display: inline-block;
          cursor: pointer;
        }

        .split-text-top,
        .split-text-bottom {
          display: block;
          /* Elastic/Spring Easing for a heavy, premium feel */
          transition: transform 0.6s cubic-bezier(0.68, -0.6, 0.32, 1.6), 
                      color 0.4s ease, 
                      letter-spacing 0.4s ease;
          color: transparent;
          -webkit-text-stroke: 1.5px rgba(0, 0, 0, 0.15);
        }

        :root.dark .split-text-top,
        :root.dark .split-text-bottom {
          -webkit-text-stroke: 1.5px rgba(255, 255, 255, 0.2);
        }

        /* Top half clipped */
        .split-text-top {
          clip-path: polygon(0 0, 100% 0, 100% 50%, 0 50%);
        }

        /* Bottom half clipped - positioned absolutely to overlay exactly */
        .split-text-bottom {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          clip-path: polygon(0 50%, 100% 50%, 100% 100%, 0 100%);
        }

        .skill-description {
          position: absolute;
          top: 50%;
          right: 0;
          width: 100%;
          /* Initial state: pushed down and invisible */
          transform: translateY(20px) scaleY(0.8); 
          transform-origin: center;
          opacity: 0;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          transition-delay: 0.1s; /* Slight delay for stagger effect */
          pointer-events: none;
          text-align: right;
          padding-right: 0.5rem;
        }
        
        /* HOVER EFFECTS */
        .split-text-wrapper:hover .split-text-top {
          transform: translateY(-24px);
          letter-spacing: 0.05em; /* Breathing effect */
          color: var(--hover-color);
          -webkit-text-stroke: 0px;
        }
        
        .split-text-wrapper:hover .split-text-bottom {
          transform: translateY(24px);
          letter-spacing: 0.05em; /* Breathing effect */
          color: var(--hover-color);
          -webkit-text-stroke: 0px;
        }

        .split-text-wrapper:hover .skill-description {
          opacity: 1;
          /* Slide up to center */
          transform: translateY(-50%) scaleY(1);
          text-shadow: 0 0 20px var(--hover-color-glow, rgba(255,255,255,0.3));
        }

        /* ACTIVE STATE (scroll-driven) COLORS & GLOWS */
        .skill-item[data-skill="RESEARCH"] { 
          --hover-color: #beef00; 
          --hover-color-glow: rgba(190, 239, 0, 0.4);
        }
        .skill-item[data-skill="WIREFRAME"] { 
          --hover-color: #ff0028; 
          --hover-color-glow: rgba(255, 0, 40, 0.4);
        }
        .skill-item[data-skill="UI DESIGN"] { 
          --hover-color: #00eaff; 
          --hover-color-glow: rgba(4, 182, 173, 0.4);
        }
        .skill-item[data-skill="PROTOTYPE"] { 
          --hover-color: #d300ff; 
          --hover-color-glow: rgba(211, 0, 255, 0.4);
        }
        .skill-item[data-skill="INTERACTION"] { 
          --hover-color: #FF6B00; 
          --hover-color-glow: rgba(255, 107, 0, 0.4);
        }

        /* Ensure active item also gets colored - slightly dimmed when NOT hovering */
        .skill-item.active .split-text-top,
        .skill-item.active .split-text-bottom {
           color: var(--hover-color);
           -webkit-text-stroke: 0px;
           opacity: 1;
           /* Subtle glow for active state */
           filter: drop-shadow(0 0 2px var(--hover-color-glow));
        }

      `}</style>

      <section 
        ref={containerRef}
        className="relative text-gray-900 dark:text-white transition-colors duration-700"
      >
        {/* Dynamic Background Layer */}
        <div 
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ backgroundColor: 'transparent', opacity: 0 }}
        />

        {/* Section Title */}
        <div className="relative text-center pt-12 pb-8 z-10">
          <div ref={titleRef}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4">
              My Process
            </h2>
            <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
          </div>
        </div>

        {/* Main Container - Flex Row */}
        <div className="relative z-10 flex min-h-screen">
          
          {/* LEFT COLUMN - Pinned Media (50%) */}
          <div 
            ref={leftColRef}
            className="hidden lg:flex lg:w-1/2 h-screen items-center justify-center p-8 lg:p-12"
          >
            <div className="relative">
              
              {/* Media Display Box */}
              <div 
                ref={mediaContainerRef}
                className="relative overflow-hidden bg-gray-100 dark:bg-gray-900"
                style={{
                  width: "340px",
                  height: "505.6px"
                }}
              >
                
                {/* Media items */}
                {skills.map((skill, index) => (
                  <div
                    key={skill.name}
                    className="skill-media absolute inset-0"
                    style={{ 
                      opacity: index === 0 ? 1 : 0,
                      zIndex: index === 0 ? 10 : 1
                    }}
                  >
                    {skill.type === "video" ? (
                      <video
                        src={skill.media}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay={index === 0}
                      />
                    ) : (
                      <Image
                        src={skill.media}
                        alt={skill.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    )}
                    
                  </div>
                ))}

              </div>

              {/* Progress indicator */}
              <div className="flex items-center justify-center gap-2 mt-8">
                {skills.map((_, i) => (
                  <div 
                    key={i}
                    className="h-1 rounded-full bg-white/20 transition-all duration-500 indicator-dot"
                    style={{ width: 8 }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Scrollable Skills (50%) */}
          <div 
            ref={rightColRef}
            className="w-full lg:w-1/2 flex flex-col justify-start px-6 lg:px-8 lg:pr-16"
          >
            
            {/* Top Spacer */}
            <div className="h-[2vh] lg:h-[15vh]" />

            {/* Skills List */}
            {skills.map((skill, index) => (
              <div
                key={skill.name}
                ref={(el) => { if (el) skillItemsRef.current[index] = el }}
                data-skill={skill.name}
                className="skill-item py-8 lg:py-0 lg:min-h-[35vh] flex items-center justify-center lg:justify-end"
                style={{ fontFamily: "'Oswald', 'Impact', sans-serif" }}
              >
                <div className="relative w-full text-center lg:text-right">
                  
                  {/* Mobile media */}
                  <div className="lg:hidden mb-3 w-full max-w-sm mx-auto aspect-[4/3] rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800 shadow-md">
                    {skill.type === "video" ? (
                      <video
                        src={skill.media}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay
                      />
                    ) : (
                      <Image
                        src={skill.media}
                        alt={skill.name}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                  
                  {/* SPLIT TEXT ANIMATION WRAPPER */}
                  <div className="split-text-wrapper relative inline-block group">
                    {/* Top Half */}
                    <h3 className="split-text-top text-[11vw] sm:text-[9vw] lg:text-[9vw] font-bold uppercase leading-[0.95] tracking-tight">
                      {skill.name}
                    </h3>
                    
                    {/* Bottom Half */}
                    <h3 className="split-text-bottom text-[11vw] sm:text-[9vw] lg:text-[9vw] font-bold uppercase leading-[0.95] tracking-tight">
                      {skill.name}
                    </h3>

                    {/* Description Revealed in Middle */}
                    <div className="skill-description flex items-center justify-center lg:justify-end">
                      <p className="text-sm sm:text-base lg:text-lg font-sans font-medium text-gray-600 dark:text-gray-300 max-w-[200px] lg:max-w-[300px] leading-tight">
                        {skill.description}
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            ))}

            {/* Bottom Spacer */}
            <div className="h-[10vh] lg:h-[55vh]" />
          </div>
        </div>
      </section>
    </>
  )
}
