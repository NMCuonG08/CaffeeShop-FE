import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Coffee, Star, ArrowRight } from 'lucide-react';
import type { HasAnimatedState } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface FeaturedProductsProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const FeaturedProducts: React.FC<FeaturedProductsProps> = ({ hasAnimated, setHasAnimated }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);

  const featuredProducts = [
    {
      id: 1,
      name: "Aurora Signature",
      subtitle: "Đặc sản của nhà",
      price: "45.000đ",
      image: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.9
    },
    {
      id: 2,
      name: "Golden Mocha",
      subtitle: "Vị chocolate đậm đà",
      price: "52.000đ",
      image: "https://images.unsplash.com/photo-1549888834-3ec93abae044?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.8
    },
    {
      id: 3,
      name: "Aurora Latte",
      subtitle: "Nghệ thuật cà phê",
      price: "48.000đ",
      image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      rating: 4.7
    }
  ];

  useEffect(() => {
    if (!hasAnimated.features && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, productsRef.current?.children], {
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
            .to(productsRef.current?.children || [], {
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
    <section ref={sectionRef} className="py-20 bg-gradient-to-b from-amber-950 via-orange-950 to-yellow-950">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-600/20 backdrop-blur-sm text-amber-300 px-6 py-3 rounded-full mb-6 border border-amber-500/30">
            <Coffee className="w-5 h-5 animate-pulse" />
            <span className="font-semibold">Sản Phẩm Nổi Bật</span>
          </div>
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 drop-shadow-2xl">
            Hương Vị
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-yellow-400">
              {" "}Đặc Biệt
            </span>
          </h2>
          <p className="text-xl text-amber-200 max-w-2xl mx-auto leading-relaxed">
            Những tách cà phê được pha chế tỉ mỉ từ những hạt cà phê tuyển chọn, 
            mang đến trải nghiệm vị giác đáng nhớ
          </p>
        </div>

        {/* Featured Products */}
        <div ref={productsRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {featuredProducts.map((product, index) => (
            <div 
              key={product.id}
              className="group relative bg-gradient-to-br from-amber-900/50 to-orange-900/50 backdrop-blur-sm rounded-3xl overflow-hidden border border-amber-500/20 hover:border-amber-400/40 transition-all duration-500 transform hover:-translate-y-4 hover:scale-105"
            >
              {/* Coffee Steam Effect */}
              <div className="absolute top-4 right-4 z-10">
                <div className="flex space-x-1">
                  <div className="w-1 h-6 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="w-1 h-8 bg-white/20 rounded-full animate-pulse delay-100"></div>
                  <div className="w-1 h-4 bg-white/40 rounded-full animate-pulse delay-200"></div>
                </div>
              </div>

              {/* Product Image */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 300'%3E%3Cdefs%3E%3ClinearGradient id='coffee${index}' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F59E0B'/%3E%3Cstop offset='100%25' style='stop-color:%23D97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='300' height='300' fill='url(%23coffee${index})'/%3E%3Ccircle cx='150' cy='150' r='80' fill='%23FFFFFF' opacity='0.9'/%3E%3Ccircle cx='150' cy='150' r='60' fill='%23D97706'/%3E%3Cpath d='M120 130 Q150 110 180 130 Q150 150 120 130' fill='%23FFFFFF' opacity='0.7'/%3E%3C/svg%3E`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                {/* Coffee Beans Floating */}
                <div className="absolute top-2 left-2 w-2 h-3 bg-amber-300/60 rounded-full animate-pulse"></div>
                <div className="absolute top-6 left-6 w-1 h-2 bg-orange-300/60 rounded-full animate-pulse delay-100"></div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-current' : ''} animate-pulse`}
                      style={{animationDelay: `${i * 100}ms`}}
                    />
                  ))}
                  <span className="text-sm text-amber-300 ml-2">({product.rating})</span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-white group-hover:text-amber-300 transition-colors duration-300">
                    {product.name}
                  </h3>
                  <p className="text-amber-200 text-sm">{product.subtitle}</p>
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-2xl font-bold text-amber-400">
                    {product.price}
                  </div>
                  
                  <button className="group/btn bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white p-3 rounded-full shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-110 hover:rotate-12">
                    <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br from-amber-400 to-orange-400 transition-opacity duration-500 pointer-events-none"></div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <button className="group bg-gradient-to-r from-amber-600 via-orange-500 to-yellow-600 text-white px-10 py-4 rounded-full font-semibold text-lg shadow-2xl hover:shadow-amber-500/50 transition-all duration-500 transform hover:scale-110">
            <span className="flex items-center gap-3">
              Khám Phá Thêm
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
