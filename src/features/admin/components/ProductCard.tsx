import React, { useState } from 'react';
import { Edit, Trash2, Coffee, Eye } from 'lucide-react';
import ConfirmDialog from '@/components/common/ConfirmDialog';

interface ProductCardProps {
  product: any;
  onView?: (product: any) => void;
  onEdit?: (product: any) => void;
  onDelete?: (product: any) => void;
  deleteLoading?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onView, 
  onEdit, 
  onDelete,
  deleteLoading = false
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Flexible property mapping
  const productId = product?.product_id || product?._id || product?.id;
  const productName = product?.name || product?.product || product?.product_name || 'Unnamed Product';
  const productDesc = product?.description || product?.product_description || 'No description available';
  const productPrice = product?.price || product?.current_retail_price || product?.current_wholesale_price || 0;
  const productCategory = product?.category || product?.product_category || product?.product_group || 'Uncategorized';
  const productImage = product?.image || product?.product_image_cover || '';
  const productStock = product?.stock || 0;
  const productActive = product?.isActive ?? product?.active ?? true;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-UK', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete?.(product.product_id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-amber-100 overflow-hidden hover:shadow-lg transition-all duration-200 group">
        {/* Product Image */}
        <div className="relative h-48 bg-gradient-to-br from-amber-50 to-orange-50">
          {productImage ? (
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/300x200/F59E0B/FFFFFF?text=Coffee+Product';
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 flex items-center justify-center">
              <Coffee className="w-12 h-12 text-amber-600" />
            </div>
          )}
          
          {/* Status Badge */}
          <div className="absolute top-3 right-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              productActive 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : 'bg-gray-100 text-gray-800 border border-gray-200'
            }`}>
              {productActive ? '🟢 Active' : '⚫ Inactive'}
            </span>
          </div>

          {/* Stock Badge */}
          <div className="absolute top-3 left-3">
            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
              productStock > 10 
                ? 'bg-green-100 text-green-800 border border-green-200' 
                : productStock > 0 
                ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                : 'bg-red-100 text-red-800 border border-red-200'
            }`}>
              📦 {productStock}
            </span>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4">
          <div className="mb-3">
            <h3 className="font-bold text-lg text-gray-900 mb-1 line-clamp-1">
              {productName}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2 mb-2">
              {productDesc}
            </p>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800 border border-amber-200">
              {productCategory}
            </span>
          </div>

          <div className="flex items-center justify-between mb-4">
            <span className="text-xl font-bold text-amber-600">
              {formatPrice(productPrice)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button 
              onClick={() => onView?.(product)}
              className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Eye size={14} />
              View
            </button>
            <button 
              onClick={() => onEdit?.(product)}
              className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors text-sm font-medium"
            >
              <Edit size={14} />
              Edit
            </button>
            <button 
              onClick={handleDeleteClick}
              className="bg-red-50 hover:bg-red-100 text-red-700 px-3 py-2 rounded-lg flex items-center justify-center transition-colors"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated data."
        confirmText="Delete Product"
        cancelText="Cancel"
        type="danger"
        loading={deleteLoading}
        item={productName}
      />
    </>
  );
};

export default ProductCard;