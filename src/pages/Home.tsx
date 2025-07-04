import React, { useEffect, useRef, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Import components
import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Features from '@/components/home/Features';
import Drinks from '@/components/home/Drinks';
import type { HasAnimatedState } from '@/types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [hasAnimated, setHasAnimated] = useState<HasAnimatedState>({
    hero: false,
    about: false,
    process: false,
    gallery: false,
    stats: false,
    features: false,
    drinks: false,
    testimonials: false,
    cta: false
  });

  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      let inThrottle = false;
      
      // Cursor animation with throttling
      const handleMouseMove = (e: MouseEvent) => {
        if (!inThrottle) {
          setMousePosition({ x: e.clientX, y: e.clientY });

          gsap.to(cursorRef.current, {
            x: e.clientX - 12,
            y: e.clientY - 12,
            duration: 0.3,
            ease: "power2.out"
          });

          inThrottle = true;
          setTimeout(() => (inThrottle = false), 16);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden relative">
      {/* Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full pointer-events-none z-50 shadow-lg opacity-80"
      />

      <div
        className="fixed pointer-events-none z-40"
        style={{
          left: mousePosition.x - 20,
          top: mousePosition.y - 20,
          width: 40,
          height: 40,
          background: `radial-gradient(circle, rgba(251, 191, 36, 0.3), transparent 70%)`,
          borderRadius: '50%',
          transition: 'all 0.1s ease-out'
        }}
      />

      {/* Sections */}
      <Hero hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />

      <About hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />
      <Features hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />
      <Drinks hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />

      {/* Add other sections here */}
    </div>
  );
};

export default Home;