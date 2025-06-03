import React, { useRef, useEffect, useCallback } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface FeaturesProps {
  hasAnimated: { features: boolean };
  setHasAnimated: React.Dispatch<React.SetStateAction<any>>;
}

const Features: React.FC<FeaturesProps> = ({ hasAnimated, setHasAnimated }) => {
  const featuresRef = useRef<HTMLDivElement>(null);

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
              onComplete: () => setHasAnimated((prev: any) => ({ ...prev, features: true }))
            }
          );
        }
      }
    });
  }, [hasAnimated, setHasAnimated]);

  return (
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
  );
};

export default Features;