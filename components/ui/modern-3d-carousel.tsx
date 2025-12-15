'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useTransform, Variants } from 'framer-motion';
import { Button } from './button';
import { ArrowLeft, ArrowRight, ExternalLink, Github, MoveLeft, MoveRight } from 'lucide-react';

interface Project {
  id: number | string;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubLink?: string;
  liveLink?: string;
}

interface Modern3DCarouselProps {
  projects: Project[];
  className?: string;
}

export function Modern3DCarousel({ projects, className = '' }: Modern3DCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [direction, setDirection] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // Animation variants for smooth transitions
  const variants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      scale: 0.9,
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.2 }
      }
    })
  };
  
  // Handle project navigation
  const paginate = useCallback((newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(prev => (prev + newDirection + projects.length) % projects.length);
  }, [projects.length]);
  
  // Calculate visible projects
  const getVisibleProjects = useCallback(() => {
    const prevIndex = (currentIndex - 1 + projects.length) % projects.length;
    const nextIndex = (currentIndex + 1) % projects.length;
    return [prevIndex, currentIndex, nextIndex];
  }, [currentIndex, projects.length]);

  return (
    <div 
      className={`relative w-full h-[600px] overflow-hidden ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900" />
      
      {/* Floating orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/3 -left-1/4 w-96 h-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-1/4 -right-1/4 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl" />
      </div>
      
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute w-full max-w-4xl h-[80%]"
          >
            <ProjectCard 
              project={projects[currentIndex]} 
              isActive={true}
            />
          </motion.div>
        </AnimatePresence>
      </div>
      
      {/* Navigation */}
      <div className="absolute bottom-8 left-0 right-0 z-20">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <button 
              onClick={() => paginate(-1)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white"
              aria-label="Previous project"
            >
              <MoveLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Previous</span>
            </button>
            
            <div className="flex gap-2">
              {projects.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentIndex ? 'w-8 bg-white' : 'w-3 bg-white/30'
                  }`}
                  aria-label={`Go to project ${index + 1}`}
                />
              ))}
            </div>
            
            <button 
              onClick={() => paginate(1)}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-lg border border-white/10 hover:bg-white/10 transition-all duration-300 text-white/80 hover:text-white"
              aria-label="Next project"
            >
              <span className="text-sm font-medium">Next</span>
              <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectCard({ project, isActive }: { project: any, isActive: boolean }) {
  return (
    <div className="relative w-full h-full group">
      {/* Glassmorphism card */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
        {/* Background Image with gradient overlay */}
        <div className="absolute inset-0">
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black/90" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
          <motion.div 
            className="space-y-4"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {/* Technologies */}
            <div className="flex flex-wrap gap-2">
              {project.technologies.slice(0, 4).map((tech: string, i: number) => (
                <motion.span 
                  key={i}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3 + (i * 0.05) }}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-white/10 backdrop-blur-sm text-white/90 border border-white/5"
                >
                  {tech}
                </motion.span>
              ))}
              {project.technologies.length > 4 && (
                <span className="px-3 py-1 text-xs text-white/60 bg-white/5 rounded-full border border-white/5">
                  +{project.technologies.length - 4} more
                </span>
              )}
            </div>
            
            {/* Title & Description */}
            <div className="space-y-3">
              <motion.h3 
                className="text-2xl md:text-4xl font-bold text-white"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {project.title}
              </motion.h3>
              <motion.p 
                className="text-white/80 line-clamp-2 text-sm md:text-base"
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                {project.description}
              </motion.p>
            </div>
            
            {/* Buttons */}
            <motion.div 
              className="flex flex-wrap gap-3 pt-2"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {project.githubLink && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  asChild
                  className="gap-2 bg-white/5 hover:bg-white/10 border-white/10 backdrop-blur-sm text-white/90 hover:text-white transition-all"
                >
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4" />
                    View Code
                  </a>
                </Button>
              )}
              
              {(project.liveLink || project.link) && (
                <Button 
                  size="sm" 
                  asChild 
                  className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all"
                >
                  <a href={project.liveLink || project.link} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4" />
                    Live Demo
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
      
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/30 to-blue-500/30 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />
    </div>
  );
}
