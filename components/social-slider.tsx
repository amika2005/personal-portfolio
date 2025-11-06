"use client"

import { Github, Linkedin, Twitter } from "lucide-react"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay } from "swiper/modules"
import "swiper/css"
import "swiper/css/autoplay"
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';

const socialLinks = [
  {
    name: "LinkedIn",
    href: "https://linkedin.com/in/omonigho-jimmy",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/amika2005",
    icon: Github,
  },
  {
    name: "Twitter",
    href: "https://twitter.com/omonigho_jimmy",
    icon: Twitter,
  },
]

export function SocialSlider() {
  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50">
      <div className="flex flex-col space-y-4">
        {socialLinks.map((link) => (
          <a 
            key={link.name} 
            href={link.href} 
            target="_blank" 
            rel="noopener noreferrer" 
            aria-label={link.name}
            className="group"
          >
            <div className="flex items-center justify-center p-3 bg-muted rounded-full hover:bg-sky-500 transition-all duration-300 group-hover:scale-110">
              <link.icon className="h-6 w-6 text-foreground dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 transition-all duration-200" />
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}

export function SocialSidebar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
      <div className="flex flex-col gap-4">
        {socialLinks.map((link) => (
          <Button
            key={link.name}
            variant="ghost"
            size="icon"
            asChild
            className="w-10 h-10 rounded-full hover:bg-muted hover:scale-110 transition-all duration-200"
          >
            <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
              <link.icon className="h-5 w-5 dark:filter dark:drop-shadow-[0_0_8px_rgba(255,255,0,1)] dark:brightness-200 transition-all duration-200" />
            </a>
          </Button>
        ))}
      </div>
    </div>
  )
}
