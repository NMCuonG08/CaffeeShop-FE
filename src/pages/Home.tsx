import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, TextPlugin);

const Home: React.FC = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [hasAnimated, setHasAnimated] = useState({
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
  
  // Refs for sections
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const coffeeRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const steamRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const drinksRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  
  // New sections refs
  const aboutRef = useRef<HTMLDivElement>(null);
  const processRef = useRef<HTMLDivElement>(null);
  const galleryRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const menuHighlightRef = useRef<HTMLDivElement>(null);
  const baristaRef = useRef<HTMLDivElement>(null);
  const typewriterRef = useRef<HTMLDivElement>(null);

  // Throttle function for better performance
  const throttle = useCallback((func: Function, limit: number) => {
    let inThrottle: boolean;
    return function(this: any, ...args: any[]) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }, []);

  useEffect(() => {
    // Update time every second
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Throttled cursor animation - chỉ chạy khi cần thiết
      const handleMouseMove = throttle((e: MouseEvent) => {
        setMousePosition({ x: e.clientX, y: e.clientY });
        
        // Chỉ animate cursor, bỏ coffee bean trail để giảm lag
        gsap.to(cursorRef.current, {
          x: e.clientX - 12,
          y: e.clientY - 12,
          duration: 0.3,
          ease: "power2.out"
        });
      }, 16); // ~60fps

      window.addEventListener('mousemove', handleMouseMove);

      // Typewriter effect - chạy 1 lần duy nhất
      if (!hasAnimated.hero) {
        const phrases = [
          "Nơi hương vị cà phê thượng hạng...",
          "Không gian ấm cúng và hiện đại...",
          "Trải nghiệm độc đáo chờ đón bạn...",
          "Hành trình khám phá cà phê..."
        ];

        let currentPhrase = 0;
        let typewriterCount = 0;
        const maxCycles = 2; // Chỉ chạy 2 chu kỳ

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

      // Hero Section Animations - chỉ chạy 1 lần
      if (!hasAnimated.hero) {
        const tl = gsap.timeline({
          onComplete: () => {
            setHasAnimated(prev => ({ ...prev, hero: true }));
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
            // Text glow chỉ chạy 1 lần
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

      // Floating Particles - animation nhẹ hơn, ít particles hơn
      const particles = particlesRef.current?.children || [];
      gsap.set(particles, { opacity: 0 });
      
      // Giảm số lượng particles và bỏ magnetic effect
      Array.from(particles).slice(0, 20).forEach((particle, i) => {
        gsap.to(particle, {
          opacity: 0.6,
          y: -100,
          x: `+=${Math.random() * 100 - 50}`,
          rotation: 360,
          scale: Math.random() * 0.5 + 0.5,
          duration: 5 + Math.random() * 2,
          repeat: 3, // Giới hạn repeat
          delay: Math.random() * 2,
          ease: "power1.inOut",
          yoyo: true
        });
      });

      // Coffee Bean Animation - giảm intensity
      gsap.to(coffeeRef.current, {
        y: -20,
        rotation: 360,
        scale: 1.1,
        duration: 4,
        repeat: 2, // Giới hạn repeat
        yoyo: true,
        ease: "power2.inOut"
      });

      // Steam effect - đơn giản hóa
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
            repeat: 5, // Giới hạn repeat
            delay: i * 0.3,
            ease: "power1.out"
          }
        );
      });

      // Scroll Triggered Animations - chỉ chạy 1 lần với flag
      ScrollTrigger.create({
        trigger: aboutRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.about) {
            const cards = aboutRef.current?.querySelectorAll('.about-card') || [];
            gsap.fromTo(cards,
              {
                rotationY: -180,
                opacity: 0,
                scale: 0.5
              },
              {
                rotationY: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                onComplete: () => setHasAnimated(prev => ({ ...prev, about: true }))
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: processRef.current,
        start: "top 70%",
        onEnter: () => {
          if (!hasAnimated.process) {
            const steps = processRef.current?.querySelectorAll('.process-step') || [];
            gsap.fromTo(steps,
              {
                x: -100,
                opacity: 0,
                rotation: -45
              },
              {
                x: 0,
                opacity: 1,
                rotation: 0,
                duration: 1,
                stagger: 0.3,
                ease: "back.out(1.7)",
                onComplete: () => setHasAnimated(prev => ({ ...prev, process: true }))
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: galleryRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.gallery) {
            const images = galleryRef.current?.querySelectorAll('.gallery-item') || [];
            gsap.fromTo(images,
              {
                scale: 0,
                opacity: 0
              },
              {
                scale: 1,
                opacity: 1,
                duration: 0.8,
                stagger: 0.05,
                ease: "back.out(1.7)",
                onComplete: () => setHasAnimated(prev => ({ ...prev, gallery: true }))
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: statsRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.stats) {
            const counters = statsRef.current?.querySelectorAll('.counter') || [];
            counters.forEach(counter => {
              const target = parseInt(counter.getAttribute('data-target') || '0');
              gsap.fromTo(counter,
                { textContent: 0 },
                {
                  textContent: target,
                  duration: 2,
                  ease: "power2.out",
                  snap: { textContent: 1 },
                  onUpdate: function() {
                    counter.textContent = Math.ceil(this.targets()[0].textContent);
                  }
                }
              );
            });
            setHasAnimated(prev => ({ ...prev, stats: true }));
          }
        }
      });

      ScrollTrigger.create({
        trigger: featuresRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.features) {
            const cards = featuresRef.current?.querySelectorAll('.feature-card') || [];
            gsap.fromTo(cards, 
              {
                y: 100,
                opacity: 0,
                scale: 0.8
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1.2,
                stagger: 0.2,
                ease: "power3.out",
                onComplete: () => setHasAnimated(prev => ({ ...prev, features: true }))
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: drinksRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.drinks) {
            const drinks = drinksRef.current?.querySelectorAll('.drink-card') || [];
            gsap.fromTo(drinks,
              {
                y: 80,
                opacity: 0,
                scale: 0.5
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                duration: 1,
                stagger: 0.15,
                ease: "back.out(1.7)",
                onComplete: () => {
                  setHasAnimated(prev => ({ ...prev, drinks: true }));
                  // Liquid fill chỉ chạy 1 lần
                  setTimeout(() => {
                    drinks.forEach(drink => {
                      const liquid = drink.querySelector('.liquid-fill');
                      if (liquid) {
                        gsap.fromTo(liquid,
                          { height: '0%' },
                          { height: '60%', duration: 1.5, ease: "power2.out" }
                        );
                      }
                    });
                  }, 500);
                }
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: testimonialRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.testimonials) {
            const testimonials = testimonialRef.current?.querySelectorAll('.testimonial') || [];
            gsap.fromTo(testimonials,
              {
                x: 200,
                opacity: 0
              },
              {
                x: 0,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: "power3.out",
                onComplete: () => setHasAnimated(prev => ({ ...prev, testimonials: true }))
              }
            );
          }
        }
      });

      ScrollTrigger.create({
        trigger: ctaRef.current,
        start: "top 80%",
        onEnter: () => {
          if (!hasAnimated.cta) {
            gsap.fromTo(ctaRef.current,
              {
                scale: 0.8,
                opacity: 0,
                y: 50
              },
              {
                scale: 1,
                opacity: 1,
                y: 0,
                duration: 1.5,
                ease: "power3.out",
                onComplete: () => setHasAnimated(prev => ({ ...prev, cta: true }))
              }
            );
          }
        }
      });

      // Parallax effects - giảm intensity
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

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    });

    return () => ctx.revert();
  }, [hasAnimated, throttle]);

  // Simplified Button Hover Animations
  const handleButtonHover = useCallback((element: HTMLElement, isEnter: boolean) => {
    gsap.killTweensOf(element); // Kill existing animations
    
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

  const features = [
    {
      icon: "🌟",
      title: "Cà Phê Thượng Hạng",
      description: "Hạt cà phê được chọn lọc kỹ càng từ những vùng đất nổi tiếng",
      gradient: "from-yellow-400 to-orange-400"
    },
    {
      icon: "🎨",
      title: "Không Gian Hiện Đại",
      description: "Thiết kế tinh tế, ánh sáng ấm áp tạo nên không gian lý tưởng",
      gradient: "from-purple-400 to-pink-400"
    },
    {
      icon: "💝",
      title: "Dịch Vụ Tận Tâm",
      description: "Đội ngũ barista chuyên nghiệp mang đến trải nghiệm hoàn hảo",
      gradient: "from-blue-400 to-cyan-400"
    }
  ];

  const drinks = [
    { name: "Espresso", price: "45.000đ", emoji: "☕", gradient: "from-amber-400 to-orange-500", description: "Cà phê nguyên chất, đậm đà" },
    { name: "Cappuccino", price: "55.000đ", emoji: "🥛", gradient: "from-blue-400 to-blue-600", description: "Sự hòa quyện hoàn hảo" },
    { name: "Latte Art", price: "60.000đ", emoji: "🎨", gradient: "from-purple-400 to-pink-500", description: "Nghệ thuật trong từng ly" },
    { name: "Cold Brew", price: "50.000đ", emoji: "🧊", gradient: "from-cyan-400 to-blue-500", description: "Mát lạnh, thơm ngon" }
  ];

  const coffeeProcess = [
    { step: "01", title: "Chọn Hạt", icon: "🌱", description: "Tuyển chọn hạt cà phê chất lượng cao từ các vùng đất nổi tiếng" },
    { step: "02", title: "Rang Xay", icon: "🔥", description: "Quy trình rang xay hiện đại, giữ nguyên hương vị tự nhiên" },
    { step: "03", title: "Pha Chế", icon: "☕", description: "Barista chuyên nghiệp pha chế với kỹ thuật hoàn hảo" },
    { step: "04", title: "Thưởng Thức", icon: "😋", description: "Tận hưởng hương vị tuyệt vời trong không gian ấm cúng" }
  ];

  const testimonials = [
    {
      name: "Nguyễn Minh Anh",
      role: "Food Blogger",
      content: "Café Aurora mang đến trải nghiệm cà phê tuyệt vời nhất tôi từng có. Hương vị đậm đà, không gian ấm cúng.",
      avatar: "👩‍💼",
      rating: 5
    },
    {
      name: "Trần Văn Nam",
      role: "Doanh nhân",
      content: "Nơi lý tưởng để làm việc và gặp gỡ đối tác. Wi-Fi nhanh, cà phê ngon, dịch vụ chu đáo.",
      avatar: "👨‍💼",
      rating: 5
    },
    {
      name: "Lê Thị Hoa",
      role: "Sinh viên",
      content: "Không gian học tập tuyệt vời, cà phê thơm ngon với giá cả hợp lý. Tôi đến đây mỗi ngày!",
      avatar: "👩‍🎓",
      rating: 5
    }
  ];

  const galleryImages = [
    "🏪", "☕", "🥐", "📚", "🎵", "🌿", "💡", "🪑", "🖼️", "🌸", "📱", "🎨"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 overflow-hidden relative">
      {/* Simplified Custom Cursor */}
      <div
        ref={cursorRef}
        className="fixed w-6 h-6 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full pointer-events-none z-50 shadow-lg opacity-80"
      />

      {/* Reduced Floating Particles */}
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

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Simplified Parallax Background */}
        <div className="parallax-bg absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-amber-400/30 to-orange-400/30 rounded-full blur-3xl" />
          <div className="absolute top-40 right-20 w-32 h-32 bg-gradient-to-r from-orange-400/40 to-red-400/40 rounded-full blur-2xl" />
          <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-gradient-to-r from-red-300/35 to-pink-300/35 rounded-full blur-xl" />
        </div>

        {/* Reduced Floating Coffee Beans */}
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

        {/* Simplified Floating Coffee with Steam */}
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

        {/* Simplified Wave SVG */}
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

      {/* About Section */}
      <section ref={aboutRef} className="py-24 px-6 bg-gradient-to-r from-amber-100/50 to-orange-100/50 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            Câu Chuyện Của Chúng Tôi
          </h2>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            <div className="about-card">
              <h3 className="text-3xl font-bold text-gray-800 mb-6">Khởi Nguồn Đam Mê</h3>
              <p className="text-lg text-gray-600 leading-relaxed mb-6">
                Café Aurora ra đời từ tình yêu thuần khiết với cà phê và mong muốn mang đến 
                những trải nghiệm đặc biệt cho mọi người. Chúng tôi tin rằng mỗi ly cà phê 
                không chỉ là thức uống mà còn là cầu nối kết nối tâm hồn.
              </p>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-2xl">
                  ❤️
                </div>
                <div>
                  <div className="font-semibold text-amber-600">Đam mê</div>
                  <div className="text-gray-600">Từ trái tim</div>
                </div>
              </div>
            </div>

            <div className="about-card">
              <div className="bg-gradient-to-br from-amber-200 to-orange-200 rounded-3xl p-8 h-80 flex items-center justify-center text-6xl">
                🏪
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coffee Process Section */}
      <section ref={processRef} className="py-24 px-6 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Quy Trình Tạo Nên Hoàn Hảo
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {coffeeProcess.map((process, index) => (
              <div key={index} className="process-step text-center">
                <div className="relative mb-6">
                  <div className="w-24 h-24 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto shadow-2xl">
                    {process.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {process.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{process.title}</h3>
                <p className="text-gray-600 leading-relaxed">{process.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section ref={statsRef} className="py-24 px-6 bg-gradient-to-r from-amber-600 to-orange-600 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="stats-item">
              <div className="text-5xl font-bold mb-2">
                <span className="counter" data-target="10000">0</span>+
              </div>
              <div className="text-xl">Khách Hàng Hài Lòng</div>
            </div>
            <div className="stats-item">
              <div className="text-5xl font-bold mb-2">
                <span className="counter" data-target="50">0</span>+
              </div>
              <div className="text-xl">Loại Cà Phê</div>
            </div>
            <div className="stats-item">
              <div className="text-5xl font-bold mb-2">
                <span className="counter" data-target="5">0</span>
              </div>
              <div className="text-xl">Năm Kinh Nghiệm</div>
            </div>
            <div className="stats-item">
              <div className="text-5xl font-bold mb-2">
                <span className="counter" data-target="15">0</span>
              </div>
              <div className="text-xl">Barista Chuyên Nghiệp</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 relative">
            <span className="bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Trải Nghiệm Đặc Biệt
            </span>
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card bg-white/95 backdrop-blur-lg p-10 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 relative overflow-hidden group cursor-pointer"
                onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-15 transition-opacity duration-500`} />
                
                <div className="text-6xl mb-6 text-center group-hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center group-hover:text-gray-900 transition-colors">
                  {feature.title}
                </h3>
                
                <p className="text-gray-600 text-center leading-relaxed text-lg">
                  {feature.description}
                </p>

                <div className="absolute bottom-0 left-0 h-2 bg-gradient-to-r from-amber-500 to-orange-500 w-0 group-hover:w-full transition-all duration-500 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Menu Highlight Section */}
      <section ref={menuHighlightRef} className="py-24 px-6 bg-gradient-to-br from-gray-900 to-gray-800 text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Menu Đặc Biệt Hôm Nay
          </h2>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-6">
              <div className="menu-item bg-white/10 backdrop-blur-lg p-6 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">Signature Aurora Blend</h3>
                    <p className="text-gray-300">Blend độc quyền của Aurora với hương vị đậm đà</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">75.000đ</div>
                </div>
              </div>

              <div className="menu-item bg-white/10 backdrop-blur-lg p-6 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">Honey Cinnamon Latte</h3>
                    <p className="text-gray-300">Latte thơm ngọt với mật ong và quế Ceylon</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">65.000đ</div>
                </div>
              </div>

              <div className="menu-item bg-white/10 backdrop-blur-lg p-6 rounded-2xl hover:bg-white/20 transition-all duration-300">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-amber-300">Vanilla Bean Frappé</h3>
                    <p className="text-gray-300">Frappé mát lạnh với hạt vani Madagascar</p>
                  </div>
                  <div className="text-2xl font-bold text-orange-400">70.000đ</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="w-80 h-80 bg-gradient-to-br from-amber-400/30 to-orange-400/30 rounded-full flex items-center justify-center text-8xl">
                ☕
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Drinks Section */}
      <section ref={drinksRef} className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            Đồ Uống Phổ Biến
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {drinks.map((drink, index) => (
              <div
                key={index}
                className="drink-card bg-white/95 backdrop-blur-sm p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center group relative overflow-hidden cursor-pointer"
                onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
                onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${drink.gradient} opacity-0 group-hover:opacity-25 transition-all duration-500`} />
                
                <div className="liquid-fill absolute bottom-0 left-0 w-full bg-gradient-to-t from-amber-200/50 to-orange-200/50 rounded-3xl transition-all duration-1000" />
                
                <div className="text-7xl mb-6 relative z-10 group-hover:scale-110 transition-transform duration-300">
                  {drink.emoji}
                </div>
                
                <h3 className="text-2xl font-bold text-gray-800 mb-3 relative z-10 group-hover:text-gray-900">
                  {drink.name}
                </h3>

                <p className="text-gray-600 mb-4 relative z-10 text-sm leading-relaxed">
                  {drink.description}
                </p>
                
                <p className="text-amber-600 font-bold text-2xl relative z-10 group-hover:text-amber-700">
                  {drink.price}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section ref={galleryRef} className="py-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Khoảnh Khắc Tại Aurora
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {galleryImages.map((emoji, index) => (
              <div
                key={index}
                className="gallery-item aspect-square bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl flex items-center justify-center text-4xl hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-xl"
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialRef} className="py-24 px-6 bg-gradient-to-r from-gray-50 to-amber-50 relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
            Khách Hàng Nói Gì
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial bg-white p-8 rounded-3xl shadow-xl relative">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">⭐</span>
                  ))}
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed italic">
                  "{testimonial.content}"
                </p>

                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full flex items-center justify-center text-xl">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-gray-800">{testimonial.name}</div>
                    <div className="text-gray-600 text-sm">{testimonial.role}</div>
                  </div>
                </div>

                <div className="absolute top-4 right-4 text-6xl text-amber-200/50">"</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Call to Action */}
      <section ref={ctaRef} className="py-24 px-6 relative overflow-hidden bg-gradient-to-br from-amber-600 to-orange-600 text-white">
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-5xl md:text-6xl font-bold mb-8">
            Hãy Đến Và Trải Nghiệm
          </h2>
          
          <p className="text-2xl mb-12 max-w-3xl mx-auto leading-relaxed opacity-90">
            Mỗi ngụm cà phê là một hành trình khám phá hương vị. 
            Chúng tôi chờ đón bạn tại Café Aurora với những trải nghiệm tuyệt vời nhất.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <button
              className="px-16 py-6 bg-white text-amber-600 font-bold rounded-full shadow-2xl text-xl relative overflow-hidden group transition-all duration-300"
              onMouseEnter={(e) => handleButtonHover(e.currentTarget, true)}
              onMouseLeave={(e) => handleButtonHover(e.currentTarget, false)}
            >
              <span className="relative z-10 flex items-center gap-3">
                <span>🎯</span> Ghé Thăm Ngay Hôm Nay
              </span>
            </button>

            <button className="px-16 py-6 border-3 border-white text-white font-bold rounded-full text-xl relative overflow-hidden group hover:bg-white hover:text-amber-600 transition-all duration-300">
              <span className="relative z-10 flex items-center gap-3">
                <span>📞</span> Liên Hệ Đặt Bàn
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-24 px-6 bg-gradient-to-r from-gray-900 to-black text-white relative overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center mb-20 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            Tìm Đến Aurora
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="contact-card bg-white/10 backdrop-blur-lg p-8 rounded-3xl">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-bold mb-4 text-amber-300">Địa Chỉ</h3>
              <p className="text-gray-300 leading-relaxed">
                123 Đường Nguyễn Văn Linh<br/>
                Quận 7, TP. Hồ Chí Minh<br/>
                Việt Nam
              </p>
            </div>

            <div className="contact-card bg-white/10 backdrop-blur-lg p-8 rounded-3xl">
              <div className="text-4xl mb-4">⏰</div>
              <h3 className="text-xl font-bold mb-4 text-amber-300">Giờ Mở Cửa</h3>
              <p className="text-gray-300 leading-relaxed">
                Thứ 2 - Chủ Nhật<br/>
                6:00 AM - 11:00 PM<br/>
                Phục vụ cả ngày
              </p>
            </div>

            <div className="contact-card bg-white/10 backdrop-blur-lg p-8 rounded-3xl">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold mb-4 text-amber-300">Liên Hệ</h3>
              <p className="text-gray-300 leading-relaxed">
                Điện thoại: 0901 234 567<br/>
                Email: hello@cafeaurora.vn<br/>
                Website: cafeaurora.vn
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </div>
  );
};

export default Home;