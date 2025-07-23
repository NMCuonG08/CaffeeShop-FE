import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import HeroBanner from '@/components/home/HeroBanner';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import AboutUs from '@/components/home/AboutUs';
import type { HasAnimatedState } from '@/types';

const Home: React.FC = () => {
  const [hasAnimated, setHasAnimated] = useState<HasAnimatedState>({
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

  const [currentSlide, setCurrentSlide] = useState(0);
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, -150]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const storySlides = [
    {
      title: "CÂU CHUYỆN CÀ PHÊ AURORA",
      subtitle: "Từ hạt cà phê đến tách cà phê hoàn hảo",
      image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description: "Mỗi tách cà phê Aurora đều kể một câu chuyện riêng - từ những vùng cao nguyên Việt Nam đến tay những người thợ pha chế tâm huyết."
    },
    {
      title: "HƯƠNG VỊ ĐÍCH THỰC",
      subtitle: "100% Arabica từ Đà Lạt",
      image: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description: "Chúng tôi chọn lọc những hạt cà phê Arabica tốt nhất, rang tại chỗ để mang đến hương vị tinh tế và đậm đà nhất."
    },
    {
      title: "KHÔNG GIAN AURORA",
      subtitle: "Nơi tâm hồn gặp gỡ cà phê",
      image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
      description: "Từng góc nhỏ trong Café Aurora được thiết kế để bạn có thể thưởng thức cà phê trong không gian ấm cúng và thư giãn."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-950 via-orange-950 to-yellow-950 overflow-hidden">
      {/* Hero Section */}
      <HeroBanner hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />
      
      {/* Story Section - Inspired by PJ's Coffee */}
      <motion.section 
        className="relative min-h-screen flex items-center justify-center"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Story Slides */}
        <div className="relative w-full h-screen overflow-hidden">
          {storySlides.map((slide, index) => (
            <motion.div
              key={index}
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ 
                opacity: currentSlide === index ? 1 : 0,
                scale: currentSlide === index ? 1 : 1.1
              }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              {/* Background Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-black/60"></div>
              </div>
              
              {/* Content */}
              <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ 
                    y: currentSlide === index ? 0 : 50,
                    opacity: currentSlide === index ? 1 : 0
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="space-y-6"
                >
                  <h2 className="text-6xl lg:text-8xl font-bold text-amber-300 leading-tight">
                    {slide.title}
                  </h2>
                  <p className="text-2xl lg:text-3xl text-amber-100 font-light">
                    {slide.subtitle}
                  </p>
                  <p className="text-lg lg:text-xl text-amber-200 max-w-2xl mx-auto leading-relaxed">
                    {slide.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4">
          {storySlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                currentSlide === index ? 'bg-amber-400 scale-125' : 'bg-amber-400/40'
              }`}
            />
          ))}
        </div>
      </motion.section>

      {/* Featured Products Section */}
      <motion.section
        initial={{ opacity: 0, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20 bg-gradient-to-br from-amber-900/20 to-orange-900/20 backdrop-blur-sm"
      >
        <FeaturedProducts hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />
      </motion.section>

      {/* About Section */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: true, margin: "-100px" }}
        className="py-20"
      >
        <AboutUs hasAnimated={hasAnimated} setHasAnimated={setHasAnimated} />
      </motion.section>

      {/* Coffee Culture Section - New storytelling section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        viewport={{ once: true }}
        className="py-32 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-transparent"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-6xl mx-auto text-center">
            <motion.h2 
              className="text-5xl lg:text-7xl font-bold text-amber-300 mb-8"
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              VĂN HÓA CÀ PHÊ AURORA
            </motion.h2>
            
            <motion.p 
              className="text-xl lg:text-2xl text-amber-100 mb-16 leading-relaxed"
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              Không chỉ là nơi thưởng thức cà phê, Aurora là nơi kết nối những tâm hồn, 
              nơi những câu chuyện được chia sẻ và những kỷ niệm được tạo nên.
            </motion.p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Kết Nối", desc: "Nơi bạn bè gặp gỡ", icon: "☕" },
                { title: "Sáng Tạo", desc: "Nguồn cảm hứng vô tận", icon: "✨" },
                { title: "Thư Giãn", desc: "Khoảnh khắc bình yên", icon: "🌅" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 hover:bg-white/20 transition-all duration-300"
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 * index }}
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-2xl font-bold text-amber-300 mb-2">{item.title}</h3>
                  <p className="text-amber-200">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;