import React, { useRef, useEffect } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface AboutProps {
  hasAnimated: { about: boolean };
  setHasAnimated: React.Dispatch<React.SetStateAction<any>>;
}

const About: React.FC<AboutProps> = ({ hasAnimated, setHasAnimated }) => {
  const aboutRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
              onComplete: () => setHasAnimated((prev: any) => ({ ...prev, about: true }))
            }
          );
        }
      }
    });
  }, [hasAnimated, setHasAnimated]);

  return (
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
  );
};

export default About;