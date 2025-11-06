'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { v4 as uuidv4 } from 'uuid';
import { config } from 'react-spring';
import { X } from 'lucide-react';

import Carousel from './carousel-wrapper';

export interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  link?: string;
  category?: string;
  featured?: boolean;
  role?: string;
  year?: string;
  features?: string[];
  challenges?: string[];
  solutions?: string[];
}

interface Spring3DCarouselProps {
  projects: Project[];
  className?: string;
}

export function Spring3DCarousel({ projects, className = '' }: Spring3DCarouselProps) {
  const [goToSlide, setGoToSlide] = useState(0);
  const [offsetRadius, setOffsetRadius] = useState(5);
  const [showNavigation, setShowNavigation] = useState(true);
  const [animationConfig] = useState(config.gentle);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [slides, setSlides] = useState<Array<{
    key: string;
    content: React.ReactNode;
    onClick: () => void;
  }>>([]);
  const [mounted, setMounted] = useState(false);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedProject(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Type guard to check if project is defined
  const isProject = (project: Project | null): project is Project => {
    return project !== null;
  };

  useEffect(() => {
    // Update slides when projects change
    const newSlides = projects.map((project, index) => {
    const technologies = project.technologies || [];
    return {
      key: uuidv4(),
      content: (
        <div 
          key={project.id}
          className="w-[350px] h-[500px] relative group cursor-pointer"
          onClick={() => setSelectedProject(project)}
        >
          <div className="absolute inset-0 rounded-2xl overflow-hidden shadow-2xl bg-white dark:bg-gray-800 transition-colors duration-300">
            <div className="relative h-2/3 overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title} 
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-6 h-1/3 flex flex-col justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.title}
                </h3>
                <p className="mt-2 text-gray-600 dark:text-gray-300 line-clamp-2">
                  {project.description}
                </p>
              </div>
              
              <div className="mt-4">
                <div className="flex flex-wrap gap-2 mb-3">
                  {technologies.slice(0, 4).map((tech: string, idx: number) => (
                    <span 
                      key={idx} 
                      className="text-xs font-medium px-3 py-1.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-3 mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                  {project.githubUrl && (
                    <a 
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                      </svg>
                      Code
                    </a>
                  )}
                  {project.liveUrl && (
                    <a 
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1 transition-colors"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                        <polyline points="15 3 21 3 21 9"></polyline>
                        <line x1="10" y1="14" x2="21" y2="3"></line>
                      </svg>
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      onClick: () => setGoToSlide(index)
    };
  });
    
    setSlides(newSlides);
  }, [projects]);

  // Set mounted state and handle window resize
  useEffect(() => {
    setMounted(true);
    
    const handleResize = () => {
      setOffsetRadius(window.innerWidth < 768 ? 2 : 5);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  if (!mounted) {
    return (
      <div className={`w-full h-[600px] md:h-[800px] ${className} flex items-center justify-center`}>
        <div className="animate-pulse text-gray-400">Loading projects...</div>
      </div>
    );
  }

  return (
    <>
      <div className={`w-full h-[550px] md:h-[700px] ${className} relative`}>
        <div className="absolute top-0 md:-top-6 left-0 right-0 text-center z-10">
          <h2 className="text-3xl md:text-5xl font-bold mb-1 md:mb-2">
            <span className="relative">
              <span className="text-black dark:text-white">My</span>
              <span className="relative">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600"> Works</span>
                <span className="absolute bottom-0 left-0 right-0 h-1 bg-cyan-400 rounded-full -mt-1"></span>
              </span>
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mt-2">
            Here are some of my recent works and contributions
          </p>
        </div>
        <div className="w-full h-full flex items-center justify-center mt-12 md:mt-0">
        {slides.length > 0 && (
          <div onClick={(e) => e.stopPropagation()}>
            <Carousel
              slides={slides}
              goToSlide={goToSlide}
              offsetRadius={offsetRadius}
              showNavigation={showNavigation}
              animationConfig={animationConfig}
            />
          </div>
        )}
      </div>
        
        {/* Navigation Arrows - Minimal gap */}
        <div className="mt-0 flex justify-center gap-2">
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setGoToSlide(prev => (prev - 1 + projects.length) % projects.length);
            }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all transform hover:scale-110"
            aria-label="Previous project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setGoToSlide(prev => (prev + 1) % projects.length);
            }}
            className="p-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-all transform hover:scale-110"
            aria-label="Next project"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Project Quick View Modal */}
      {isProject(selectedProject) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setSelectedProject(null)}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              aria-label="Close modal"
            >
              <X size={24} />
            </button>
            
            <div className="grid md:grid-cols-2 gap-6 p-6">
              <div className="rounded-xl overflow-hidden">
                <img 
                  src={selectedProject.image} 
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-lg object-cover"
                />
              </div>
              
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {selectedProject.title}
                </h2>
                
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  {selectedProject.description}
                </p>
                
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech, idx) => (
                      <span 
                        key={idx}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 text-sm rounded-full"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  {selectedProject.githubUrl && (
                    <a 
                      href={selectedProject.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <span>View Code</span>
                    </a>
                  )}
                  {selectedProject.liveUrl && (
                    <a 
                      href={selectedProject.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
                    >
                      <span>Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Spring3DCarousel;
