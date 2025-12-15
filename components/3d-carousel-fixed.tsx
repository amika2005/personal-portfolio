'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import styles from './3d-carousel.module.css';

interface CarouselItem {
  title: string;
  description: string;
  color: string;
  image: string;
}

export function Carousel3D() {
  const dragContainer = useRef<HTMLDivElement>(null);
  const spinContainer = useRef<HTMLDivElement>(null);
  const [radius, setRadius] = useState(300);
  const [isDragging, setIsDragging] = useState(false);
  const [isAutoRotating, setIsAutoRotating] = useState(true);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const animationRef = useRef<number>();
  const lastTime = useRef(0);
  
  // Store rotation state
  const rotation = useRef({
    tX: 0,
    tY: 10,
  });
  
  const config = {
    autoRotate: true,
    rotateSpeed: -0.05,
    itemWidth: 300,
    itemHeight: 400,
    minRadius: 300,
    maxRadius: 500,
    zoomSensitivity: 0.5,
    dragSensitivity: 0.5,
    perspective: 1500,
    tilt: 30,
  };

  const carouselItems: CarouselItem[] = [
    {
      title: 'Little Me',
      description: '',
      color: 'rgba(56, 189, 248, 0.1)',
      image: '/images/carousel/little-me.jpg',
    },
    {
      title: 'School',
      description: '',
      color: 'rgba(14, 165, 233, 0.1)',
      image: '/images/carousel/school.jpg',
    },
    {
      title: 'Sports',
      description: '',
      color: 'rgba(2, 132, 199, 0.1)',
      image: '/images/carousel/sports.jpg',
    },
    {
      title: 'University',
      description: '',
      color: 'rgba(3, 105, 161, 0.1)',
      image: '/images/carousel/friends.png',
    },
    {
      title: 'Family',
      description: '',
      color: 'rgba(7, 89, 133, 0.1)',
      image: '/images/carousel/fam.png',
    },
    {
      title: 'Adventures',
      description: '',
      color: 'rgba(12, 74, 110, 0.1)',
      image: '/images/carousel/adventure.jpg',
    },
  ];
  
  const applyTransform = useCallback((obj: HTMLElement) => {
    const { tX, tY } = rotation.current;
    const items = obj.getElementsByClassName(styles.carouselItem);
    
    Array.from(items).forEach((item, i) => {
      const angle = ((i * (360 / items.length)) + tX) * (Math.PI / 180);
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const rotationY = (i * (360 / items.length)) + tX;
      const rotationX = -tY;
      
      (item as HTMLElement).style.transform = `
        translateX(${x}px)
        translateZ(${z}px)
        rotateY(${rotationY}deg)
        rotateX(${rotationX}deg)
      `;
    });
  }, [radius]);
  
  const initItems = useCallback(() => {
    if (!spinContainer.current) return;
    
    const items = spinContainer.current.getElementsByClassName(styles.carouselItem);
    Array.from(items).forEach((item, i) => {
      const angle = (i * (360 / items.length)) * (Math.PI / 180);
      const x = Math.sin(angle) * radius;
      const z = Math.cos(angle) * radius;
      const rotationY = (i * (360 / items.length));
      
      (item as HTMLElement).style.transform = `
        translateX(${x}px)
        translateZ(${z}px)
        rotateY(${rotationY}deg)
      `;
      (item as HTMLElement).style.transition = 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
      (item as HTMLElement).style.opacity = '1';
      (item as HTMLElement).style.cursor = 'grab';
      (item as HTMLElement).style.position = 'absolute';
      (item as HTMLElement).style.transformOrigin = 'center center';
    });
  }, [radius]);
  
  const playSpin = useCallback((timestamp: number) => {
    if (!spinContainer.current) return;
    
    const deltaTime = timestamp - lastTime.current;
    lastTime.current = timestamp;
    
    if (isAutoRotating && !isDragging) {
      rotation.current.tX += config.rotateSpeed * (deltaTime / 16);
    }
    
    applyTransform(spinContainer.current);
    animationRef.current = requestAnimationFrame(playSpin);
  }, [isDragging, isAutoRotating, applyTransform]);
  
  // Handle mouse wheel for zooming
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.1 * config.zoomSensitivity;
    setRadius(prev => {
      const newRadius = Math.min(Math.max(prev + delta, config.minRadius), config.maxRadius);
      return newRadius;
    });
  }, []);
  
  // Handle mouse down for dragging
  const handleMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.clientX - currentX.current;
    startY.current = e.clientY - currentY.current;
    document.body.style.cursor = 'grabbing';
    setIsAutoRotating(false);
  }, []);
  
  // Handle mouse move for dragging
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    currentX.current = e.clientX - startX.current;
    currentY.current = e.clientY - startY.current;
    
    rotation.current = {
      tX: currentX.current * 0.2 * config.dragSensitivity,
      tY: currentY.current * 0.05 * config.dragSensitivity,
    };
    
    if (spinContainer.current) {
      applyTransform(spinContainer.current);
    }
  }, [isDragging, applyTransform]);
  
  // Handle mouse up/leave
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'grab';
    setTimeout(() => setIsAutoRotating(true), 1000);
  }, []);
  
  // Handle touch events
  const handleTouchStart = useCallback((e: TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    startX.current = e.touches[0].clientX - currentX.current;
    startY.current = e.touches[0].clientY - currentY.current;
    setIsAutoRotating(false);
  }, []);
  
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    currentX.current = e.touches[0].clientX - startX.current;
    currentY.current = e.touches[0].clientY - startY.current;
    
    rotation.current = {
      tX: currentX.current * 0.2 * config.dragSensitivity,
      tY: currentY.current * 0.05 * config.dragSensitivity,
    };
    
    if (spinContainer.current) {
      applyTransform(spinContainer.current);
    }
  }, [isDragging, applyTransform]);
  
  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setTimeout(() => setIsAutoRotating(true), 1000);
  }, []);
  
  // Initialize and set up event listeners
  useEffect(() => {
    initItems();
    
    const container = dragContainer.current;
    if (!container) return;
    
    // Set initial transform
    if (spinContainer.current) {
      applyTransform(spinContainer.current);
    }
    
    // Start animation loop
    lastTime.current = performance.now();
    animationRef.current = requestAnimationFrame(playSpin);
    
    // Add event listeners
    container.addEventListener('wheel', handleWheel as EventListener, { passive: false });
    container.addEventListener('mousedown', handleMouseDown as EventListener);
    document.addEventListener('mousemove', handleMouseMove as EventListener);
    document.addEventListener('mouseup', handleMouseUp as EventListener);
    container.addEventListener('touchstart', handleTouchStart as EventListener, { passive: false });
    container.addEventListener('touchmove', handleTouchMove as EventListener, { passive: false });
    container.addEventListener('touchend', handleTouchEnd as EventListener);
    
    return () => {
      // Clean up animation frame
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      // Remove event listeners
      container.removeEventListener('wheel', handleWheel as EventListener);
      container.removeEventListener('mousedown', handleMouseDown as EventListener);
      document.removeEventListener('mousemove', handleMouseMove as EventListener);
      document.removeEventListener('mouseup', handleMouseUp as EventListener);
      container.removeEventListener('touchstart', handleTouchStart as EventListener);
      container.removeEventListener('touchmove', handleTouchMove as EventListener);
      container.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [initItems, applyTransform, playSpin, handleWheel, handleMouseDown, handleMouseMove, handleMouseUp, handleTouchStart, handleTouchMove, handleTouchEnd]);
  
  // Update items when radius changes
  useEffect(() => {
    initItems();
  }, [radius, initItems]);
  
  return (
    <div className="w-full h-full relative flex items-center justify-center">
      <div 
        ref={dragContainer}
        className="w-full h-full flex items-center justify-center"
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
          perspective: `${config.perspective}px`,
          '--ambient-light': 'rgba(255, 255, 255, 0.1)',
          '--spot-light': 'rgba(255, 255, 255, 0.2)',
          transformStyle: 'preserve-3d',
        } as React.CSSProperties}
      >
        <div 
          ref={spinContainer}
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            position: 'relative',
            transform: 'translateZ(0)',
            left: 0,
            right: 0,
            margin: '0 auto',
          }}
        >
          {carouselItems.map((item, index) => (
            <div 
              key={index}
              className={`${styles.carouselItem} group`}
              style={{
                width: `${config.itemWidth}px`,
                height: `${config.itemHeight}px`,
                left: '50%',
                top: '50%',
                marginLeft: `-${config.itemWidth / 2}px`,
                marginTop: `-${config.itemHeight / 2}px`,
                backgroundImage: `url(${item.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0,
              }}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <h3 className="text-white text-xl font-bold mb-2 drop-shadow-lg">
                  {item.title}
                </h3>
                <p className="text-white/90 text-sm drop-shadow-lg">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .carouselItem {
          position: absolute;
          backface-visibility: hidden;
          transition: transform 0.3s ease-out, box-shadow 0.3s ease;
          transform-style: preserve-3d;
          will-change: transform;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.1);
        }
        
        .carouselItem:hover {
          box-shadow: 0 15px 40px -5px rgba(0, 0, 0, 0.2);
        }
        
        .carouselItem::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%);
          opacity: 1;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
}
