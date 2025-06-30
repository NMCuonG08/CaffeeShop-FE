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
  const cartItem = getCartItemById(product.product_id?.toString() || '');
  const currentQuantityInCart = cartItem?.quantity || 0;
  
  // Check stock availability
  const isOutOfStock = product.stock === 0;
  const maxAvailableQuantity = product.stock || 999; // Default to 999 if stock not defined

  const handleAddToCart = async () => {
    if (isOutOfStock) {
      toast.error('Product is out of stock');
      return;
    }
    
    if (quantity > maxAvailableQuantity) {
      toast.error(`Only ${maxAvailableQuantity} items available in stock`);
      return;
    }
    
    setIsAdding(true);
    
    try {
      await addToCart({
        productId: product.product_id,
        quantity: quantity,
        productDetails: {
          name: product.product ?? "",
          price: product?.current_retail_price  ?? 0,
          imageUrl: product?.product_image_cover ?? "",
          maxQuantity: maxAvailableQuantity
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
    // Implementation for buy now functionality
    // You can add validation here similar to addToCart
    if (!product.product_id || !product.current_retail_price || !product.product) {
      toast.error('Product information is incomplete');
      return;
    }
    
    // Navigate to checkout or handle buy now logic
    console.log('Buy now clicked for product:', product.product_id);
  };

  // Early return if essential product data is missing
  if (!product.product_id || !product.product || !product.current_retail_price) {
    return (
      <div className="bg-gray-100 rounded-xl shadow-lg overflow-hidden h-full flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 text-center">Product information incomplete</p>
      </div>
    );
  }

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
        
        {/* Stock indicator */}
        {product.stock !== undefined && (
          <span className={`absolute bottom-2 left-2 text-white text-xs font-semibold px-2 py-1 rounded-full ${
            product.stock === 0 
              ? 'bg-red-500' 
              : product.stock <= 5 
                ? 'bg-orange-500' 
                : 'bg-green-500'
          }`}>
            {product.stock === 0 ? 'Out of Stock' : `${product.stock} left`}
          </span>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-2 text-xs text-gray-500">
          <span className="font-medium">{product.product_group || 'N/A'}</span>
          <span className="italic">{product.product_type || 'N/A'}</span>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.product}
        </h3>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-3 flex-grow line-clamp-3">
          {product.product_description || 'No description available'}
        </p>
        
        <div className="flex justify-between items-center mb-4 text-xs">
          <span className="bg-gray-100 px-2 py-1 rounded-md font-medium text-red-500">
            {product.unit_of_measure || 'N/A'}
          </span>
          <div className="flex items-center gap-2">
            {product.tax_exempt_yn && (
              <span className="text-green-600 font-medium">Tax Exempt</span>
            )}
            {product.stock !== undefined && (
              <span className={`px-2 py-1 rounded-md font-medium text-xs ${
                product.stock === 0 
                  ? 'bg-red-100 text-red-600' 
                  : product.stock <= 5 
                    ? 'bg-orange-100 text-orange-600' 
                    : 'bg-green-100 text-green-600'
              }`}>
                Stock: {product.stock}
              </span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg mb-4">
          {product.current_wholesale_price && (
            <div className="flex justify-between items-center mb-1">
              <span className="text-gray-600 text-sm">Wholesale:</span>
              <span className="text-gray-800 font-medium">
                ${product.current_wholesale_price}
              </span>
            </div>
          )}
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
              className="px-3 py-1 text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAdding || loading || isOutOfStock}
            >
              -
            </button>
            <span className="text-black px-4 py-1 border-x text-center min-w-[50px]">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(Math.min(maxAvailableQuantity, quantity + 1))}
              className="px-3 py-1 text-gray-800 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isAdding || loading || isOutOfStock || quantity >= maxAvailableQuantity}
            >
              +
            </button>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-2">
          <button 
            onClick={handleAddToCart}
            disabled={isAdding || loading || isOutOfStock}
            className={`w-full font-medium py-3 px-4 rounded-lg transition-colors duration-200 active:transform active:translate-y-px flex items-center justify-center ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white'
            }`}
          >
            {isOutOfStock ? (
              'Out of Stock'
            ) : isAdding || loading ? (
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
            disabled={isOutOfStock}
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors duration-200 ${
              isOutOfStock 
                ? 'bg-gray-400 cursor-not-allowed text-white' 
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            {isOutOfStock ? 'Out of Stock' : 'Buy Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;