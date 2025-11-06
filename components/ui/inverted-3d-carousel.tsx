'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: string[];
  category: string;
  githubLink?: string;
  liveLink?: string;
}

interface Inverted3DCarouselProps {
  items: Project[];
}

export function Inverted3DCarousel({ items }: Inverted3DCarouselProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const xPos = useRef(0);
  
  // Initialize the carousel
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Set initial styles
    gsap.set(ringRef.current, { 
      rotationY: 180,
      cursor: 'grab'
    });
    
    // Set up each image
    const images = gsap.utils.toArray<HTMLDivElement>('.carousel-img');
    images.forEach((img, i) => {
      gsap.set(img, {
        rotateY: i * -36,
        transformOrigin: '50% 50% 500px',
        z: -500,
        backgroundImage: `url(${items[i]?.image})`,
        backgroundPosition: getBgPos(i),
        backfaceVisibility: 'hidden',
        backgroundSize: 'cover',
        opacity: 0,
        y: 200
      });
    });
    
    // Animate in
    gsap.to('.carousel-img', {
      duration: 1.5,
      y: 0,
      opacity: 1,
      stagger: 0.1,
      ease: 'expo.out'
    });
    
    // Hover effects
    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        gsap.to(images, { 
          opacity: (i, target) => (target === img ? 1 : 0.3),
          duration: 0.3
        });
      });
      
      img.addEventListener('mouseleave', () => {
        gsap.to(images, { 
          opacity: 1,
          duration: 0.3
        });
      });
    });
    
    // Drag functionality
    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      e.preventDefault();
      isDragging.current = true;
      xPos.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      gsap.set(ringRef.current, { cursor: 'grabbing' });
    };
    
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current || !ringRef.current) return;
      e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const delta = clientX - xPos.current;
      
      gsap.to(ringRef.current, {
        rotationY: `-=${delta % 360}`,
        onUpdate: () => {
          images.forEach((img, i) => {
            gsap.set(img, { backgroundPosition: getBgPos(i) });
          });
        }
      });
      
      xPos.current = clientX;
    };
    
    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      gsap.set(ringRef.current, { cursor: 'grab' });
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousedown', handleMouseDown);
      container.addEventListener('touchstart', handleMouseDown, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
    }
    
    // Cleanup
    return () => {
      if (container) {
        container.removeEventListener('mousedown', handleMouseDown);
        container.removeEventListener('touchstart', handleMouseDown as EventListener);
      }
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
    };
  }, [items]);
  
  const getBgPos = (i: number): string => {
    if (!ringRef.current) return '50% 50%';
    const rotationY = gsap.getProperty(ringRef.current, 'rotationY');
    if (typeof rotationY !== 'number') return '50% 50%';
    return `${100 - ((rotationY - 180 - i * 36) % 360) / 360 * 500}px 0px`;
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black overflow-hidden">
      <div 
        ref={containerRef}
        className="relative w-full h-full"
      >
        <div 
          ref={ringRef}
          className="absolute top-1/2 left-1/2 w-[300px] h-[400px]"
          style={{
            transform: 'translate(-50%, -50%)',
            transformStyle: 'preserve-3d',
            perspective: '2000px'
          }}
        >
          {items.map((item) => (
            <div 
              key={item.id}
              className="carousel-img absolute w-full h-full rounded-xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
                <div className="flex flex-wrap gap-2">
                  {item.technologies.slice(0, 3).map(tech => (
                    <span key={tech} className="bg-blue-600/80 text-white px-2 py-1 rounded-full text-xs">
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
  );
}
