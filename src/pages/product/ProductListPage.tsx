import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { fetchProducts } from '@/features/product';
import ProductCard from '@/features/product/components/ProductCard';
import { ChevronDownIcon, FunnelIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const ProductList: React.FC = () => {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);
  
  // Filter states
  const [filters, setFilters] = useState({
    category: searchParams.get('category') || '',
    priceRange: searchParams.get('priceRange') || '',
    sortBy: searchParams.get('sortBy') || '',
    search: searchParams.get('search') || ''
  });
  
  // Separate search input state for debouncing
  const [searchInput, setSearchInput] = useState(filters.search);
  const [showFilters, setShowFilters] = useState(false);
  
  const { products, loading, error, totalProducts } = useSelector((state) => state.product);
  const totalPages = Math.ceil(totalProducts / itemsPerPage);

  // Debounce search function
  const debounceSearch = useCallback(
    (searchTerm: string) => {
      const timeoutId = setTimeout(() => {
        handleFilterChange('search', searchTerm);
      }, 1000); // 1000ms delay

      return () => clearTimeout(timeoutId);
    },
    [filters]
  );

  // Handle search input change with debounce
  useEffect(() => {
    if (searchInput !== filters.search) {
      const cleanup = debounceSearch(searchInput);
      return cleanup;
    }
  }, [searchInput, debounceSearch]);

  // Sample categories - replace with actual categories from your API
  const categories = [
    { value: '', label: 'Tất cả danh mục' },
    { value: 'coffee', label: 'Cà phê' },
    { value: 'tea', label: 'Trà' },
    { value: 'juice', label: 'Nước ép' },
    { value: 'cake', label: 'Bánh ngọt' },
    { value: 'snack', label: 'Đồ ăn vặt' }
  ];

  const priceRanges = [
    { value: '', label: 'Tất cả mức giá' },
    { value: '0-2', label: 'Dưới 2$' },
    { value: '2-5', label: '2$ - 5$' },
    { value: '5-10', label: '5$ - 10$' },
    { value: '10-25', label: '10$ - 25$' },
    { value: '25-100000', label: 'Trên 25$' }
  ];

  const sortOptions = [
    { value: '', label: 'Mặc định' },
    { value: 'price_asc', label: 'Giá thấp đến cao' },
    { value: 'price_desc', label: 'Giá cao đến thấp' },
    { value: 'name_asc', label: 'Tên A-Z' },
    { value: 'name_desc', label: 'Tên Z-A' },
    { value: 'newest', label: 'Mới nhất' }
  ];

  useEffect(() => {
    const queryParams = {
      page: currentPage,
      limit: itemsPerPage,
      ...filters
    };
    
    // Remove empty filters
    Object.keys(queryParams).forEach(key => {
      if (!queryParams[key]) {
        delete queryParams[key];
      }
    });
    
    dispatch(fetchProducts(queryParams));
  }, [dispatch, currentPage, itemsPerPage, filters]);

  const handleFilterChange = (filterType: string, value: string) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    setCurrentPage(1);
    
    // Update URL
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([key, val]) => {
      if (val) {
        newSearchParams.set(key, val);
      }
    });
    setSearchParams(newSearchParams);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange('search', searchInput);
  };

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      priceRange: '',
      sortBy: '',
      search: ''
    };
    setFilters(clearedFilters);
    setSearchInput('');
    setCurrentPage(1);
    setSearchParams(new URLSearchParams());
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!totalPages || totalPages <= 1) return null;

    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Previous button
    pages.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        ‹ Trước
      </button>
    );

    // First page
    if (startPage > 1) {
      pages.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          1
        </button>
      );
      
      if (startPage > 2) {
        pages.push(
          <span key="dots1" className="px-3 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Page numbers
    for (let page = startPage; page <= endPage; page++) {
      pages.push(
        <button
          key={page}
          onClick={() => handlePageChange(page)}
          className={`px-3 py-2 mx-1 text-sm font-medium rounded-md ${
            currentPage === page
              ? 'text-white bg-blue-600 border-blue-600'
              : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      );
    }

    // Last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(
          <span key="dots2" className="px-3 py-2 mx-1 text-gray-500">
            ...
          </span>
        );
      }
      
      pages.push(
        <button
          key={totalPages}
          onClick={() => handlePageChange(totalPages)}
          className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          {totalPages}
        </button>
      );
    }

    // Next button
    pages.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 mx-1 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Sau ›
      </button>
    );

    return (
      <div className="flex justify-center items-center mt-8">
        <div className="flex items-center">
          {pages}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-64 text-gray-600">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
        <p>Đang tải sản phẩm...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-red-50 rounded-lg text-red-600">
        <h3 className="text-lg font-semibold mb-2">Có lỗi xảy ra</h3>
        <p className="mb-4">Lỗi: {error}</p>
        <button 
          onClick={() => dispatch(fetchProducts({ page: currentPage, limit: itemsPerPage }))}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        {/* Filter Toggle Button (Mobile) */}
        <div className="md:hidden p-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="flex items-center text-gray-700 font-medium">
              <FunnelIcon className="h-5 w-5 mr-2" />
              Bộ lọc
            </span>
            <ChevronDownIcon 
              className={`h-5 w-5 transform transition-transform ${showFilters ? 'rotate-180' : ''}`} 
            />
          </button>
        </div>

        {/* Filters */}
        <div className={`p-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tìm kiếm
              </label>
              <form onSubmit={handleSearchSubmit} className="relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={handleSearchInputChange}
                  placeholder="Tên sản phẩm..."
                  className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                >
                  <MagnifyingGlassIcon className="h-5 w-5" />
                </button>
              </form>
              {searchInput !== filters.search && (
                <p className="text-xs text-blue-600 mt-1">
                  Nhấn Enter hoặc đợi để tìm kiếm...
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Danh mục
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức giá
              </label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {priceRanges.map((range) => (
                  <option key={range.value} value={range.value}>
                    {range.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sắp xếp
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
              >
                Xóa bộ lọc
              </button>
            </div>
          </div>

          {/* Active Filters Display */}
          {(filters.category || filters.priceRange || filters.sortBy || filters.search) && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600">Đang lọc:</span>
                {filters.search && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Từ khóa: "{filters.search}"
                    <button
                      onClick={() => {
                        setSearchInput('');
                        handleFilterChange('search', '');
                      }}
                      className="ml-1 text-blue-600 hover:text-blue-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.category && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    {categories.find(c => c.value === filters.category)?.label}
                    <button
                      onClick={() => handleFilterChange('category', '')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.priceRange && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    {priceRanges.find(p => p.value === filters.priceRange)?.label}
                    <button
                      onClick={() => handleFilterChange('priceRange', '')}
                      className="ml-1 text-yellow-600 hover:text-yellow-800"
                    >
                      ×
                    </button>
                  </span>
                )}
                {filters.sortBy && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {sortOptions.find(s => s.value === filters.sortBy)?.label}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Danh sách sản phẩm</h2>
        <p className="text-gray-600">
          Trang {currentPage} / {totalPages || 1} - 
          Hiển thị {products.length} trong tổng số {totalProducts || 0} sản phẩm
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-lg">Không tìm thấy sản phẩm nào</p>
          {(filters.category || filters.priceRange || filters.sortBy || filters.search) && (
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              Xóa bộ lọc để xem tất cả sản phẩm
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.product_id} 
                product={product} 
              />
            ))}
          </div>
          
          {/* Pagination */}
          {renderPagination()}
          
          {/* Items per page info */}
          <div className="text-center mt-4 text-sm text-gray-500">
            <span>Hiển thị {itemsPerPage} sản phẩm mỗi trang</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProductList;