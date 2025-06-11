import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Search, Coffee } from 'lucide-react';
import { fetchAdminProducts, addProduct,updateProduct, deleteProduct } from '../slices/product.admin.slice';
import type { RootState, AppDispatch } from '@/store';
import ProductGrid from './ProductGrid';
import Pagination from './Pagination';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { Loading, showSuccess } from '@/components';
import type { Product } from '@/types';

const ListProduct = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error, totalProducts } = useSelector((state: RootState) => state.adminProduct);

  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit] = useState(8);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchAdminProducts({ page: currentPage, limit }));
  }, [dispatch, currentPage, limit]);

  const totalPages = Math.ceil((totalProducts || 0) / limit);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Safe products array
  const safeProducts = Array.isArray(products) ? products : [];

  // Filter products
  const filteredProducts = safeProducts.filter(product => {
    const productName = product?.name || product?.product || product?.product_name || '';
    return productName.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Event handlers
  const handleAddProduct = () => {
    setIsAddModalOpen(true);
  };

  const handleAddProductSubmit = async (data: Product) => {
    try {
      setAddLoading(true);

      const formData = new FormData();
      
      formData.append('product', data.product);
      formData.append('product_description', data.product_description);
      formData.append('current_retail_price', data.current_retail_price.toString());
      formData.append('product_category', data.product_category);
      formData.append('product_group', data.product_group);
      
      if (data.product_type) formData.append('product_type', data.product_type);
      if (data.unit_of_measure) formData.append('unit_of_measure', data.unit_of_measure);
      if (data.current_wholesale_price) formData.append('current_wholesale_price', data.current_wholesale_price.toString());
      
      formData.append('tax_exempt_yn', data.tax_exempt_yn.toString());
      formData.append('promo_yn', data.promo_yn.toString());
      formData.append('new_product_yn', data.new_product_yn.toString());
      
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }

      await dispatch(addProduct(formData)).unwrap();
      setIsAddModalOpen(false);
      dispatch(fetchAdminProducts({ page: currentPage, limit }));
      showSuccess('Product added successfully!');

    } catch (error) {
      console.error('Error adding product:', error);
    } finally {
      setAddLoading(false);
    }
  };

  // const handleViewProduct = (product: any) => {
  //   console.log('View product:', product);
  //   // TODO: Navigate to product detail page or open modal
  // };

  const handleEditProduct = (product: Product) => {
    
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  const handleEditProductSubmit = async (data: Product) => {
    try {
      setEditLoading(true);

      const formData = new FormData();
      
      const productId = data.product_id.toString();
      
      // formData.append('product_id', productId);
      
      // Add form fields
      formData.append('product', data.product);
      formData.append('product_description', data.product_description);
      formData.append('current_retail_price', data.current_retail_price.toString());
      formData.append('product_category', data.product_category);
      formData.append('product_group', data.product_group);
      
      if (data.product_type) formData.append('product_type', data.product_type);
      if (data.unit_of_measure) formData.append('unit_of_measure', data.unit_of_measure);
      if (data.current_wholesale_price) formData.append('current_wholesale_price', data.current_wholesale_price.toString());
      
      formData.append('tax_exempt_yn', data.tax_exempt_yn.toString());
      formData.append('promo_yn', data.promo_yn.toString());
      formData.append('new_product_yn', data.new_product_yn.toString());
      
      // Add image file if changed
      if (data.imageFile) {
        formData.append('image', data.imageFile);
      }
      console.log("pro Id" + productId)
      
      await dispatch(updateProduct({formData, productId})).unwrap();
      
      setIsEditModalOpen(false);
      setSelectedProduct(null);
      dispatch(fetchAdminProducts({ page: currentPage, limit }));
      showSuccess('Product updated successfully!');

    } catch (error) {
      console.error('Error editing product:', error);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteProduct = async (product_id: string) => {
    try {
        await dispatch(deleteProduct(product_id)).unwrap();
        dispatch(fetchAdminProducts({ page: currentPage, limit }));
        showSuccess('Product deleted successfully!');
    }
    catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  if(loading || addLoading || editLoading){
    return <Loading/>
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-red-800 font-medium">Error loading products</p>
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-xl p-6 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Coffee className="h-8 w-8" />
                <h1 className="text-3xl font-bold">Product Management</h1>
              </div>
              <p className="text-amber-100">Manage your coffee shop products and inventory</p>
              <div className="mt-3 flex items-center gap-4 text-sm">
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📦 {totalProducts || 0} Total Products
                </span>
                <span className="bg-white/20 px-3 py-1 rounded-full">
                  📄 Page {currentPage} of {totalPages}
                </span>
              </div>
            </div>
            <button
              onClick={handleAddProduct}
              className="bg-white text-amber-600 hover:bg-amber-50 px-6 py-3 rounded-xl flex items-center gap-2 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold"
            >
              <Plus size={20} />
              Add New Product
            </button>
          </div>
        </div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalProducts || 0}
          itemsPerPage={limit}
          onPageChange={handlePageChange}
        />

        {/* Search and Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-amber-100 p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-amber-400" size={20} />
              <input
                type="text"
                placeholder="Search products by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
              />
            </div>
            <div className="bg-amber-50 px-4 py-3 rounded-xl">
              <span className="text-amber-700 font-medium">
                {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
              </span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          searchTerm={searchTerm}
          onAddProduct={handleAddProduct}
          onViewProduct={handleViewProduct}
          onEditProduct={handleEditProduct}
          onDeleteProduct={handleDeleteProduct}
        />
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddProductSubmit}
        loading={addLoading}
      />

      {/* Edit Product Modal */}
      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleEditProductSubmit}
        loading={editLoading}
        product={selectedProduct}
      />
    </>
  );
};

export default ListProduct;