import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload, Coffee, DollarSign, Package, Tag, FileText, Image as ImageIcon } from 'lucide-react';

// Zod validation schema theo AdminProduct interface
const productSchema = z.object({
  product: z.string().min(1, 'Product name is required').max(100, 'Name must be less than 100 characters'),
  product_description: z.string().min(10, 'Description must be at least 10 characters').max(500, 'Description must be less than 500 characters'),
  current_retail_price: z.number().min(0.01, 'Price must be greater than 0'),
  product_category: z.string().min(1, 'Category is required'),
  product_group: z.string().min(1, 'Product group is required'),
  product_type: z.string().optional(),
  unit_of_measure: z.string().optional(),
  current_wholesale_price: z.number().min(0, 'Wholesale price must be 0 or greater').optional(),
  tax_exempt_yn: z.boolean().default(false),
  promo_yn: z.boolean().default(false),
  new_product_yn: z.boolean().default(true),
});

type ProductFormData = z.infer<typeof productSchema>;

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData & { imageFile?: File }) => void;
  loading?: boolean;
}

const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  loading = false
}) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      product: '',
      product_description: '',
      current_retail_price: 0,
      product_category: '',
      product_group: '',
      product_type: '',
      unit_of_measure: '',
      current_wholesale_price: 0,
      tax_exempt_yn: false,
      promo_yn: false,
      new_product_yn: true,
    }
  });

  const categories = [
    'Coffee',
    'Tea',
    'Pastries',
    'Sandwiches',
    'Desserts',
    'Cold Drinks',
    'Hot Drinks',
    'Snacks'
  ];

  const productGroups = [
    'Beverages',
    'Food',
    'Desserts',
    'Snacks'
  ];

  const unitOfMeasure = [
    'pcs',
    'cup',
    'bottle',
    'kg',
    'g',
    'ml',
    'l'
  ];

  // Handle image change - store File object và preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: ProductFormData) => {
    // Pass both form data và file object
    onSubmit({
      ...data,
      imageFile: selectedFile || undefined
    });
  };

  const handleClose = () => {
    reset();
    setImagePreview(null);
    setSelectedFile(null);
    onClose();
  };

  // Handle drag and drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        
        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const triggerFileInput = () => {
    document.getElementById('image-upload')?.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-0">
      <div className="bg-white w-full h-full overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Coffee className="w-6 h-6 text-white" />
            <h2 className="text-xl font-bold text-white">Add New Product</h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto h-[calc(100vh-80px)]">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Product Info */}
              <div className="space-y-6">
                {/* Product Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Tag className="w-4 h-4" />
                    Product Name
                  </label>
                  <input
                    {...register('product')}
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    placeholder="Enter product name"
                  />
                  {errors.product && (
                    <p className="mt-1 text-sm text-red-600">{errors.product.message}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <FileText className="w-4 h-4" />
                    Description
                  </label>
                  <textarea
                    {...register('product_description')}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                    placeholder="Describe your product..."
                  />
                  {errors.product_description && (
                    <p className="mt-1 text-sm text-red-600">{errors.product_description.message}</p>
                  )}
                </div>

                {/* Product Group and Category */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4" />
                      Product Group
                    </label>
                    <select
                      {...register('product_group')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select a group</option>
                      {productGroups.map((group) => (
                        <option key={group} value={group}>
                          {group}
                        </option>
                      ))}
                    </select>
                    {errors.product_group && (
                      <p className="mt-1 text-sm text-red-600">{errors.product_group.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Coffee className="w-4 h-4" />
                      Category
                    </label>
                    <select
                      {...register('product_category')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.product_category && (
                      <p className="mt-1 text-sm text-red-600">{errors.product_category.message}</p>
                    )}
                  </div>
                </div>

                {/* Product Type and Unit */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Tag className="w-4 h-4" />
                      Product Type
                    </label>
                    <input
                      {...register('product_type')}
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="e.g., Hot, Cold, Large, Small"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Package className="w-4 h-4" />
                      Unit of Measure
                    </label>
                    <select
                      {...register('unit_of_measure')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                    >
                      <option value="">Select unit</option>
                      {unitOfMeasure.map((unit) => (
                        <option key={unit} value={unit}>
                          {unit}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Prices */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Retail Price (USD)
                    </label>
                    <input
                      {...register('current_retail_price', { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="0"
                    />
                    {errors.current_retail_price && (
                      <p className="mt-1 text-sm text-red-600">{errors.current_retail_price.message}</p>
                    )}
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <DollarSign className="w-4 h-4" />
                      Wholesale Price (USD)
                    </label>
                    <input
                      {...register('current_wholesale_price', { valueAsNumber: true })}
                      type="number"
                      step="0.1"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Checkboxes */}
                <div className="space-y-3">
                  <label className="flex items-center gap-3">
                    <input
                      {...register('new_product_yn')}
                      type="checkbox"
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🆕 New Product
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      {...register('promo_yn')}
                      type="checkbox"
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      🎯 Promotional Item
                    </span>
                  </label>

                  <label className="flex items-center gap-3">
                    <input
                      {...register('tax_exempt_yn')}
                      type="checkbox"
                      className="w-4 h-4 text-amber-600 border-gray-300 rounded focus:ring-amber-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      💰 Tax Exempt
                    </span>
                  </label>
                </div>
              </div>

              {/* Right Column - Image Upload */}
              <div className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="w-4 h-4" />
                    Product Image
                  </label>
                  
                  {/* Image Upload Area */}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-amber-400 transition-colors relative"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setSelectedFile(null);
                          }}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div 
                        className="text-center cursor-pointer"
                        onClick={triggerFileInput}
                      >
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-2">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-gray-500">
                          PNG, JPG up to 5MB
                        </p>
                      </div>
                    )}
                    
                    {/* Hidden file input */}
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </div>

                  {/* Upload button when image is selected */}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={triggerFileInput}
                      className="w-full mt-3 px-4 py-2 bg-amber-50 text-amber-700 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors text-sm font-medium"
                    >
                      Change Image
                    </button>
                  )}
                </div>

                {/* Product Preview Card */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Preview</h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="h-32 bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
                      {imagePreview ? (
                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Coffee className="w-8 h-8 text-amber-400" />
                      )}
                    </div>
                    <div className="p-3">
                      <h4 className="font-medium text-gray-900 truncate">
                        {watch('product') || 'Product Name'}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {watch('product_category') || 'Category'} • {watch('product_group') || 'Group'}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-lg font-bold text-amber-600">
                          {watch('current_retail_price') ? new Intl.NumberFormat('vi-VN', {
                            style: 'currency',
                            currency: 'VND'
                          }).format(watch('current_retail_price')) : '0 ₫'}
                        </p>
                        <div className="flex gap-1">
                          {watch('new_product_yn') && <span className="text-xs">🆕</span>}
                          {watch('promo_yn') && <span className="text-xs">🎯</span>}
                          {watch('tax_exempt_yn') && <span className="text-xs">💰</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </>
                ) : (
                  <>
                    <Coffee className="w-4 h-4" />
                    Add Product
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;