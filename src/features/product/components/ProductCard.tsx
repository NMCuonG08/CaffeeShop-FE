import React, { useState } from 'react';
import { type Product } from '@/types/product.type';
import { useCart } from '@/features/cart/hooks/useCart';
import { toast } from 'react-hot-toast'; 
import { Link } from 'react-router-dom';
import { showSuccess } from '@/components';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  
  const { addToCart, loading, getCartItemById } = useCart();
  
  // Check if product already in cart
  const cartItem = getCartItemById(product.product_id.toString());
  const currentQuantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    try {
      await addToCart({
        productId: product.product_id,
        quantity: quantity,
        productDetails: {
          name: product.product,
          price: product.current_retail_price,
          imageUrl: product.product_image_cover,
          maxQuantity: 10 // hoặc từ product data
        }
      });
      
      showSuccess('Product added to cart successfully!');
      setQuantity(1); // Reset quantity
    } catch (error) {
      toast.error('Failed to add product to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {

   
    
    // Có thể dispatch setDirectCheckout action và navigate
    // hoặc pass qua router state
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link to={`/products/${product.product_id}`} className="block h-full">
        <img 
          src={product.product_image_cover || "https://dummyimage.com/150x150/cccccc/000000&text=Coffee"} 
          alt={product.product}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={(e) => {
            e.currentTarget.src = '/placeholder-image.png';
          }}
        />
        
        </Link>
        {product.new_product_yn && (
          <span className="absolute top-2 right-2 bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase">
            New
          </span>
        )}
        {product.promo_yn && (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-semibold px-2 py-1 rounded-full uppercase">
            Promo
          </span>
        )}
        
        {/* Badge hiển thị số lượng trong cart */}
        {currentQuantityInCart > 0 && (
          <span className="absolute bottom-2 right-2 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
            {currentQuantityInCart} in cart
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          <span className="font-medium">{product.product_group}</span>
          <span className="italic">{product.product_type}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.product}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-grow line-clamp-3">
          {product.product_description}
        </p>
        
        <div className="flex justify-between items-center mb-4 text-xs">
          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-red-500">
            {product.unit_of_measure}
          </span>
          {product.tax_exempt_yn && (
            <span className="text-green-600 font-medium">Tax Exempt</span>
          )}
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-gray-600 text-sm">Wholesale:</span>
            <span className="text-gray-800 font-medium">
              ${product.current_wholesale_price}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-sm">Retail:</span>
            <span className="text-gray-900 font-semibold text-lg">
              ${product.current_retail_price}
            </span>
          </div>
        </div>

        {/* Quantity selector */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center border rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-1 text-gray-800 hover:bg-gray-100 transition-colors"
              disabled={isAdding || loading}
            >
              -
            </button>
            <span className="text-black px-4 py-1 border-x text-center min-w-[50px]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-1 text-gray-800 hover:bg-gray-100 transition-colors"
              disabled={isAdding || loading}
            >
              +
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 active:transform active:translate-y-px flex items-center justify-center"
          >
            {isAdding || loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </>
            ) : (
              'Add to Cart'
            )}
          </button>
          
          <button 
            onClick={handleBuyNow}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;