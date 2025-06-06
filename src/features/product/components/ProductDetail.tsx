import React, { useState } from 'react';
import { useProduct } from '@/features/product/hooks/useProduct';
import { useAuth } from '@/features/auth/hooks/useAuth';
import FeedBackList from '@/features/product/components/FeedBackList';
import { useParams } from 'react-router-dom';
import { 
  HeartIcon, 
  ShareIcon, 
  ShoppingCartIcon, 
  StarIcon,
  TruckIcon,
  ShieldCheckIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

export const ProductDetail = () => {
  const { productId } = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const productIdNumber = productId ? Number(productId) : 0;
  const { product, loading, error } = useProduct(productIdNumber);
  const { isAuthenticated, user } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600">{error.message || error.toString()}</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const renderStars = (rating: number, size = 'text-lg') => {
    return Array.from({ length: 5 }, (_, index) => (
      index < Math.round(rating) ? (
        <StarSolidIcon key={index} className={`${size} text-yellow-400`} />
      ) : (
        <StarIcon key={index} className={`${size} text-gray-300`} />
      )
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Product Section */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Image Section */}
            <div className="relative bg-gradient-to-br from-gray-100 to-gray-200 p-8">
              <div className="aspect-square">
                <img 
                  src={product.product_image_cover} 
                  alt={product.product} 
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>
              
              {/* Action Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                <button 
                  onClick={() => setIsFavorite(!isFavorite)}
                  className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200"
                >
                  {isFavorite ? (
                    <HeartSolidIcon className="w-6 h-6 text-red-500" />
                  ) : (
                    <HeartIcon className="w-6 h-6 text-gray-600" />
                  )}
                </button>
                <button className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all duration-200">
                  <ShareIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Promo Badge */}
              {product.promo_yn && (
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    🔥 PROMO
                  </span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full mb-4">
                  {product.product_category}
                </span>
                <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {product.product}
                </h1>
              </div>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex items-center gap-1">
                  {renderStars(product.averageRating || 0)}
                </div>
                <span className="text-gray-600 font-medium">
                  {product.averageRating || 0}/5
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">
                  {product.totalFeedbacks || 0} reviews
                </span>
              </div>

              {/* Price */}
              <div className="mb-8">
                <div className="flex items-baseline gap-4 mb-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    ${product.current_retail_price}
                  </span>
                  {product.current_wholesale_price && (
                    <span className="text-lg text-gray-500 line-through">
                      ${product.current_wholesale_price}
                    </span>
                  )}
                </div>
                <p className="text-green-600 font-medium">✓ Best price guaranteed</p>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.product_description}
                </p>
              </div>

              {/* Product Details */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Type</p>
                  <p className="font-semibold text-gray-900">{product.product_type}</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Group</p>
                  <p className="font-semibold text-gray-900">{product.product_group}</p>
                </div>
              </div>

              {/* Quantity & Add to Cart */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4">
                  <span className="font-medium text-gray-700">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      -
                    </button>
                    <span className="px-4 py-2 font-medium">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 hover:bg-gray-100 transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl transition-all duration-200 transform hover:scale-[1.02] shadow-lg flex items-center justify-center gap-3">
                  <ShoppingCartIcon className="w-6 h-6" />
                  Add to Cart
                </button>
              </div>

              {/* Trust Signals */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                <div className="flex items-center gap-3 text-gray-600">
                  <TruckIcon className="w-5 h-5 text-blue-600" />
                  <span className="text-sm">Free shipping over $50</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <ShieldCheckIcon className="w-5 h-5 text-green-600" />
                  <span className="text-sm">30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <FeedBackList 
          productId={productIdNumber}
          feedbacks={product.feedbacks || []}
          isAuthenticated={isAuthenticated}
          currentUser={user}
        />
      </div>
    </div>
  );
};

export default ProductDetail;