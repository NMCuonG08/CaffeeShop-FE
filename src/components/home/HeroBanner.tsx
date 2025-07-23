import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight, Coffee, Star } from 'lucide-react';
import type { HasAnimatedState } from '@/types';
import { useNavigate } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface HeroBannerProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const HeroBanner: React.FC<HeroBannerProps> = ({ hasAnimated, setHasAnimated }) => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleOrderNow = () => {
    navigate('/products');
  };

  useEffect(() => {
    if (!hasAnimated.hero && heroRef.current) {
      const ctx = gsap.context(() => {
        // Initial states
        gsap.set([titleRef.current, subtitleRef.current, buttonRef.current], {
          opacity: 0,
          y: 50
        });
        gsap.set(imageRef.current, {
          opacity: 0,
          scale: 0.8,
          rotation: -10
        });

        // Animation timeline
        const tl = gsap.timeline({
          onComplete: () => setHasAnimated(prev => ({ ...prev, hero: true }))
        });

        tl.to(titleRef.current, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out"
        })
        .to(subtitleRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out"
        }, "-=0.5")
        .to(buttonRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power3.out"
        }, "-=0.3")
        .to(imageRef.current, {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.7)"
        }, "-=0.8");

        // Floating animation for coffee cup
        gsap.to(imageRef.current, {
          y: -10,
          duration: 2,
          ease: "power2.inOut",
          yoyo: true,
          repeat: -1
        });

        // Particles animation
        gsap.to(particlesRef.current?.children || [], {
          y: -20,
          duration: 3,
          ease: "power2.inOut",
          stagger: 0.5,
          yoyo: true,
          repeat: -1
        });

      }, heroRef);

      return () => ctx.revert();
    }
  }, [hasAnimated.hero, setHasAnimated]);

  return (
    <div ref={heroRef} className="relative min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-32 h-32 bg-orange-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-yellow-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-1/4 w-40 h-40 bg-orange-400 rounded-full blur-3xl"></div>
      </div>

      {/* Floating Particles */}
      <div ref={particlesRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-orange-300 rounded-full opacity-60"></div>
        <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-yellow-400 rounded-full opacity-50"></div>
        <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-amber-300 rounded-full opacity-70"></div>
        <div className="absolute top-2/3 right-1/4 w-4 h-4 bg-amber-300 rounded-full opacity-40"></div>
      </div>

      <div className="container mx-auto px-4 h-screen flex items-center">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
          {/* Left Content */}
          <div className="space-y-8">
            <div ref={titleRef} className="space-y-4">
              <div className="flex items-center gap-2 text-orange-600 font-semibold">
                <Coffee className="w-5 h-5" />
                <span>Khám Phá Hương Vị Tuyệt Vời</span>
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-amber-900 leading-tight">
                Cafe Aurora
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  {" "}Coffee
                </span>
              </h1>
              <div className="flex items-center gap-2 text-yellow-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-current" />
                ))}
                <span className="text-amber-700 ml-2">Được yêu thích nhất</span>
              </div>
            </div>

            <div ref={subtitleRef} className="space-y-4">
              <p className="text-xl text-amber-700 leading-relaxed">
                Thưởng thức những tách cà phê đậm đà, bánh ngọt thơm ngon cùng không gian 
                ấm cúng tại Café Aurora - nơi kết nối mọi người qua tình yêu cà phê.
              </p>
              <div className="flex flex-wrap gap-4 text-sm text-amber-600">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>100% Cà phê Arabica</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span>Giao hàng tận nơi</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>Tích điểm ưu đãi</span>
                </div>
              </div>
            </div>

            <div ref={buttonRef} className="flex flex-col sm:flex-row gap-4">
              <button onClick={handleOrderNow} className="group bg-gradient-to-r from-orange-500 to-amber-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <span className="flex items-center gap-2">
                  Đặt Hàng Ngay
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>
              <button onClick={handleOrderNow} className="group border-2 border-orange-500 text-orange-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-orange-500 hover:text-white transition-all duration-300">
                <span className="flex items-center gap-2">
                  <Coffee className="w-5 h-5" />
                  Xem Menu
                </span>
              </button>
            </div>
          </div>

          {/* Right Content - Coffee Image */}
          <div className="relative flex justify-center items-center">
            <div ref={imageRef} className="relative">
              {/* Main Coffee Cup */}
              <div className="relative w-80 h-80 lg:w-96 lg:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full blur-2xl opacity-30"></div>
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='cup' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23D97706'/%3E%3Cstop offset='100%25' style='stop-color:%23F59E0B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M50 60 L50 160 Q50 180 70 180 L130 180 Q150 180 150 160 L150 60 Z' fill='url(%23cup)'/%3E%3Cpath d='M40 60 L160 60 Q170 60 170 70 L170 80 Q170 90 160 90 L40 90 Q30 90 30 80 L30 70 Q30 60 40 60 Z' fill='%23FCD34D'/%3E%3Cpath d='M150 80 Q180 80 180 100 Q180 120 150 120' stroke='%23D97706' stroke-width='8' fill='none'/%3E%3Cpath d='M70 40 Q100 20 130 40' stroke='%23FCD34D' stroke-width='3' fill='none' opacity='0.7'/%3E%3Cpath d='M80 35 Q100 25 120 35' stroke='%23FCD34D' stroke-width='2' fill='none' opacity='0.5'/%3E%3C/svg%3E"
                  alt="Coffee Cup"
                  className="w-full h-full object-contain relative z-10"
                />
              </div>

              {/* Steam Effect */}
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
                <div className="flex space-x-2">
                  <div className="w-1 h-8 bg-amber-300 rounded-full opacity-60 animate-pulse"></div>
                  <div className="w-1 h-10 bg-amber-300 rounded-full opacity-40 animate-pulse delay-100"></div>
                  <div className="w-1 h-6 bg-amber-300 rounded-full opacity-70 animate-pulse delay-200"></div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-yellow-400 rounded-full opacity-20 animate-bounce"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-orange-400 rounded-full opacity-30 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-1 h-16 bg-gradient-to-t from-orange-500 to-transparent rounded-full"></div>
      </div>
    </div>
  );
};

export default HeroBanner;
