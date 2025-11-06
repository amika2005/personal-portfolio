"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SocialSlider } from "@/components/social-slider"
import { CustomCursor } from "@/components/custom-cursor"
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Carousel3D } from "@/components/3d-carousel-fixed"
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function StoriesPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Handle initial user interaction to enable audio
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleFirstInteraction = () => {
      // Set this flag to indicate user has interacted with the page
      document.body.dataset.userInteracted = 'true';
      
      // Try to start playback if we're in the carousel view
      if (carouselRef.current) {
        const carouselRect = carouselRef.current.getBoundingClientRect();
        const isInCarousel = carouselRect.top < window.innerHeight && carouselRect.bottom > 0;
        if (audioRef.current && isInCarousel && !isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
      
      // Remove the event listeners after first interaction
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    // Add event listeners for first interaction
    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, [isPlaying]);

  // Auto-play audio when carousel is in view
  useEffect(() => {
    if (!audioRef.current || typeof window === 'undefined') return;

    const handlePlay = async () => {
      if (!audioRef.current) return;
      
      try {
        // Mute the audio first to ensure autoplay works
        const wasMuted = audioRef.current.muted;
        audioRef.current.muted = true;
        
        // Try to play (this will work even without user interaction when muted)
        await audioRef.current.play();
        
        // If we got here, playback started successfully
        setIsPlaying(true);
        document.body.dataset.audioPlaying = 'true';
        
        // Unmute if it wasn't muted before
        if (!wasMuted) {
          audioRef.current.muted = false;
        }
        
      } catch (error) {
        console.log('Playback failed:', error);
        // If autoplay failed, show the play button
        const playButton = document.querySelector('.play-music-button');
        if (playButton) {
          playButton.classList.remove('hidden');
        }
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            if (audioRef.current && !isPlaying) {
              handlePlay();
            }
          } else {
            // Immediately pause when not intersecting
            if (audioRef.current) {
              audioRef.current.pause();
              setIsPlaying(false);
              document.body.dataset.audioPlaying = 'false';
            }
          }
        });
      },
      { 
        threshold: 0.1,
        root: null, // Use the viewport as root
        rootMargin: '0px 0px 0px 0px' // No margin for more precise detection
      }
    );

    const currentRef = carouselRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Header />
      <div className="hidden md:block">
        <SocialSlider />
      </div>
      
      <main className="flex-1 py-8 md:py-12 px-4 sm:px-6 lg:px-8 w-full">
        {/* About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-7xl mx-auto mb-24 px-4 sm:px-6 lg:px-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
            {/* Text Content - Now on the left */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="md:col-span-7 space-y-6"
            >
              <h2 className="text-8xl font-bold text-gray-900 dark:text-white">
                about.
              </h2>
              <div className="h-1 w-20 bg-sky-500 rounded-full my-4" />
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Hello! I'm Amika, a passionate developer and designer with a love for creating beautiful, functional digital experiences. With a background in both design and development, I bring a unique perspective to every project I work on.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                I see technology as a powerful lever for change, but its true potential is unlocked only with a worldly perspective. This belief shapes how I spend my time, both on and off the screen. Contributing to the global open-source community and embracing the challenges of outdoor adventures are integral to my growth. This blend of technical exploration and real-world experience fuels my commitment to not just write code, but to engineer solutions that transcend boundaries and address universal challenges.
              </p>
            </motion.div>

            {/* Image Section - Now on the right */}
            <motion.div 
              initial={{ opacity: 0, x: 20, rotate: 2 }}
              whileInView={{ opacity: 1, x: 0, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="md:col-span-5 -mt-24"
            >
              <img
                src="/About-me.png"
                alt="About Me"
                className="w-full h-auto "
              />
            </motion.div>
          </div>
        </motion.div>
        {/* Music Player */}
        <div className="fixed bottom-4 right-4 z-50">
          <div className="flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-full p-2 shadow-lg">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} />}
            </button>
            <button
              onClick={toggleMute}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
            {/* Hidden Audio Element */}
            <audio
              ref={audioRef}
              loop
              src="/Night-Changes.mp3"
              className="hidden"
              muted={isMuted}
              preload="auto"
            />
            {/* Visual indicator when user interaction is needed */}
            <div className="play-music-button hidden absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
              <Play size={12} fill="white" />
            </div>
          </div>
        </div>
        <style jsx global>{`
          @keyframes blob {
            0% { transform: translate(0px, 0px) scale(1); }
            33% { transform: translate(30px, -50px) scale(1.1); }
            66% { transform: translate(-20px, 20px) scale(0.9); }
            100% { transform: translate(0px, 0px) scale(1); }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .audio-player {
            -webkit-appearance: none;
            height: 2px !important;
            background: #e5e7eb;
            border-radius: 1px;
            outline: none;
          }
          .audio-player::-webkit-media-controls-panel {
            background: transparent;
            padding: 0;
          }
          .audio-player::-webkit-media-controls-play-button,
          .audio-player::-webkit-media-controls-mute-button {
            display: none;
          }
          .audio-player::-webkit-media-controls-timeline,
          .audio-player::-webkit-media-controls-current-time-display,
          .audio-player::-webkit-media-controls-time-remaining-display {
            color: #6b7280;
            font-size: 0.7rem;
          }
          .dark .audio-player::-webkit-media-controls-timeline,
          .dark .audio-player::-webkit-media-controls-current-time-display,
          .dark .audio-player::-webkit-media-controls-time-remaining-display {
            color: #9ca3af;
          }
          .audio-player::-webkit-media-controls-timeline {
            background: #e5e7eb;
            border-radius: 2px;
            margin: 0 8px;
          }
          .dark .audio-player::-webkit-media-controls-timeline {
            background: #4b5563;
          }
        `}</style>

        <div className="max-w-4xl mx-auto mb-12 text-center">
          <div className="mb-4 inline-block">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              <span className="text-sky-500">My</span> Stories
            </h1>
            <div className="h-1 w-full bg-sky-500 mt-2 rounded-full"></div>
          </div>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            A collection of my journey and experiences in 3D
          </p>
          <p className="mb-4">
            Scroll Mouse Wheel to Zoom In/Out("Apply Dark Mode")
          </p>
        </div>
        
        <div 
          ref={carouselRef}
          className="w-full h-[80vh] min-h-[600px] flex items-center justify-center mt-32"
        >
          <div className="w-full max-w-4xl h-full">
            <Carousel3D />
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto mt-12 text-center text-gray-600 dark:text-gray-300">
          <p className="mb-4">
            Hover and drag to rotate the carousel. The carousel will automatically rotate when idle.
          </p>
          
        </div>
      </main>
      
      <Footer />
      <CustomCursor />
    </div>
  )
}
