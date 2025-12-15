"use client"

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Dynamically import the DotLottieReact component with no SSR
const DotLottieReact = dynamic(
  () => import('@lottiefiles/dotlottie-react').then((mod) => mod.DotLottieReact),
  { ssr: false }
);

interface HologramEffectProps {
  rotationAngle?: number;
}

export function HologramEffect({ rotationAngle }: HologramEffectProps) {
  const hologramRef = useRef<HTMLDivElement>(null);

  // Remove the rotation effect since we're using CSS animation now

  return (
    <div className="absolute inset-0 flex items-start justify-center pt-40 pointer-events-none">
      <div className="w-full max-w-5xl h-[800px] opacity-30">
        <DotLottieReact
          src="https://lottie.host/b6ac38f9-7885-4157-9ea1-b0acfee5d367/P3V2Fqb48x.lottie"
          loop
          autoplay={true}
          style={{
            width: '100%',
            height: '100%',
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 0
          }}
        />
      </div>
    </div>
  );
}
