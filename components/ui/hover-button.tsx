"use client"

import { useEffect } from "react"
import Link from "next/link"

interface HoverButtonProps {
  buttonText?: string;
}

export function HoverButton({ buttonText = "Let's Talk" }: HoverButtonProps) {
  useEffect(() => {
    // Add the CSS styles dynamically
    const style = document.createElement('style')
    style.textContent = `
      .hover-button {
        position: relative;
        padding: 12px 24px;
        border: none;
        background: none;
        cursor: pointer;
        font-family: "Source Code Pro", monospace;
        font-weight: 900;
        text-transform: uppercase;
        font-size: 1.25rem;
        color: hsla(210, 50%, 85%, 1);
        background-color: hsl(210, 80%, 42%);
        box-shadow: hsla(210, 40%, 52%, 0.4) 2px 2px 22px;
        border-radius: 4px;
        z-index: 0;
        overflow: hidden;
        transition: box-shadow 0.3s;
      }

      .hover-button:focus {
        outline: none;
        box-shadow: hsl(210, 80%, 42%) 2px 2px 22px;
      }

      .hover-button .right::after,
      .hover-button::after {
        content: '';
        display: block;
        position: absolute;
        white-space: nowrap;
        padding: 40px 40px;
        pointer-events: none;
      }

      .hover-button::after {
        font-weight: 200;
        top: -30px;
        left: -20px;
      }

      .hover-button .right,
      .hover-button .left {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
      }

      .hover-button .right {
        left: 66%;
      }

      .hover-button .left {
        right: 66%;
      }

      .hover-button .right::after {
        display: none; /* Remove the black box effect */
      }

      .hover-button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
      }

      /* Bubbles animation */
      .hover-button::before {
        content: '';
        pointer-events: none;
        opacity: 0.6;
        background:
          radial-gradient(circle at 20% 35%, transparent 0, transparent 2px, hsla(210, 50%, 85%, 1) 3px, hsla(210, 50%, 85%, 1) 4px, transparent 4px),
          radial-gradient(circle at 75% 44%, transparent 0, transparent 2px, hsla(210, 50%, 85%, 1) 3px, hsla(210, 50%, 85%, 1) 4px, transparent 4px),
          radial-gradient(circle at 46% 52%, transparent 0, transparent 4px, hsla(210, 50%, 85%, 1) 5px, hsla(210, 50%, 85%, 1) 6px, transparent 6px);
        width: 100%;
        height: 300%;
        top: 0;
        left: 0;
        position: absolute;
        animation: bubbles 5s linear infinite both;
      }

      @keyframes bubbles {
        from {
          transform: translateY(0);
        }
        to {
          transform: translateY(-66.666%);
        }
      }
    `
    document.head.appendChild(style)

    // Add the font
    const link = document.createElement('link')
    link.href = 'https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@200;900&display=swap'
    link.rel = 'stylesheet'
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(style)
      document.head.removeChild(link)
    }
  }, [])

  return (
    <Link 
      href="mailto:amikafernando123@gmail.com"
      className="hover-button"
    >
      <div className="left"></div>
      {buttonText}
      <div className="right"></div>
    </Link>
  )
}
