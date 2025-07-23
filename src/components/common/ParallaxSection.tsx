import React, { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ParallaxSectionProps {
  children: React.ReactNode;
  className?: string;
  speed?: number;
  direction?: 'vertical' | 'horizontal';
  offset?: number;
}

const ParallaxSection: React.FC<ParallaxSectionProps> = ({
  children,
  className = '',
  speed = 0.5,
  direction = 'vertical',
  offset = 0
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], [offset, offset + (speed * 100)]);
  const x = useTransform(scrollYProgress, [0, 1], [offset, offset + (speed * 100)]);

  useEffect(() => {
    if (ref.current) {
      const ctx = gsap.context(() => {
        // Professional parallax effect with GSAP
        gsap.to(ref.current, {
          yPercent: direction === 'vertical' ? -50 * speed : 0,
          xPercent: direction === 'horizontal' ? -50 * speed : 0,
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
            invalidateOnRefresh: true
          }
        });

        // Add subtle rotation and scale effects
        gsap.to(ref.current?.children || [], {
          rotationX: speed * 2,
          rotationY: speed * 1,
          scale: 1 + (speed * 0.02),
          ease: "none",
          scrollTrigger: {
            trigger: ref.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1,
            invalidateOnRefresh: true
          }
        });
      }, ref);

      return () => ctx.revert();
    }
  }, [speed, direction]);

  return (
    <motion.div
      ref={ref}
      className={`transform-gpu ${className}`}
      style={{
        y: direction === 'vertical' ? y : 0,
        x: direction === 'horizontal' ? x : 0,
      }}
    >
      {children}
    </motion.div>
  );
};

export default ParallaxSection;
