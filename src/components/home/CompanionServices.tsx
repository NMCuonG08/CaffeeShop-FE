import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Smartphone, CreditCard, MapPin, Gift } from 'lucide-react';
import type { HasAnimatedState } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface CompanionServicesProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const CompanionServices: React.FC<CompanionServicesProps> = ({ hasAnimated, setHasAnimated }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: Smartphone,
      title: "Ứng Dụng Highlands",
      description: "Đặt hàng dễ dàng, thanh toán nhanh chóng và nhận ưu đãi độc quyền qua ứng dụng di động",
      features: ["Đặt hàng online", "Thanh toán QR", "Ưu đãi độc quyền"],
      color: "from-blue-500 to-purple-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600"
    },
    {
      icon: CreditCard,
      title: "Thẻ Highlands",
      description: "Thẻ thành viên cao cấp với nhiều đặc quyền và ưu đãi dành riêng cho khách hàng VIP",
      features: ["Tích điểm thưởng", "Ưu đãi sinh nhật", "Quyền lợi VIP"],
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600"
    },
    {
      icon: MapPin,
      title: "Cửa Hàng Gần Bạn",
      description: "Hệ thống 500+ cửa hàng trên toàn quốc, luôn có Highlands ở gần bạn mọi lúc mọi nơi",
      features: ["500+ cửa hàng", "Phủ sóng toàn quốc", "Tiện lợi mọi lúc"],
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600"
    },
    {
      icon: Gift,
      title: "Highlands Rewards",
      description: "Chương trình tích điểm hấp dẫn với vô vàn quà tặng và ưu đãi mê say dành cho bạn",
      features: ["Tích điểm mỗi lần mua", "Đổi quà miễn phí", "Ưu đãi mê say"],
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600"
    }
  ];

  useEffect(() => {
    if (!hasAnimated.gallery && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, servicesRef.current?.children], {
          opacity: 0,
          y: 50
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => setHasAnimated(prev => ({ ...prev, gallery: true }))
            });

            tl.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(servicesRef.current?.children || [], {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.15
            }, "-=0.4");
          }
        });

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [hasAnimated.gallery, setHasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4">
            <Gift className="w-4 h-4" />
            <span className="font-semibold">Đồng Hành Cùng Bạn</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Đồng Hành Cùng
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {" "}Highlands
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Khám phá hệ sinh thái dịch vụ toàn diện của Highlands Coffee - 
            nơi mang đến trải nghiệm tuyệt vời cho cuộc sống hiện đại
          </p>
        </div>

        {/* Services Grid */}
        <div ref={servicesRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={index}
                className="group bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2"
              >
                {/* Icon */}
                <div className={`w-16 h-16 ${service.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className={`w-8 h-8 ${service.textColor}`} />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 group-hover:text-gray-900 transition-colors">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>

                  {/* Features */}
                  <div className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-orange-400 to-red-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button className={`w-full mt-6 bg-gradient-to-r ${service.color} text-white py-3 px-4 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 transform hover:scale-105`}>
                    Khám Phá Ngay
                  </button>
                </div>

                {/* Hover Effect Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}></div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 lg:p-12 text-white">
            <h3 className="text-3xl lg:text-4xl font-bold mb-4">
              Tải Ứng Dụng Highlands Coffee
            </h3>
            <p className="text-xl mb-8 opacity-90">
              Trải nghiệm đặt hàng tiện lợi và nhận ưu đãi độc quyền ngay hôm nay
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09z'/%3E%3Cpath d='M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'/%3E%3C/svg%3E" alt="Apple" className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">Download on the</div>
                  <div className="text-sm font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center gap-3 bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors w-full sm:w-auto justify-center">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='white'%3E%3Cpath d='M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 0 1-.61-.92V2.734a1 1 0 0 1 .609-.92zm10.89 10.893l2.302 2.302-10.937 6.333 8.635-8.635zm3.199-3.198l2.807 1.626a1 1 0 0 1 0 1.73l-2.808 1.626L15.491 12l2.207-2.491zM5.864 2.658L16.802 8.99 14.5 11.293 5.864 2.658z'/%3E%3C/svg%3E" alt="Google Play" className="w-6 h-6" />
                <div className="text-left">
                  <div className="text-xs">GET IT ON</div>
                  <div className="text-sm font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CompanionServices;
