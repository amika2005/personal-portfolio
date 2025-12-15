"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import { useEffect, useRef, useState } from "react"

interface Resource {
  id: number
  title: string
  description: string
  image: string
  category: string
  link: string
}

interface ResourceCardProps {
  resource: Resource
  index: number
}

export function ResourceCard({ resource, index }: ResourceCardProps) {
  const [isVisible, setIsVisible] = useState(false)
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

  return (
    <Card
      ref={cardRef}
      className={`group hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer ${
        isVisible ? `animate-fade-in-up animate-stagger-${(index % 4) + 1}` : "opacity-0"
      }`}
      onClick={() => window.open(resource.link, "_blank")}
    >
      <CardHeader className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <img
            src={resource.image || "/placeholder.svg"}
            alt={resource.title}
            className="w-full h-32 object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          <div className="absolute top-2 right-2">
            <ExternalLink className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">
            {resource.category}
          </Badge>
        </div>
        <CardTitle className="text-sm mb-2 group-hover:text-red-500 transition-colors line-clamp-2">
          {resource.title}
        </CardTitle>
        <CardDescription className="text-xs leading-relaxed line-clamp-3">{resource.description}</CardDescription>
      </CardContent>
    </Card>
  )
}
