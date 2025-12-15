'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// Base project interface that defines the minimum required properties
interface BaseProject {
  id: number | string;
  image: string;
  title?: string;
  technologies?: string[];
}

interface ArcCarouselProps<T extends BaseProject> {
  items?: T[];
  className?: string;
  renderItem?: (item: T, isActive: boolean) => React.ReactNode;
}

export function ArcCarousel<T extends BaseProject>({ 
  items: originalItems = Array(10).fill(0).map((_, i) => ({
    id: i,
    title: `Project ${i + 1}`,
    image: `https://via.placeholder.com/400x600?text=Project+${i + 1}`,
    technologies: ['React', 'TypeScript', 'Tailwind CSS'].slice(0, Math.floor(Math.random() * 3) + 1)
  })) as unknown as T[],
  className = '',
  renderItem
}: ArcCarouselProps<T>) {
  // Clone items for infinite scroll effect
  const items = [...originalItems, ...originalItems, ...originalItems];
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const cardCount = originalItems.length;
  const totalCards = items.length;
  const angleStep = 180 / (Math.max(cardCount - 1, 1)); // 180 degree arc
  const isDragging = useRef(false);
  const startX = useRef(0);
  const rotation = useRef(0);
  const autoRotateRef = useRef<gsap.core.Tween | null>(null);
  const animationFrameId = useRef<number>();

  // Update card positions on each frame
  const updateCardPositions = () => {
    if (!containerRef.current) return;
    
    const cards = containerRef.current.querySelectorAll<HTMLDivElement>('.arc-card');
    const centerIndex = Math.floor(totalCards / 2);
    const visibleRange = cardCount * 0.5;
    
    cards.forEach((card, i) => {
      const distanceFromCenter = i - (centerIndex + (rotation.current / angleStep));
      const absDistance = Math.abs(distanceFromCenter);
      
      // Only show cards within the visible range
      if (absDistance > visibleRange) {
        gsap.set(card, { opacity: 0, pointerEvents: 'none' });
        return;
      }
      
      // Calculate angle and position
      const angle = -90 + (distanceFromCenter * angleStep);
      const radius = 500;
      const x = Math.sin(angle * (Math.PI / 180)) * radius;
      const z = (Math.cos(angle * (Math.PI / 180)) * radius) - radius;
      
      // Calculate scale and opacity based on position
      const scale = 1 - (absDistance / visibleRange) * 0.5;
      const opacity = 1 - (absDistance / visibleRange) * 0.8;
      
      // Update card position and style
      gsap.set(card, {
        x: x,
        z: z,
        rotationY: angle,
        scale: scale,
        opacity: opacity,
        pointerEvents: 'auto',
        zIndex: Math.round(100 - absDistance * 10),
        transformStyle: 'preserve-3d',
        transformOrigin: 'center center',
        transition: 'opacity 0.3s ease, transform 0.3s ease',
        willChange: 'transform, opacity'
      });
      
      // Update active index
      if (Math.abs(distanceFromCenter) < 0.5) {
        setActiveIndex(i % cardCount);
      }
    });
    
    // Handle infinite scroll
    if (rotation.current > (cardCount * angleStep)) {
      rotation.current -= cardCount * angleStep * 2;
    } else if (rotation.current < -(cardCount * angleStep)) {
      rotation.current += cardCount * angleStep * 2;
    }
    
    animationFrameId.current = requestAnimationFrame(updateCardPositions);
  };

  // Auto-rotation
  const startAutoRotate = () => {
    if (autoRotateRef.current) {
      autoRotateRef.current.kill();
    }
    
    autoRotateRef.current = gsap.to(rotation, {
      value: `+=${angleStep}`,
      duration: 3,
      ease: 'none',
      onUpdate: updateCardPositions,
      onComplete: startAutoRotate
    });
  };

  // Handle drag events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    
    if (autoRotateRef.current) {
      autoRotateRef.current.pause();
    }
    
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      
      const delta = (e.clientX - startX.current) * 0.5;
      rotation.current += delta;
      startX.current = e.clientX;
      updateCardPositions();
    };
    
    const onMouseUp = () => {
      isDragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      startAutoRotate();
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, { once: true });
  };

  // Initialize carousel
  useEffect(() => {
    // Start auto-rotation after a delay
    const timer = setTimeout(() => {
      startAutoRotate();
    }, 2000);
    
    // Initial position update
    updateCardPositions();
    
    // Handle window resize
    const handleResize = () => {
      updateCardPositions();
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (autoRotateRef.current) {
        autoRotateRef.current.kill();
      }
      window.removeEventListener('resize', handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={`relative w-full h-[600px] flex items-center justify-center overflow-hidden ${className}`}>
      <div 
        ref={containerRef}
        className="relative w-full h-full flex items-center justify-center"
        onMouseDown={handleMouseDown}
        style={{
          perspective: '1200px',
          transformStyle: 'preserve-3d',
          cursor: isDragging.current ? 'grabbing' : 'grab'
        }}
      >
        {items.map((item, index) => {
          const isActive = index % cardCount === activeIndex;
          return (
            <div 
              key={`${item.id}-${index}`}
              className={`arc-card absolute w-[280px] h-[380px] transition-all duration-300 ${
                isActive ? 'opacity-100' : 'opacity-40 hover:opacity-70'
              }`}
              onMouseEnter={() => !isDragging.current && setActiveIndex(index % cardCount)}
            >
              {renderItem ? (
                renderItem(item, isActive)
              ) : (
                <div className="w-full h-full bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title || `Project ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {(item.title || item.technologies) && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                      {item.title && <h3 className="font-medium text-white">{item.title}</h3>}
                      {item.technologies && item.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {item.technologies.map((tech, i) => (
                            <span key={i} className="text-xs px-2 py-0.5 bg-white/10 rounded-full text-white/70">
                              {tech}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Navigation dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
        {originalItems.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              // Calculate rotation needed to center this item
              const targetIndex = index + cardCount; // Use the middle set of items
              const centerIndex = Math.floor(totalCards / 2);
              const distance = centerIndex - targetIndex;
              rotation.current = -distance * angleStep;
              setActiveIndex(index);
              updateCardPositions();
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === activeIndex ? 'bg-white w-8' : 'bg-white/30 w-3'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
