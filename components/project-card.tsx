"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github, X } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import type { Project } from "@/components/ui/spring-3d-carousel"

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (cardRef.current) {
      observer.observe(cardRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const toggleQuickView = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(!showQuickView)
  }

  const closeQuickView = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowQuickView(false)
  }

  return (
    <div className="relative">
      <Card
        ref={cardRef}
        onClick={toggleQuickView}
        className={cn(
          'relative overflow-hidden transition-all duration-500 ease-in-out transform cursor-pointer',
          'hover:scale-[1.02] bg-card/80 backdrop-blur-sm border-border/50',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10',
        )}
        style={{
          transitionDelay: `${index * 100}ms`,
        }}
      >
        <div className="relative h-48 overflow-hidden">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
            <div>
              <h3 className="text-xl font-bold text-white">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.role || 'Full Stack Developer'}</p>
            </div>
          </div>
        </div>
        <CardContent className="p-4">
          <p className="text-foreground/90 line-clamp-3 mb-4 text-sm">{project.description}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {project.technologies.slice(0, 3).map((tech) => (
              <Badge key={tech} variant="secondary" className="text-xs">
                {tech}
              </Badge>
            ))}
            {project.technologies.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{project.technologies.length - 3} more
              </Badge>
            )}
          </div>
          <div className="flex justify-between items-center">
            <Badge variant={project.featured ? 'default' : 'outline'} className="text-xs">
              {project.category}
            </Badge>
            <Button variant="outline" size="sm" className="text-xs">
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <AnimatePresence>
        {showQuickView && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={closeQuickView}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-card rounded-lg shadow-2xl border border-border/50"
            >
              <button
                onClick={closeQuickView}
                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 hover:bg-accent transition-colors"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">{project.title}</h2>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>{project.role || 'Full Stack Developer'}</span>
                      {project.year && <span>• {project.year}</span>}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-foreground">Project Overview</h3>
                    <p className="text-foreground/90">{project.description}</p>
                  </div>

                  {project.features && project.features.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Key Features</h3>
                      <ul className="space-y-2">
                        {project.features.map((feature, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-primary mr-2">•</span>
                            <span className="text-foreground/90">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="pt-4 border-t border-border/50">
                    <div className="flex flex-wrap gap-2">
                      {project.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4">
                    {project.githubUrl && (
                      <Button asChild variant="outline" className="flex-1">
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View Code
                        </a>
                      </Button>
                    )}
                    {project.liveUrl && (
                      <Button asChild className="flex-1">
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-lg overflow-hidden border border-border">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-auto object-cover"
                    />
                  </div>

                  {project.challenges && project.challenges.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Challenges</h3>
                      <ul className="space-y-2">
                        {project.challenges.map((challenge, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-destructive mr-2">•</span>
                            <span className="text-foreground/90">{challenge}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {project.solutions && project.solutions.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2 text-foreground">Solutions</h3>
                      <ul className="space-y-2">
                        {project.solutions.map((solution, i) => (
                          <li key={i} className="flex items-start">
                            <span className="text-success mr-2">•</span>
                            <span className="text-foreground/90">{solution}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
