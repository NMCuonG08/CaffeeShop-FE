import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ShoppingCart, Heart, Star, ChevronRight } from 'lucide-react';
import type { HasAnimatedState } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface SpecialOffersProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const SpecialOffers: React.FC<SpecialOffersProps> = ({ hasAnimated, setHasAnimated }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const offers = [
    {
      id: 1,
      title: "Highlands Dừa Mới",
      subtitle: "Dừa Mịn - Dừa Mát",
      description: "Thưởng thức hương vị tươi mát từ dừa tự nhiên, kết hợp hoàn hảo với cà phê đậm đà",
      price: "45.000đ",
      originalPrice: "55.000đ",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='drink' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2392C5F7'/%3E%3Cstop offset='50%25' style='stop-color:%2393C5F7'/%3E%3Cstop offset='100%25' style='stop-color:%236366F1'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='80' y='100' width='140' height='180' rx='15' fill='url(%23drink)'/%3E%3Crect x='70' y='90' width='160' height='20' rx='10' fill='%23F59E0B'/%3E%3Ccircle cx='150' cy='80' r='8' fill='%23EF4444'/%3E%3Cpath d='M120 150 Q150 130 180 150 Q150 170 120 150' fill='%23FFFFFF' opacity='0.7'/%3E%3C/svg%3E",
      tag: "MỚI",
      rating: 4.8,
      isHot: true
    },
    {
      id: 2,
      title: "Phindi Xoài Dừa",
      subtitle: "Vị ngọt thanh mát",
      description: "Sự kết hợp độc đáo giữa cà phê phin truyền thống và hương vị xoài dừa tropical",
      price: "39.000đ",
      originalPrice: "49.000đ",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='mango' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FCD34D'/%3E%3Cstop offset='50%25' style='stop-color:%23F59E0B'/%3E%3Cstop offset='100%25' style='stop-color:%23D97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='80' y='100' width='140' height='180' rx='15' fill='url(%23mango)'/%3E%3Crect x='70' y='90' width='160' height='20' rx='10' fill='%23059669'/%3E%3Ccircle cx='150' cy='80' r='8' fill='%23EF4444'/%3E%3Cpath d='M110 140 Q150 120 190 140 Q150 160 110 140' fill='%23FFFFFF' opacity='0.8'/%3E%3C/svg%3E",
      tag: "BÁN CHẠY",
      rating: 4.9,
      isHot: false
    },
    {
      id: 3,
      title: "Freeze Trà Xanh",
      subtitle: "Đá xay mát lạnh",
      description: "Trà xanh Nhật Bản cao cấp kết hợp cùng đá xay tạo nên thức uống giải nhiệt hoàn hảo",
      price: "42.000đ",
      originalPrice: "52.000đ",
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='greentea' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2365A30D'/%3E%3Cstop offset='50%25' style='stop-color:%2316A34A'/%3E%3Cstop offset='100%25' style='stop-color:%23166534'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='80' y='100' width='140' height='180' rx='15' fill='url(%23greentea)'/%3E%3Crect x='70' y='90' width='160' height='20' rx='10' fill='%23DC2626'/%3E%3Ccircle cx='150' cy='80' r='8' fill='%23EF4444'/%3E%3Cpath d='M130 160 Q150 140 170 160 Q150 180 130 160' fill='%23FFFFFF' opacity='0.6'/%3E%3C/svg%3E",
      tag: "YÊU THÍCH",
      rating: 4.7,
      isHot: false
    }
  ];

  useEffect(() => {
    if (!hasAnimated.features && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, cardsRef.current?.children], {
          opacity: 0,
          y: 50
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => setHasAnimated(prev => ({ ...prev, features: true }))
            });

            tl.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(cardsRef.current?.children || [], {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.2
            }, "-=0.4");
          }
        });

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [hasAnimated.features, setHasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-white to-orange-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4">
            <Heart className="w-4 h-4 fill-current" />
            <span className="font-semibold">Ưu Đãi Đặc Biệt</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Món Mới & 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {" "}Ưu Đãi Hot
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những món đồ uống mới nhất với hương vị độc đáo và ưu đãi hấp dẫn chỉ có tại Highlands Coffee
          </p>
        </div>

        {/* Offers Grid */}
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {offers.map((offer) => (
            <div 
              key={offer.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden"
            >
              {/* Card Header */}
              <div className="relative h-64 bg-gradient-to-br from-orange-100 to-red-100 overflow-hidden">
                {/* Tag */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white z-10 ${
                  offer.tag === 'MỚI' ? 'bg-green-500' : 
                  offer.tag === 'BÁN CHẠY' ? 'bg-red-500' : 'bg-purple-500'
                }`}>
                  {offer.tag}
                </div>

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center z-10 hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 hover:fill-current transition-colors" />
                </button>

                {/* Product Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={offer.image}
                    alt={offer.title}
                    className="w-32 h-32 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Floating Elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 bg-yellow-300/30 rounded-full blur-lg"></div>
              </div>

              {/* Card Content */}
              <div className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(offer.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({offer.rating})</span>
                  {offer.isHot && (
                    <span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-semibold">
                      🔥 HOT
                    </span>
                  )}
                </div>

                {/* Title & Subtitle */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">{offer.title}</h3>
                  <p className="text-orange-600 font-semibold text-sm">{offer.subtitle}</p>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm line-clamp-2">{offer.description}</p>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-orange-600">{offer.price}</span>
                      <span className="text-sm text-gray-400 line-through">{offer.originalPrice}</span>
                    </div>
                    <div className="text-xs text-green-600 font-semibold">
                      Tiết kiệm {parseInt(offer.originalPrice.replace(/\D/g, '')) - parseInt(offer.price.replace(/\D/g, ''))}đ
                    </div>
                  </div>
                  
                  <button className="group/btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center gap-2">
              Xem Tất Cả Ưu Đãi
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default SpecialOffers;
