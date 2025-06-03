import React, { useRef, useEffect, useState, useCallback } from 'react';
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

interface HeroProps {
  hasAnimated: { hero: boolean };
  setHasAnimated: React.Dispatch<React.SetStateAction<any>>;
}

const Hero: React.FC<HeroProps> = ({ hasAnimated, setHasAnimated }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleButtonHover = useCallback((element: HTMLElement, isEnter: boolean) => {
    gsap.killTweensOf(element);
    
    if (isEnter) {
      gsap.to(element, {
        scale: 1.05,
        y: -3,
        duration: 0.3,
        ease: "power2.out"
      });
    } else {
      gsap.to(element, {
        scale: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    }
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Typewriter effect
      if (!hasAnimated.hero) {
        const phrases = [
          "Nơi hương vị cà phê thượng hạng...",
          "Không gian ấm cúng và hiện đại...",
          "Trải nghiệm độc đáo chờ đón bạn...",
          "Hành trình khám phá cà phê..."
        ];

        let currentPhrase = 0;
        let typewriterCount = 0;
        const maxCycles = 2;

        const typewriterLoop = () => {
          if (typewriterCount >= maxCycles) return;
          
          gsap.to(typewriterRef.current, {
            text: phrases[currentPhrase],
            duration: 1.5,
            ease: "none",
            onComplete: () => {
              setTimeout(() => {
                currentPhrase = (currentPhrase + 1) % phrases.length;
                if (currentPhrase === 0) typewriterCount++;
                if (typewriterCount < maxCycles) {
                  typewriterLoop();
                }
              }, 1500);
            }
          });
        };
        typewriterLoop();
      }

      // Hero Section Animations
      if (!hasAnimated.hero) {
        const tl = gsap.timeline({
          onComplete: () => {
            setHasAnimated((prev: any) => ({ ...prev, hero: true }));
          }
        });
        
        tl.from(titleRef.current, {
          y: 100,
          opacity: 0,
          scale: 0.8,
          rotationX: -90,
          transformOrigin: "center bottom",
          duration: 1.5,
          ease: "back.out(1.7)",
          onComplete: () => {
            gsap.to(titleRef.current, {
              textShadow: "0 0 40px rgba(245, 158, 11, 0.9), 0 0 80px rgba(245, 158, 11, 0.5)",
              duration: 2,
              ease: "power2.out"
            });
          }
        })
        .from(subtitleRef.current, {
          y: 50,
          opacity: 0,
          scale: 0.9,
          duration: 1,
          ease: "power3.out"
        }, "-=0.8")
        .from(buttonsRef.current?.children || [], {
          y: 80,
          opacity: 0,
          scale: 0.5,
          rotation: -180,
          stagger: 0.2,
          duration: 1,
          ease: "elastic.out(1, 0.5)"
        }, "-=0.5");
      }

      // Floating Particles
      const particles = particlesRef.current?.children || [];
      gsap.set(particles, { opacity: 0 });
      
      Array.from(particles).slice(0, 20).forEach((particle, i) => {
        gsap.to(particle, {
          opacity: 0.6,
          y: -100,
          x: `+=${Math.random() * 100 - 50}`,
          rotation: 360,
          scale: Math.random() * 0.5 + 0.5,
          duration: 5 + Math.random() * 2,
          repeat: 3,
          delay: Math.random() * 2,
          ease: "power1.inOut",
          yoyo: true
        });
      });

      // Coffee Bean Animation
      gsap.to(coffeeRef.current, {
        y: -20,
        rotation: 360,
        scale: 1.1,
        duration: 4,
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut"
      });

      // Steam effect
      const steamElements = steamRef.current?.children || [];
      Array.from(steamElements).forEach((steam, i) => {
        gsap.fromTo(steam, 
          { 
            y: 0, 
            opacity: 0.8, 
            scale: 0.3
          },
          {
            y: -60,
            opacity: 0,
            scale: 1.5,
            duration: 2.5,
            repeat: 5,
            delay: i * 0.3,
            ease: "power1.out"
          }
        );
      });

      // Parallax effects
      gsap.to(".parallax-bg", {
        yPercent: -30,
        ease: "none",
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 2
        }
      });
    });

    return () => ctx.revert();
  }, [hasAnimated, setHasAnimated]);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background */}
      <div className="parallax-bg absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-3xl" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-full blur-2xl" />
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-red-300/35 to-pink-300/35 rounded-full blur-xl" />
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              background: `linear-gradient(45deg, rgba(245,158,11,${Math.random() * 0.3 + 0.2}), rgba(234,88,12,${Math.random() * 0.3 + 0.2}))`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(0.5px)'
            }}
          />
        ))}
      </div>

      {/* Floating Coffee Beans */}
      <div className="parallax-coffee absolute inset-0">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute text-xl opacity-15"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              fontSize: Math.random() * 15 + 10 + 'px'
            }}
          >
            ☕
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 
            ref={titleRef}
            className="text-7xl md:text-9xl font-bold bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent leading-tight mb-4"
          >
            Café Aurora
          </h1>
          
          <div className="w-40 h-2 bg-gradient-to-r from-amber-500 to-orange-500 mx-auto mt-6 relative overflow-hidden rounded-full">
            <div className="absolute inset-0 bg-white/60 rounded-full" />
          </div>

          <div className="mt-4 text-amber-600 font-semibold text-lg">
            {currentTime.toLocaleTimeString('vi-VN')} - Chào mừng bạn đến với Aurora
          </div>
        </div>

        <div 
          ref={subtitleRef}
          className="text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed"
        >
          <div ref={typewriterRef} className="text-amber-600 font-semibold min-h-[1.5em]">
            Nơi hương vị cà phê thượng hạng...
          </div>
          <div className="mt-2">
            hòa quyện cùng không gian hiện đại, tạo nên trải nghiệm độc đáo cho những tâm hồn yêu cà phê
          </div>
        </div>

        <div 
          ref={buttonsRef}
          className="flex flex-col sm:flex-row gap-8 justify-center items-center"
        >
          <button
            className="px-12 py-5 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-bold rounded-full shadow-2xl relative overflow-hidden group text-lg transition-all duration-300"
            onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>🎯</span> Khám Phá Menu
            </span>
          </button>
          
          <button
            className="px-12 py-5 border-3 border-amber-500 text-amber-600 font-bold rounded-full relative overflow-hidden group hover:bg-amber-500 hover:text-white transition-all duration-300 text-lg"
            onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
            onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
          >
            <span className="relative z-10 flex items-center gap-2">
              <span>📅</span> Đặt Bàn Ngay
            </span>
          </button>
        </div>
      </div>

      {/* Floating Coffee with Steam */}
      <div ref={coffeeRef} className="absolute bottom-16 right-16">
        <div className="relative">
          <div ref={steamRef} className="absolute -top-12 left-1/2 transform -translate-x-1/2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-6 bg-gray-300/60 rounded-full blur-sm"
                style={{ left: `${i * 3}px` }}
              />
            ))}
          </div>
          
          <div className="text-6xl filter drop-shadow-2xl cursor-pointer">
            ☕
          </div>
        </div>
      </div>

      {/* Wave SVG */}
      <svg className="absolute bottom-0 left-0 w-full h-32" viewBox="0 0 1200 120" preserveAspectRatio="none">
        <path
          d="M0,60 C300,120 900,0 1200,60 L1200,120 L0,120 Z"
          fill="url(#waveGradient)"
        />
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#ea580c" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.4" />
          </linearGradient>
        </defs>
      </svg>
    </section>
  );
};

export default Hero;