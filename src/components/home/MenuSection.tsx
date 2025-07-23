import React, { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Star, ShoppingCart, Heart, Filter } from 'lucide-react';
import type { HasAnimatedState } from '@/types';

gsap.registerPlugin(ScrollTrigger);

interface MenuSectionProps {
  hasAnimated: HasAnimatedState;
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const MenuSection: React.FC<MenuSectionProps> = ({ hasAnimated, setHasAnimated }) => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const filtersRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Tất Cả', count: 12 },
    { id: 'coffee', name: 'Cà Phê', count: 8 },
    { id: 'tea', name: 'Trà', count: 6 },
    { id: 'smoothie', name: 'Sinh Tố', count: 4 },
    { id: 'cake', name: 'Bánh Ngọt', count: 5 }
  ];

  const menuItems = [
    {
      id: 1,
      name: "Highlands Dừa Mới",
      category: "coffee",
      description: "Cà phê đậm đà kết hợp với vị dừa tươi mát, tạo nên hương vị độc đáo",
      price: 45000,
      originalPrice: 55000,
      rating: 4.8,
      reviews: 342,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='coffee1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23F59E0B'/%3E%3Cstop offset='100%25' style='stop-color:%23D97706'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='40' y='50' width='120' height='150' rx='15' fill='url(%23coffee1)'/%3E%3Crect x='30' y='40' width='140' height='20' rx='10' fill='%23FCD34D'/%3E%3Ccircle cx='100' cy='30' r='6' fill='%23EF4444'/%3E%3Cpath d='M70 120 Q100 100 130 120 Q100 140 70 120' fill='%23FFFFFF' opacity='0.7'/%3E%3C/svg%3E",
      tags: ["Mới", "Hot"],
      isNew: true
    },
    {
      id: 2,
      name: "Phindi Xoài Dừa",
      category: "coffee",
      description: "Phin cà phê truyền thống với hương vị xoài dừa tropical tươi mát",
      price: 39000,
      originalPrice: 49000,
      rating: 4.9,
      reviews: 521,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='mango1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FCD34D'/%3E%3Cstop offset='100%25' style='stop-color:%23F59E0B'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='40' y='50' width='120' height='150' rx='15' fill='url(%23mango1)'/%3E%3Crect x='30' y='40' width='140' height='20' rx='10' fill='%2316A34A'/%3E%3Ccircle cx='100' cy='30' r='6' fill='%23EF4444'/%3E%3Cpath d='M60 110 Q100 90 140 110 Q100 130 60 110' fill='%23FFFFFF' opacity='0.8'/%3E%3C/svg%3E",
      tags: ["Bán Chạy"],
      isBestSeller: true
    },
    {
      id: 3,
      name: "Freeze Trà Xanh",
      category: "tea",
      description: "Trà xanh Nhật Bản cao cấp đá xay mát lạnh, giải nhiệt hoàn hảo",
      price: 42000,
      originalPrice: 52000,
      rating: 4.7,
      reviews: 289,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='tea1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%2365A30D'/%3E%3Cstop offset='100%25' style='stop-color:%2316A34A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='40' y='50' width='120' height='150' rx='15' fill='url(%23tea1)'/%3E%3Crect x='30' y='40' width='140' height='20' rx='10' fill='%23DC2626'/%3E%3Ccircle cx='100' cy='30' r='6' fill='%23EF4444'/%3E%3Cpath d='M80 130 Q100 110 120 130 Q100 150 80 130' fill='%23FFFFFF' opacity='0.6'/%3E%3C/svg%3E",
      tags: ["Yêu Thích"],
      isPopular: true
    },
    {
      id: 4,
      name: "Cappuccino Đậm Đà",
      category: "coffee",
      description: "Espresso đậm đà kết hợp với sữa tươi, tạo lớp foam mịn màng",
      price: 48000,
      originalPrice: null,
      rating: 4.6,
      reviews: 178,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='cap1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23A16207'/%3E%3Cstop offset='100%25' style='stop-color:%236B2F00'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='40' y='50' width='120' height='150' rx='15' fill='url(%23cap1)'/%3E%3Crect x='30' y='40' width='140' height='20' rx='10' fill='%23FCD34D'/%3E%3Ccircle cx='100' cy='30' r='6' fill='%23EF4444'/%3E%3Cpath d='M50 80 Q100 60 150 80 Q100 100 50 80' fill='%23FBBF24' opacity='0.9'/%3E%3C/svg%3E",
      tags: ["Truyền Thống"],
      isClassic: true
    },
    {
      id: 5,
      name: "Smoothie Dâu Tây",
      category: "smoothie",
      description: "Dâu tây tươi ngon xay với sữa chua, vitamin C tự nhiên",
      price: 52000,
      originalPrice: null,
      rating: 4.8,
      reviews: 234,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='berry1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FBBF24'/%3E%3Cstop offset='50%25' style='stop-color:%23F59E0B'/%3E%3Cstop offset='100%25' style='stop-color:%23EF4444'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='40' y='50' width='120' height='150' rx='15' fill='url(%23berry1)'/%3E%3Crect x='30' y='40' width='140' height='20' rx='10' fill='%2316A34A'/%3E%3Ccircle cx='100' cy='30' r='6' fill='%23EF4444'/%3E%3Cpath d='M65 105 Q100 85 135 105 Q100 125 65 105' fill='%23FFFFFF' opacity='0.8'/%3E%3C/svg%3E",
      tags: ["Healthy"],
      isHealthy: true
    },
    {
      id: 6,
      name: "Bánh Tiramisu",
      category: "cake",
      description: "Bánh Tiramisu Ý truyền thống với lớp kem mascarpone mềm mịn",
      price: 65000,
      originalPrice: null,
      rating: 4.9,
      reviews: 156,
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 250'%3E%3Cdefs%3E%3ClinearGradient id='cake1' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' style='stop-color:%23FEF3C7'/%3E%3Cstop offset='50%25' style='stop-color:%23FCD34D'/%3E%3Cstop offset='100%25' style='stop-color:%23A16207'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect x='30' y='80' width='140' height='100' rx='10' fill='url(%23cake1)'/%3E%3Crect x='30' y='70' width='140' height='20' rx='5' fill='%23FFFFFF'/%3E%3Crect x='30' y='120' width='140' height='10' rx='2' fill='%23A16207'/%3E%3Crect x='30' y='140' width='140' height='20' rx='5' fill='%23FFFFFF'/%3E%3C/svg%3E",
      tags: ["Premium"],
      isPremium: true
    }
  ];

  const filteredItems = activeFilter === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeFilter);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
  };

  useEffect(() => {
    if (!hasAnimated.drinks && sectionRef.current) {
      const ctx = gsap.context(() => {
        gsap.set([titleRef.current, filtersRef.current, menuRef.current?.children], {
          opacity: 0,
          y: 50
        });

        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: "top 80%",
          onEnter: () => {
            const tl = gsap.timeline({
              onComplete: () => setHasAnimated(prev => ({ ...prev, drinks: true }))
            });

            tl.to(titleRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out"
            })
            .to(filtersRef.current, {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out"
            }, "-=0.4")
            .to(menuRef.current?.children || [], {
              opacity: 1,
              y: 0,
              duration: 0.6,
              ease: "power3.out",
              stagger: 0.1
            }, "-=0.3");
          }
        });

      }, sectionRef);

      return () => ctx.revert();
    }
  }, [hasAnimated.drinks, setHasAnimated]);

  return (
    <section ref={sectionRef} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div ref={titleRef} className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-4 py-2 rounded-full mb-4">
            <Filter className="w-4 h-4" />
            <span className="font-semibold">Menu Đặc Biệt</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Thưởng Thức
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">
              {" "}Hương Vị
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá thực đơn đa dạng với những món đồ uống và bánh ngọt được chế biến từ nguyên liệu cao cấp
          </p>
        </div>

        {/* Category Filters */}
        <div ref={filtersRef} className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div ref={menuRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gradient-to-br from-orange-50 to-red-50 overflow-hidden">
                {/* Tags */}
                <div className="absolute top-4 left-4 z-10">
                  {item.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold text-white mr-2 mb-2 ${
                        tag === 'Mới' ? 'bg-green-500' :
                        tag === 'Hot' ? 'bg-red-500' :
                        tag === 'Bán Chạy' ? 'bg-purple-500' :
                        tag === 'Yêu Thích' ? 'bg-pink-500' :
                        tag === 'Truyền Thống' ? 'bg-blue-500' :
                        tag === 'Healthy' ? 'bg-emerald-500' :
                        'bg-amber-500'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Heart Icon */}
                <button className="absolute top-4 right-4 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center z-10 hover:bg-white transition-colors">
                  <Heart className="w-5 h-5 text-gray-600 hover:text-red-500 hover:fill-current transition-colors" />
                </button>

                {/* Product Image */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <img 
                    src={item.image}
                    alt={item.name}
                    className="w-24 h-32 object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-16 h-16 bg-white/20 rounded-full blur-xl"></div>
                <div className="absolute bottom-8 left-8 w-12 h-12 bg-yellow-300/30 rounded-full blur-lg"></div>
              </div>

              {/* Content Section */}
              <div className="p-6 space-y-4">
                {/* Rating */}
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 ${i < Math.floor(item.rating) ? 'fill-current' : ''}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">({item.rating}) • {item.reviews} đánh giá</span>
                </div>

                {/* Title & Description */}
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors">
                    {item.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>

                {/* Price & Action */}
                <div className="flex items-center justify-between pt-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-orange-600">{formatPrice(item.price)}</span>
                      {item.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">{formatPrice(item.originalPrice)}</span>
                      )}
                    </div>
                    {item.originalPrice && (
                      <div className="text-xs text-green-600 font-semibold">
                        Tiết kiệm {formatPrice(item.originalPrice - item.price)}
                      </div>
                    )}
                  </div>
                  
                  <button className="group/btn bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110">
                    <ShoppingCart className="w-5 h-5 group-hover/btn:animate-bounce" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center mt-12">
          <button className="group bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <span className="flex items-center gap-2">
              Xem Toàn Bộ Menu
              <Filter className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default MenuSection;
