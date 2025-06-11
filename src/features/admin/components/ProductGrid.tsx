import React from 'react';
import { Coffee, Plus } from 'lucide-react';
import ProductCard from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  loading: boolean;
  searchTerm: string;
  onAddProduct?: () => void;
  onViewProduct?: (product: Product) => void;
  onEditProduct?: (product: Product) => void;
  onDeleteProduct?: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
  searchTerm,
  onAddProduct,
  onViewProduct,
  onEditProduct,
  onDeleteProduct
}) => {
  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600 mb-4"></div>
        <p className="text-amber-700 font-medium">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-amber-100">
        <div className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Coffee className="w-12 h-12 text-amber-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">
          {searchTerm ? `No products match "${searchTerm}"` : 'No products available in your inventory'}
        </p>
        <button 
          onClick={onAddProduct}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-colors mx-auto font-semibold"
        >
          <Plus size={20} />
          Add Your First Product
        </button>
      </div>
    );
  }
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <ProductCard
          key={product?.product_id || index}
          product={product}
          onView={onViewProduct}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;