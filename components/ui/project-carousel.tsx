"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink, Github } from "lucide-react";
import { Button } from "./button";

interface Project {
  id: number | string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
  link?: string;
}

interface ProjectCarouselProps {
  projects: Project[];
  className?: string;
}

export function ProjectCarousel({ projects, className = "" }: ProjectCarouselProps) {
  const [index, setIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const rotate = (direction: "left" | "right") => {
    if (direction === "left") {
      setIndex((prev) => (prev - 1 + projects.length) % projects.length);
    } else {
      setIndex((prev) => (prev + 1) % projects.length);
    }
  };

  // Auto-rotate functionality
  useEffect(() => {
    if (isHovered) return;
    
    const interval = setInterval(() => {
      rotate("right");
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isHovered, projects.length]);

  return (
    <div 
      className={`relative w-full h-[600px] flex flex-col items-center justify-center overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D Carousel Container */}
      <div
        className="relative w-full max-w-4xl h-[500px] preserve-3d transition-transform duration-1000 ease-in-out"
        style={{
          transform: `perspective(1200px) rotateY(${-index * (180 / Math.min(projects.length, 6))}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {projects.slice(0, 6).map((project, i) => {
          const angle = (180 / Math.min(projects.length, 6)) * i;
          const isActive = index === i;
          
          return (
            <div
              key={project.id}
              className={`absolute top-1/2 left-1/2 w-[300px] h-[400px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-white rounded-xl shadow-lg p-6 flex flex-col transition-all duration-300 ${
                isActive ? 'scale-110 z-10' : 'opacity-90'
              }`}
              style={{
                transform: `translate(-50%, -50%) rotateY(${angle}deg) translateZ(${projects.length * 20}px)`,
                backfaceVisibility: "hidden",
              }}
            >
              {/* Project Image */}
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
              
              {/* Project Content */}
              <div className="flex-1 flex flex-col">
                <h2 className="text-xl font-bold mb-2 text-gray-800 dark:text-white">{project.title}</h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">{project.description}</p>
                
                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.slice(0, 3).map((tech, idx) => (
                    <span key={idx} className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-200">
                      {tech}
                    </span>
                  ))}
                  {project.technologies.length > 3 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-800/50 text-gray-400">
                      +{project.technologies.length - 3} more
                    </span>
                  )}
                </div>
                
                {/* Buttons */}
                <div className="mt-auto flex gap-2">
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Github className="w-4 h-4" />
                      Code
                    </a>
                  )}
                  {(project.liveLink || project.link) && (
                    <a
                      href={project.liveLink || project.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 px-3 py-2 text-sm bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" />
                      Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dots - Simplified */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {projects.slice(0, 6).map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === i ? 'bg-gray-800 dark:bg-white w-6' : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to project ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default ProjectCarousel;
