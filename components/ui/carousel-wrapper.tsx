'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

// Define the Carousel props type
interface CarouselProps {
  slides: Array<{
    key: string;
    content: React.ReactNode;
    onClick?: () => void;
  }>;
  goToSlide: number;
  offsetRadius: number;
  showNavigation: boolean;
  animationConfig: {
    tension: number;
    friction: number;
  };
}

// Dynamically import the carousel with no SSR
const Carousel = dynamic(
  () => import('react-spring-3d-carousel').then((mod) => mod.default) as Promise<ComponentType<CarouselProps>>,
  { 
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center">Loading...</div>
  }
);

export default function CarouselWrapper(props: CarouselProps) {
  return <Carousel {...props} />;
}
