'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

interface InvertedRingCarouselProps {
  items: Project[];
}

export function InvertedRingCarousel({ items }: InvertedRingCarouselProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLDivElement[]>([]);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const rotation = useRef(0);
  const radius = 350; // Optimized radius for better visibility and spacing
  const itemCount = items.length;
  const angleStep = (Math.PI * 2) / itemCount;

  // Initialize the carousel
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Position items in a circle
    const positionItems = () => {
      itemRefs.current.forEach((item, index) => {
        if (!item) return;
        
        // Calculate position in a circle
        const angle = index * angleStep + rotation.current;
        const x = Math.sin(angle) * radius;
        const z = Math.cos(angle) * radius;
        
        // Calculate scale based on z-position (items further away are smaller)
        const scale = 0.5 + (z + radius) / (radius * 2) * 0.5;
        const opacity = 0.3 + (z + radius) / (radius * 2) * 0.7;
        
        gsap.to(item, {
          x: x,
          z: z,
          scale: scale,
          opacity: opacity,
          rotateY: -angle * (180 / Math.PI) + 90, // Make items face the center
          duration: 1,
          ease: 'power2.out',
        });
      });
    };

    // Initial positioning
    positionItems();

    // Animate items in
    gsap.from(itemRefs.current, {
      y: 100,
      opacity: 0,
      duration: 1,
      stagger: 0.1,
      ease: 'back.out(1.7)',
      delay: 0.5
    });

    // Handle mouse/touch events
    const container = containerRef.current;
    if (!container) return;

    const handleMouseDown = (e: MouseEvent | TouchEvent) => {
      isDragging.current = true;
      startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('touchmove', handleMouseMove, { passive: false });
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('touchend', handleMouseUp);
      
      if (ringRef.current) {
        gsap.to(ringRef.current, { cursor: 'grabbing' });
      }
    };

    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const deltaX = clientX - startX.current;
      startX.current = clientX;
      
      // Update rotation based on mouse movement
      rotation.current += deltaX * 0.01;
      positionItems();
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      
      if (ringRef.current) {
        gsap.to(ringRef.current, { cursor: 'grab' });
      }
    };

    // Add event listeners
    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('touchstart', handleMouseDown, { passive: false });

    // Auto-rotate when not interacting
    const autoRotate = () => {
      if (!isDragging.current) {
        rotation.current += 0.001; // Slower rotation
        positionItems();
      }
      requestAnimationFrame(autoRotate);
    };
    
    const rotateId = requestAnimationFrame(autoRotate);

    // Cleanup
    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('touchstart', handleMouseDown as EventListener);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('touchmove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchend', handleMouseUp);
      cancelAnimationFrame(rotateId);
    };
  }, [itemCount, angleStep]);

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full overflow-hidden bg-gray-100 dark:bg-gray-900 transition-colors duration-300 flex items-center justify-center py-12"
    >
      <div 
        ref={ringRef}
        className="absolute top-1/2 left-1/2 w-0 h-0 cursor-grab"
        style={{
          transformStyle: 'preserve-3d',
          perspective: '1100px',
          transform: 'translate(-50%, -50%)',
        }}
      >
        {items.map((item, index) => (
          <div
            key={item.id}
            ref={el => {
              if (el) itemRefs.current[index] = el;
            }}
            className="absolute w-[22rem] h-[30rem] rounded-xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105"
            style={{
              marginLeft: '-11rem', // Half of width
              marginTop: '-15rem', // Half of height
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              backgroundImage: `url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold mb-2">{item.title}</h3>
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{item.description}</p>
              <div className="flex flex-wrap gap-2">
                {item.technologies.slice(0, 3).map((tech) => (
                  <span 
                    key={tech} 
                    className="text-xs bg-blue-600/80 text-white px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
