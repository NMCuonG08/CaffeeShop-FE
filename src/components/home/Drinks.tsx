import React, { useRef, useEffect, useCallback, useState } from 'react';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Star, ShoppingCart, Heart, Plus, Minus, Zap, Award, Package } from 'lucide-react';
import { useCheapestProducts, type Product } from '@/features/product/services/product.query';
import { toast } from 'react-hot-toast';
import { useCart } from '@/features/cart/hooks/useCart';

gsap.registerPlugin(ScrollTrigger);

interface DrinksProps {
  hasAnimated: { drinks: boolean };
  setHasAnimated: React.Dispatch<React.SetStateAction<any>>;
}

const Drinks: React.FC<DrinksProps> = ({ hasAnimated, setHasAnimated }) => {
  const drinksRef = useRef<HTMLDivElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [quantity, setQuantity] = useState(1);
  
  const [isAdding, setIsAdding] = useState(false);
  // Queries
  const { data: products = [], isLoading, error, isError } = useCheapestProducts();
    const { addToCart, loading, getCartItemById } = useCart();
  

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount * 25000); // Convert to VND (assuming 1 USD = 25000 VND)
  };

  const getQuantity = (productId: number) => quantities[productId] || 1;

  const updateQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantities(prev => ({ ...prev, [productId]: newQuantity }));
    }
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
            imageUrl: product.product_image_cover,
            maxQuantity: 10 // hoặc từ product data
          }
        });
        
        toast.success(`Added ${quantity} ${product.product} to cart!`);
        setQuantity(1); // Reset quantity
      } catch (error) {
        toast.error('Failed to add product to cart');
        console.error('Add to cart error:', error);
      } finally {
        setIsAdding(false);
      }
  };

  const handleCardHover = useCallback((element: HTMLElement, isEnter: boolean, productId: number) => {
    gsap.killTweensOf(element);
    
    if (isEnter) {
      setHoveredCard(productId);
      // Giảm hiệu ứng chỉ còn scale nhẹ
      gsap.to(element, {
        scale: 1.02,
        duration: 0.3,
        ease: "power2.out"
      });
      
      // Chỉ animate quick actions, bỏ card details overlay
      const quickActions = element.querySelector('.quick-actions');
      
      if (quickActions) {
        gsap.to(quickActions, {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    } else {
      setHoveredCard(null);
      gsap.to(element, {
        scale: 1,
        duration: 0.3,
        ease: "power2.out"
      });
      
      const quickActions = element.querySelector('.quick-actions');
      
      if (quickActions) {
        gsap.to(quickActions, {
          opacity: 0,
          y: 10,
          duration: 0.2,
          ease: "power2.out"
        });
      }
    }
  }, []);

  useEffect(() => {
    ScrollTrigger.create({
      trigger: drinksRef.current,
      start: "top 80%",
      onEnter: () => {
        if (!hasAnimated.drinks && !isLoading && products.length > 0) {
          const drinkCards = drinksRef.current?.querySelectorAll('.drink-card') || [];
          gsap.fromTo(drinkCards,
            {
              y: 100,
              opacity: 0,
              scale: 0.8,
              rotationY: -45
            },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotationY: 0,
              duration: 1.2,
              stagger: 0.15,
              ease: "back.out(1.4)",
              onComplete: () => {
                setHasAnimated((prev: any) => ({ ...prev, drinks: true }));
              }
            }
          );
        }
      }
    });
  }, [hasAnimated, setHasAnimated, isLoading, products.length]);

  if (isLoading) {
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

  if (!products || products.length === 0) {
    return (
      <section className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-600">Không có sản phẩm nào để hiển thị</p>
        </div>
      </section>
    );
  }

  return (
    <section ref={drinksRef} className="py-24 px-6 bg-gradient-to-r from-amber-100 to-orange-100 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-40 h-40 bg-gradient-to-r from-amber-300/20 to-orange-300/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-orange-300/25 to-red-300/25 rounded-full blur-2xl animate-pulse" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-amber-700 to-orange-700 bg-clip-text text-transparent">
            ☕ Sản Phẩm Giá Tốt
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Khám phá những sản phẩm tuyệt vời với giá cả phải chăng tại Aurora Coffee
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product) => {
            const emoji = getProductEmoji(product.product_category, product.product_type);
            const gradient = getGradientClass(product.product_category, product.promo_yn);
            
            return (
              <div
                key={product.product_id}
                className="drink-card bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 group relative overflow-hidden cursor-pointer transform-gpu"
                onMouseEnter={(e) => handleCardHover(e.currentTarget, true, product.product_id)}
                onMouseLeave={(e) => handleCardHover(e.currentTarget, false, product.product_id)}
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

                {/* Product image/emoji */}
                <div className="relative p-8 text-center">
                  <div className="text-8xl mb-4 group-hover:scale-110 transition-transform duration-300 relative">
                    {product.product_image_cover ? (
                      <img 
                        src={product.product_image_cover} 
                        alt={product.product}
                        className="w-24 h-24 mx-auto object-cover rounded-full shadow-lg"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          e.currentTarget.nextElementSibling!.style.display = 'block';
                        }}
                      />
                    ) : null}
                    <div className="text-8xl" style={{ display: product.product_image_cover ? 'none' : 'block' }}>
                      {emoji}
                    </div>
                  </div>

                  {/* Product category */}
                  <div className="text-xs text-gray-500 mb-2 uppercase tracking-wide">
                    {product.product_category} • {product.product_type}
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {product.product}
                  </h3>

                  <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-2">
                    {product.product_description}
                  </p>

                  {/* Unit of measure */}
                  {product.unit_of_measure && (
                    <div className="text-xs text-amber-600 mb-2 font-medium">
                      Đơn vị: {product.unit_of_measure}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-center justify-center gap-2 mb-4">
                    <span className="text-amber-600 font-bold text-2xl group-hover:text-amber-700 transition-colors">
                      {formatCurrency(product.current_retail_price)}
                    </span>
                    {product.current_wholesale_price !== product.current_retail_price && (
                      <span className="text-gray-400 line-through text-sm">
                        {formatCurrency(product.current_wholesale_price)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick actions - Hiện ở bottom khi hover, không che nội dung */}
                <div className="quick-actions absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-white via-white/95 to-transparent opacity-0 translate-y-2 transition-all duration-300">
                  {/* Quantity selector */}
                  <div className="flex items-center justify-center gap-3 mb-3">
                    <button
                      onClick={() => updateQuantity(product.product_id, getQuantity(product.product_id) - 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={getQuantity(product.product_id) <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold">
                      {getQuantity(product.product_id)}
                    </span>
                    
                    <button
                      onClick={() => updateQuantity(product.product_id, getQuantity(product.product_id) + 1)}
                      className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                      disabled={getQuantity(product.product_id) >= Math.min(10, product.stock)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Action buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={isLoading || product.stock === 0}
                      className="flex-1 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : product.stock === 0 ? (
                        <span className="text-xs">Hết hàng</span>
                      ) : (
                        <>
                          <ShoppingCart className="w-4 h-4" />
                          <span className="text-xs">Thêm</span>
                        </>
                      )}
                    </button>
                    
                    <button className="w-10 h-10 bg-white/90 hover:bg-white text-red-500 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl">
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bỏ card details overlay hoặc chỉ hiện thông tin nhỏ ở góc */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="bg-black/70 backdrop-blur-sm text-white p-2 rounded-lg text-xs max-w-[150px]">
                    <p><span className="text-amber-400">Tồn kho:</span> {product.stock}</p>
                    {product.tax_exempt_yn && (
                      <p className="text-green-400">✓ Miễn thuế</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

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