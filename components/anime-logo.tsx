"use client"

import React, { useEffect, useRef } from 'react'
import './anime-logo.css'

export function AnimeLogo() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    const initAnimation = async () => {
      const animeModule = await import('animejs');
      const anime = animeModule.default || animeModule;

      if (!anime || !containerRef.current) return;

      const logoAnimationEl = containerRef.current.querySelector('.logo-animation') as HTMLElement
      if (!logoAnimationEl) return

      // Initial Setup
      anime.set(containerRef.current.querySelectorAll('.logo-letter'), { translateX: 0 })

      const timeline = anime.timeline({
        autoplay: true,
        easing: 'easeOutSine',
        loop: false
      })

      timeline
      .add({
        targets: containerRef.current.querySelector('.letter-i .line'),
        duration: 0,
        begin: function(a: any) { 
            const target = a.animatables[0].target as HTMLElement;
            target.removeAttribute('stroke-dasharray'); 
        }
      }, 0)
      .add({
        targets: containerRef.current.querySelectorAll('.bounced'),
        transformOrigin: ['50% 100% 0px', '50% 100% 0px'],
        translateY: [
          {value: [150, -160], duration: 190, endDelay: 20, easing: 'cubicBezier(0.225, 1, 0.915, 0.980)'},
          {value: 4, duration: 120, easing: 'easeInQuad'},
          {value: 0, duration: 120, easing: 'easeOutQuad'}
        ],
        scaleX: [
          {value: [.25, .85], duration: 190, easing: 'easeOutQuad'},
          {value: 1.08, duration: 120, delay: 85, easing: 'easeInOutSine'},
          {value: 1, duration: 260, delay: 25, easing: 'easeOutQuad'}
        ],
        scaleY: [
          {value: [.3, .8], duration: 120, easing: 'easeOutSine'},
          {value: .35, duration: 120, delay: 180, easing: 'easeInOutSine'},
          {value: .57, duration: 180, delay: 25, easing: 'easeOutQuad'},
          {value: .5, duration: 190, delay: 15, easing: 'easeOutQuad'}
        ],
        delay: anime.stagger(80)
      }, 1000)
      .add({
        targets: containerRef.current.querySelectorAll('.letter-m .line, .letter-k .line'),
        easing: 'easeOutElastic(1, .8)',
        duration: 600,
        d: function(el: any) { return el.dataset.d2 },
        begin: function(a: any) { 
             const target = a.animatables[0].target as HTMLElement;
             target.removeAttribute('stroke-dasharray'); 
        }
      }, '-=140')
      .add({
        targets: containerRef.current.querySelectorAll('.logo-letter'),
        translateX: 0,
        easing: 'easeOutElastic(1, .6)',
        duration: 800,
        delay: anime.stagger(40, {from: 2.5}),
        change: function(a: any) { 
            try {
                const target = a.animatables[2].target as HTMLElement;
                target.removeAttribute('stroke-dasharray'); 
            } catch (e) {}
        }
      }, '-=600')
      .add({
        targets: containerRef.current.querySelectorAll('.letter-m .line, .letter-k .line'),
        d: function(el: any) { return el.dataset.d3 },
        easing: 'spring(.2, 200, 3, 60)',
      }, '-=680')


      .add({
        targets: containerRef.current.querySelector('.letter-i .line'),
        transformOrigin: ['50% 100% 0', '50% 100% 0'],
        d: function(el: any) { return el.dataset.d2 },
        easing: 'cubicBezier(0.400, 0.530, 0.070, 1)',
        duration: 80
      }, '-=670')
      .add({
        targets: containerRef.current.querySelectorAll('.logo-letter'),
        translateY: [
          {value: 40, duration: 150, easing: 'easeOutQuart'},
          {value: 0, duration: 800, easing: 'easeOutElastic(1, .5)'}
        ],
        strokeDashoffset: [anime.setDashoffset, 0],
        delay: anime.stagger(60, {from: 'center'})
      }, '-=670')
      .add({
        targets: containerRef.current.querySelectorAll('.bounced'),
        scaleY: [
          {value: .4, duration: 150, easing: 'easeOutQuart'},
          {value: .5, duration: 800, easing: 'easeOutElastic(1, .5)'}
        ],
        delay: anime.stagger(60, {from: 'center'})
      }, '-=1090')
    }

    setTimeout(initAnimation, 100)
  }, [])

  return (
    <div className="main-logo" ref={containerRef}>
      <div className="logo-animation-wrapper">
        <div className="logo-animation">
          <div className="anime-logo">
            <div className="anime-logo-signs">
              <div className="logo-letter letter-a text-blue-600">
                <svg className="bounced" viewBox="0 0 200 240" width="200" height="240" fill="none" fillRule="evenodd">
                  <path className="line" 
                    d="M30,220 L100,20 L170,220" 
                    data-d2="M30,220 L100,20 L170,220" 
                    data-d3="M30,220 L100,20 L170,220"
                  />
                  <path className="line" 
                     d="M55,150 L145,150"
                     data-d2="M55,150 L145,150"
                     data-d3="M55,150 L145,150" 
                   />
                </svg>
              </div>
              
              <div className="logo-letter letter-m">
                <svg className="bounced" viewBox="0 0 340 240" width="340" height="240" fill="none" fillRule="evenodd">
                  <path className="line" 
                    d="M30,220 L30,30 L170,130 L310,30 L310,220" 
                    data-d2="M30,220 L30,30 L170,130 L310,30 L310,220" 
                    data-d3="M30,220 L30,30 L170,130 L310,30 L310,220" 
                  />
                </svg>
              </div>

              <div className="logo-letter letter-i">
                <svg className="bounced" viewBox="0 0 100 240" width="100" height="240" fill="none" fillRule="evenodd">
                  <path className="line" 
                    d="M50,220 L50,20" 
                    data-d2="M50,220 L50,20" 
                    data-d3="M50,220 L50,20" 
                  />
                </svg>
                <div style={{
                  position: 'absolute',
                  top: '-5px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  backgroundColor: 'currentColor',
                  zIndex: 10
                }}></div>
              </div>

              <div className="logo-letter letter-k" style={{ marginLeft: '-15px' }}>
                <svg className="bounced" viewBox="0 0 200 240" width="200" height="240" fill="none" fillRule="evenodd">
                   <path className="line" 
                    d="M60,20 L60,220"
                    data-d2="M60,20 L60,220"
                    data-d3="M60,20 L60,220"
                   />
                   <path className="line" 
                    d="M60,120 L160,20"
                    data-d2="M60,120 L160,20"
                    data-d3="M60,120 L160,20"
                   />
                   <path className="line" 
                    d="M60,120 L160,220"
                    data-d2="M60,120 L160,220"
                    data-d3="M60,120 L160,220"
                   />
                </svg>
              </div>

              <div className="logo-letter letter-a-2">
                <svg className="bounced" viewBox="0 0 200 240" width="200" height="240" fill="none" fillRule="evenodd">
                  <path className="line" 
                    d="M30,220 L100,20 L170,220" 
                    data-d2="M30,220 L100,20 L170,220" 
                    data-d3="M30,220 L100,20 L170,220"
                  />
                  <path className="line" 
                     d="M55,150 L145,150"
                     data-d2="M55,150 L145,150"
                     data-d3="M55,150 L145,150" 
                   />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
