import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Users, Coffee, Clock } from 'lucide-react';
import type { HasAnimatedState } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface AboutUsProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const AboutUs: React.FC<AboutUsProps> = ({ hasAnimated, setHasAnimated }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  const stats = [
    { icon: Coffee, value: "500+", label: "Cửa hàng toàn quốc", color: "text-orange-500" },
    { icon: Users, value: "2M+", label: "Khách hàng tin tưởng", color: "text-amber-500" },
    { icon: Award, value: "25+", label: "Năm kinh nghiệm", color: "text-yellow-500" },
    { icon: Clock, value: "24/7", label: "Phục vụ tận tâm", color: "text-orange-600" }
  ];

  useEffect(() => {
    if (!hasAnimated.about && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set([contentRef.current, imageRef.current, statsRef.current?.children], {
          opacity: 0,
          y: 50
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => setHasAnimated(prev => ({ ...prev, about: true }))
            });

            tl.to(contentRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(imageRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            }, "-=0.4")
            .to(statsRef.current?.children || [], {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1
            }, "-=0.4");
          }
        });

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [hasAnimated.about, setHasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div ref={contentRef} className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full">
                <Award className="w-4 h-4" />
                <span className="font-semibold">Về Chúng Tôi</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold text-amber-900 leading-tight">
                Đồng Hành Cùng
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">
                  {" "}Café Aurora
                </span>
              </h2>
              <p className="text-xl text-amber-700 leading-relaxed">
                Từ khi thành lập, Café Aurora đã trở thành thương hiệu cà phê hàng đầu, 
                mang đến trải nghiệm cà phê tuyệt vời và không gian thư giãn lý tưởng cho mọi người.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Chất Lượng Hàng Đầu</h3>
                  <p className="text-amber-700">
                    Sử dụng 100% hạt cà phê Arabica cao cấp, được rang xay theo công nghệ hiện đại 
                    để giữ trọn hương vị đặc trưng.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Không Gian Ấm Cúng</h3>
                  <p className="text-amber-700">
                    Thiết kế hiện đại, không gian thoải mái là nơi lý tưởng để làm việc, 
                    gặp gỡ bạn bè hay thư giãn sau những giờ phút bận rộn.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Award className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Dịch Vụ Tận Tâm</h3>
                  <p className="text-amber-700">
                    Đội ngũ nhân viên chuyên nghiệp, nhiệt tình luôn sẵn sàng mang đến 
                    trải nghiệm dịch vụ tốt nhất cho khách hàng.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div ref={imageRef} className="relative">
            <div className="relative">
              {/* Main Image */}
              <div className="relative w-full h-96 lg:h-[500px] rounded-3xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-orange-400 to-red-500 opacity-10"></div>
                <img 
                  src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 500'%3E%3Cdefs%3E%3ClinearGradient id='bg' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F97316'/%3E%3Cstop offset='100%25' style='stop-color:%23DC2626'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='400' height='500' fill='url(%23bg)'/%3E%3Cg transform='translate(50,50)'%3E%3Crect x='50' y='100' width='200' height='250' rx='20' fill='%23FFFFFF' opacity='0.9'/%3E%3Crect x='70' y='120' width='160' height='20' rx='10' fill='%23D97706'/%3E%3Crect x='70' y='160' width='160' height='80' rx='10' fill='%23F59E0B' opacity='0.8'/%3E%3Crect x='70' y='260' width='160' height='80' rx='10' fill='%23EF4444' opacity='0.8'/%3E%3Ccircle cx='150' cy='380' r='30' fill='%23FFFFFF' opacity='0.9'/%3E%3Ctext x='150' y='390' text-anchor='middle' fill='%23DC2626' font-size='20' font-weight='bold'%3EH%3C/text%3E%3C/g%3E%3C/svg%3E"
                  alt="Highlands Coffee Interior"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-400 rounded-full opacity-20 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-red-400 rounded-full opacity-30 animate-bounce"></div>
              
              {/* Award Badge */}
              <div className="absolute top-8 left-8 bg-white rounded-2xl p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-yellow-500 fill-current" />
                  <div>
                    <div className="text-sm font-bold text-gray-800">Top Brand</div>
                    <div className="text-xs text-gray-600">Coffee Chain</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div ref={statsRef} className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-20">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <div key={index} className="text-center group">
                <div className="relative">
                  <div className={`w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-400 rounded-full opacity-30 animate-ping"></div>
                </div>
                <div className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
