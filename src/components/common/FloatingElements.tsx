import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';

const FloatingElements: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const ctx = gsap.context(() => {
        // Professional floating animation for background elements
        const elements = containerRef.current?.children;
        
        Array.from(elements || []).forEach((element, index) => {
          gsap.to(element, {
            y: Math.sin(index) * 20,
            x: Math.cos(index) * 15,
            rotation: Math.sin(index * 2) * 10,
            duration: 3 + index * 0.5,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.2
          });

          // Subtle scale animation
          gsap.to(element, {
            scale: 1 + Math.sin(index) * 0.1,
            duration: 2 + index * 0.3,
            ease: "power2.inOut",
            repeat: -1,
            yoyo: true,
            delay: index * 0.1
          });
        });
      }, containerRef);

      return () => ctx.revert();
    }
  }, []);

  const floatingVariants = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none z-10 opacity-20">
      {/* Coffee Bean Shapes */}
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/4 left-1/4 w-8 h-12 bg-gradient-to-br from-amber-400 to-orange-600 rounded-full transform rotate-45 blur-sm"
        style={{ animationDelay: '0s' }}
      />
      
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-1/2 right-1/3 w-6 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-full transform -rotate-30 blur-sm"
        style={{ animationDelay: '1s' }}
      />
      
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute bottom-1/3 left-1/2 w-10 h-14 bg-gradient-to-br from-yellow-400 to-amber-600 rounded-full transform rotate-60 blur-sm"
        style={{ animationDelay: '2s' }}
      />
      
      <motion.div
        variants={floatingVariants}
        animate="animate"
        className="absolute top-2/3 right-1/4 w-7 h-11 bg-gradient-to-br from-amber-500 to-orange-700 rounded-full transform -rotate-15 blur-sm"
        style={{ animationDelay: '1.5s' }}
      />

      {/* Steam Lines */}
      <motion.div
        animate={{
          opacity: [0.3, 0.8, 0.3],
          y: [0, -30, -60]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeOut"
        }}
        className="absolute top-1/3 left-2/3 w-px h-20 bg-gradient-to-t from-amber-300 to-transparent"
      />
      
      <motion.div
        animate={{
          opacity: [0.2, 0.6, 0.2],
          y: [0, -25, -50]
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: "easeOut",
          delay: 0.5
        }}
        className="absolute bottom-1/2 right-1/2 w-px h-16 bg-gradient-to-t from-orange-300 to-transparent"
      />

      {/* Decorative Circles */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.3, 0.1]
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-1/6 right-1/6 w-32 h-32 bg-gradient-to-br from-amber-200/20 to-orange-300/20 rounded-full blur-xl"
      />
      
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.05, 0.2, 0.05]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute bottom-1/4 left-1/6 w-40 h-40 bg-gradient-to-tl from-orange-200/15 to-red-300/15 rounded-full blur-2xl"
      />
    </div>
  );
};

export default FloatingElements;
