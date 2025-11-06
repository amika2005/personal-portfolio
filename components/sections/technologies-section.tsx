"use client"

import { useEffect, useRef, useState } from "react"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHtml5, faCss3Alt, faJs, faReact, faNodeJs } from '@fortawesome/free-brands-svg-icons'
import { faCodeBranch } from '@fortawesome/free-solid-svg-icons'

const technologies = [
  { name: "HTML", color: "#E34F26", icon: faHtml5 },
  { name: "CSS", color: "#1572B6", icon: faCss3Alt },
  { name: "JavaScript", color: "#F7DF1E", icon: faJs },
  { name: "React", color: "#61DAFB", icon: faReact },
  { name: "Node.js", color: "#339933", icon: faNodeJs },
  { name: "TypeScript", color: "#3178C6", icon: faCodeBranch },
]

export function TechnologiesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 overflow-hidden px-4 sm:px-6">
      <div className={`${isVisible ? "animate-fade-in-up" : "opacity-0"} max-w-7xl mx-auto`}>
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">
            Programming Languages
          </h2>
          <div className="w-16 sm:w-20 lg:w-24 h-1 bg-blue-600 mx-auto rounded-full"></div>
        </div>
        
        <div className="relative">
          <div className="flex animate-scroll">
            {/* First set of technologies */}
            {technologies.map((tech, index) => (
              <div
                key={`first-${index}`}
                className="flex-shrink-0 mx-4 sm:mx-6 lg:mx-8 flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-3 sm:mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                  <FontAwesomeIcon 
                    icon={tech.icon} 
                    className="text-2xl sm:text-3xl lg:text-4xl"
                    style={{ color: tech.color }}
                  />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-medium sm:font-semibold text-gray-700 dark:text-gray-300 text-center">
                  {tech.name}
                </span>
              </div>
            ))}
            
            {/* Duplicate set for seamless infinite scroll */}
            {technologies.map((tech, index) => (
              <div
                key={`second-${index}`}
                className="flex-shrink-0 mx-4 sm:mx-6 lg:mx-8 flex flex-col items-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mb-3 sm:mb-4 flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg shadow-lg hover:scale-105 transition-transform duration-300">
                  <FontAwesomeIcon 
                    icon={tech.icon} 
                    className="text-2xl sm:text-3xl lg:text-4xl"
                    style={{ color: tech.color }}
                  />
                </div>
                <span className="text-sm sm:text-base lg:text-lg font-medium sm:font-semibold text-gray-700 dark:text-gray-300 text-center">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
