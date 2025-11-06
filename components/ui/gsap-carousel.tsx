'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

interface GSAPCarouselProps {
  projects: Project[];
  className?: string;
}

export function GSAPCarousel({ projects, className = '' }: GSAPCarouselProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const imgRefs = useRef<(HTMLDivElement | null)[]>([]);
  const setImgRef = (element: HTMLDivElement | null, index: number) => {
    imgRefs.current[index] = element;
  };
  const xPos = useRef(0);

  useEffect(() => {
    const ring = ringRef.current;
    const images = imgRefs.current.filter(Boolean) as HTMLDivElement[];
    
    if (!ring || images.length === 0) return;

    const getBgPos = (i: number) => {
      if (!ring) return '0px 0px';
      const ringRotation = gsap.getProperty(ring, 'rotationY') as number;
      const wrappedRotation = gsap.utils.wrap(0, 360, ringRotation - 180 - i * (360 / projects.length));
      const parallaxValue = (100 - wrappedRotation / 360 * 500);
      return `${parallaxValue}px 0px`;
    };

    // GSAP Timeline & Setup
    gsap.timeline()
      .set(ring, { rotationY: 180, cursor: 'grab' })
      .set(images, {
        rotateY: (i) => i * (-360 / projects.length),
        transformOrigin: '50% 50% 500px',
        z: -500,
        backgroundImage: (i) => `url(${projects[i].image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backfaceVisibility: 'hidden'
      })
      .from(images, {
        duration: 1.5,
        y: 200,
        opacity: 0,
        stagger: 0.1,
        ease: 'expo'
      });

    // Event Handlers
    const handleMouseEnter = (e: MouseEvent) => {
      const currentTarget = e.currentTarget as HTMLElement;
      gsap.to(images, { 
        opacity: (i, t) => (t === currentTarget) ? 1 : 0.3, 
        ease: 'power3' 
      });
    };

    const handleMouseLeave = () => {
      gsap.to(images, { opacity: 1, ease: 'power2.inOut' });
    };

    images.forEach(img => {
      img.addEventListener('mouseenter', handleMouseEnter);
      img.addEventListener('mouseleave', handleMouseLeave);
      
      // Add click handler to navigate to project
      img.addEventListener('click', () => {
        const index = imgRefs.current.indexOf(img);
        if (index !== -1) {
          const link = projects[index].liveLink || projects[index].link;
          if (link) {
            window.open(link, '_blank');
          }
        }
      });
    });

    // Drag Logic
    const dragStart = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      xPos.current = Math.round(clientX);
      gsap.set(ring, { cursor: 'grabbing' });
      window.addEventListener('mousemove', drag as EventListener);
      window.addEventListener('touchmove', drag as EventListener, { passive: false });
    };

    const drag = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const newX = Math.round(clientX);
      const deltaX = newX - xPos.current;
      
      gsap.to(ring, {
        rotationY: `-=${deltaX}`,
        onUpdate: () => {
          gsap.set(images, { backgroundPosition: (i) => getBgPos(i) });
        }
      });
      xPos.current = newX;
    };

    const dragEnd = () => {
      window.removeEventListener('mousemove', drag as EventListener);
      window.removeEventListener('touchmove', drag as EventListener);
      gsap.set(ring, { cursor: 'grab' });
    };

    window.addEventListener('mousedown', dragStart);
    window.addEventListener('touchstart', dragStart, { passive: false });
    window.addEventListener('mouseup', dragEnd);
    window.addEventListener('touchend', dragEnd);

    // Cleanup
    return () => {
      images.forEach(img => {
        if (img) {
          img.removeEventListener('mouseenter', handleMouseEnter);
          img.removeEventListener('mouseleave', handleMouseLeave);
        }
      });
      window.removeEventListener('mousedown', dragStart);
      window.removeEventListener('touchstart', dragStart);
      window.removeEventListener('mouseup', dragEnd);
      window.removeEventListener('touchend', dragEnd);
      window.removeEventListener('mousemove', drag as EventListener);
      window.removeEventListener('touchmove', drag as EventListener);
    };
  }, [projects]);

  return (
    <div className={`w-full h-screen relative overflow-hidden bg-black ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="relative w-[300px] h-[400px] perspective-3d">
          <div ref={ringRef} className="w-full h-full relative">
            {projects.map((project, i) => (
              <div
                key={project.id}
                ref={(el) => setImgRef(el, i)}
                className="absolute w-full h-full bg-gray-800 rounded-xl overflow-hidden cursor-pointer"
                style={{
                  transformStyle: 'preserve-3d',
                  backfaceVisibility: 'hidden',
                  backgroundImage: `url(${project.image})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                <div className="absolute inset-0 bg-black/60 p-4 flex flex-col justify-end">
                  <h3 className="text-white text-xl font-bold">{project.title}</h3>
                  <p className="text-gray-300 text-sm line-clamp-2">{project.description}</p>
                  <div className="flex gap-2 mt-2 flex-wrap">
                    {project.technologies.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="text-xs bg-blue-600/50 text-white px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GSAPCarousel;
