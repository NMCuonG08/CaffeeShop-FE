import React, { useRef, useEffect, useCallback, useState } from 'react';
import { ShoppingCart, Zap, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCheapestProducts, type Product } from '@/features/product/services/product.query';
import { toast } from 'react-hot-toast';
import { useCart } from '@/features/cart/hooks/useCart';
import type { HasAnimatedState } from '@/types';

interface DrinksProps {
  hasAnimated: { drinks: boolean };
  setHasAnimated: React.Dispatch<React.SetStateAction<HasAnimatedState>>;
}

const Drinks: React.FC<DrinksProps> = ({ hasAnimated, setHasAnimated }) => {
  const drinksRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  
  // Queries
  const { data: products = [], isLoading, error, isError } = useCheapestProducts();
  const { addToCart } = useCart();
  
  // Ensure products is an array
  const productList = Array.isArray(products) ? products : [];
  
  // Carousel settings
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(productList.length / itemsPerSlide);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Auto-play carousel
  useEffect(() => {
    if (!isLoading && productList.length > itemsPerSlide) {
      const interval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isLoading, productList.length, nextSlide]);
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount * 25000); // Convert to VND (assuming 1 USD = 25000 VND)
  };

  const getProductEmoji = (category?: string, type?: string) => {
    const categoryStr = category?.toLowerCase() || '';
    const typeStr = type?.toLowerCase() || '';

    if (categoryStr.includes('coffee')) return '☕';
    if (categoryStr.includes('tea')) return '🍵';
    if (typeStr.includes('syrup')) return '🍯';
    if (categoryStr.includes('beverage')) return '🥤';
    return '☕'; // default
  };

  const getGradientClass = (category?: string, isPromo?: boolean) => {
    const categoryStr = category?.toLowerCase() || '';

    if (isPromo) return 'from-red-400 to-pink-500';
    if (categoryStr.includes('coffee')) return 'from-amber-400 to-orange-500';
    if (categoryStr.includes('tea')) return 'from-green-400 to-emerald-500';
    if (categoryStr.includes('add-on')) return 'from-purple-400 to-pink-500';
    return 'from-blue-400 to-cyan-500';
  };

  const handleAddToCart = async (product: Product) => {
   setIsAdding(true);
      
      try {
        await addToCart({
          productId: product.product_id,
          quantity: 1,
          productDetails: {
            name: product.product,
            price: product.current_retail_price,
            imageUrl: product.product_image_cover || null,
            maxQuantity: 10 // hoặc từ product data
          }
        });
        
        toast.success(`Added ${product.product} to cart!`);
      } catch (error) {
        toast.error('Failed to add product to cart');
        console.error('Add to cart error:', error);
      } finally {
        setIsAdding(false);
      }
  };

  const handleCardHover = useCallback((element: HTMLElement, isEnter: boolean) => {
    // Simple hover effect without GSAP
    if (isEnter) {
      element.style.transform = 'scale(1.02)';
      const quickActions = element.querySelector('.quick-actions') as HTMLElement;
      if (quickActions) {
        quickActions.style.opacity = '1';
        quickActions.style.transform = 'translateY(0)';
      }
    } else {
      element.style.transform = 'scale(1)';
      const quickActions = element.querySelector('.quick-actions') as HTMLElement;
      if (quickActions) {
        quickActions.style.opacity = '0';
        quickActions.style.transform = 'translateY(10px)';
      }
    }
  }, []);

  // Remove GSAP animation effect
  useEffect(() => {
    // Set animated to true since we're not using animations
    if (!hasAnimated.drinks) {
      setHasAnimated((prev) => ({ ...prev, drinks: true }));
    }
  }, [hasAnimated.drinks, setHasAnimated]);

  if (isLoading || isAdding ) {
    return (
      <section className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-center text-gray-800 mb-20 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            ☕ Sản Phẩm Giá Tốt
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="bg-white/80 p-8 rounded-3xl animate-pulse">
                <div className="w-20 h-20 bg-gray-300 rounded-full mx-auto mb-4"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded mb-4"></div>
                <div className="h-8 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (isError || error) {
    return (
      <section className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-6xl mx-auto text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải dữ liệu sản phẩm</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!productList || productList.length === 0) {
    return (
      <section className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Không có sản phẩm nào để hiển thị</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={drinksRef} className="py-24 px-6 bg-coffee-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-300/25 to-red-300/25 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6">
            ☕ Sản Phẩm Giá Tốt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm tuyệt vời với giá cả phải chăng tại Aurora Coffee
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Carousel Items */}
          <div className="overflow-hidden rounded-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {/* Split products into slides */}
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                    {productList
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((product: Product) => {
                        const emoji = getProductEmoji(product.product_category, product.product_type);
                        const gradient = getGradientClass(product.product_category, product.promo_yn);
                        
                        return (
                          <div
                            key={product.product_id}
                            className="drink-card coffee-card group relative overflow-hidden cursor-pointer transform-gpu transition-all duration-300"
                            onMouseEnter={(e) => handleCardHover(e.currentTarget, true)}
                            onMouseLeave={(e) => handleCardHover(e.currentTarget, false)}
                            style={{ transition: 'transform 0.3s ease' }}
                          >
                            {/* Gradient overlay */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                            
                            {/* Badges */}
                            <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
                              {product.promo_yn && (
                                <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                  <Zap className="w-3 h-3" />
                                  PROMO
                                </div>
                              )}
                              {product.new_product_yn && (
                                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                  NEW
                                </div>
                              )}
                            </div>

                            {/* Stock indicator */}
                            <div className="absolute top-4 left-4 z-20">
                              <div className="flex items-center gap-1 bg-white/80 backdrop-blur-sm rounded-full px-2 py-1 text-xs">
                                <Package className="w-3 h-3 text-green-600" />
                                <span className="text-green-600 font-medium">{product.stock}</span>
                              </div>
                            </div>

                            {/* Product content - same as before but shortened for carousel */}
                            <div className="relative p-6 text-center">
                              <div className="text-6xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                {product.product_image_cover ? (
                                  <img 
                                    src={product.product_image_cover} 
                                    alt={product.product}
                                    className="w-16 h-16 mx-auto object-cover rounded-full shadow-lg"
                                    onError={(e) => {
                                      const target = e.currentTarget as HTMLImageElement;
                                      const sibling = target.nextElementSibling as HTMLElement;
                                      target.style.display = 'none';
                                      if (sibling) sibling.style.display = 'block';
                                    }}
                                  />
                                ) : null}
                                <div className="text-6xl" style={{ display: product.product_image_cover ? 'none' : 'block' }}>
                                  {emoji}
                                </div>
                              </div>

                              <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                                {product.product}
                              </h3>

                              <div className="flex items-center justify-center gap-2 mb-3">
                                <span className="text-amber-600 font-bold text-xl">
                                  {formatCurrency(product.current_retail_price)}
                                </span>
                              </div>
                            </div>

                            {/* Quick actions */}
                            <div className="quick-actions absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 translate-y-2 transition-all duration-300">
                              <button
                                onClick={() => handleAddToCart(product)}
                                disabled={isLoading || product.stock === 0}
                                className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50"
                              >
                                {isLoading ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : product.stock === 0 ? (
                                  <span className="text-xs">Hết hàng</span>
                                ) : (
                                  <>
                                    <ShoppingCart className="w-4 h-4" />
                                    <span className="text-sm">Thêm vào giỏ</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-20"
              >
                <ChevronLeft className="w-10 h-10" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-16 h-16 bg-white/90 hover:bg-white text-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center z-20"
              >
                <ChevronRight className="w-10 h-10" />
              </button>
            </>
          )}
        </div>

        {/* Dots Indicator */}
        {totalSlides > 1 && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  currentSlide === index 
                    ? 'bg-amber-500 w-8' 
                    : 'bg-white/50 hover:bg-white/70'
                }`}
              />
            ))}
          </div>
        )}

        {/* View all products button */}
        <div className="text-center mt-16">
          <button className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            Xem Tất Cả Sản Phẩm →
          </button>
        </div>
      </div>
    </section>
  );
};

export default Drinks;