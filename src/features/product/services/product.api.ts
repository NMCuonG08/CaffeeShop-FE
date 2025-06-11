import type { Product } from '@/types';
import apiClient from '@/configs/apiClient';

// Define interface for API parameters
interface GetProductsParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// Define interface for API response
interface GetProductsResponse {
  products: Product[];
  totalProducts: number;
}

export const getProducts = async (params?: GetProductsParams): Promise<GetProductsResponse> => {
  const response = await apiClient.get("/product/list", {
    params: params
  });
  
  if (!response.data?.data?.products) {
    throw new Error('Invalid API response structure');
  }
  
  return {
    products: response.data.data.products,
    totalProducts: response.data.data.total || 0,
  };
};

export const getProductById = async (id: number): Promise<Product> => {
  const response = await apiClient.get(`/product/${id}`);
  
  if (!response.data?.data) {
    throw new Error('Product not found');
  }
  
  return response.data.data;
};

export const searchProducts = async (searchTerm: string, params?: GetProductsParams): Promise<GetProductsResponse> => {
  const response = await apiClient.get("/product/search", {
    params: {
      q: searchTerm,
      ...params
    }
  });
  
  if (!response.data?.data?.products) {
    throw new Error('Invalid API response structure');
  }
  
  return {
    products: response.data.data.products,
    totalProducts: response.data.data.total || 0,
  };
};

export const getProductCategories = async (): Promise<string[]> => {
  const response = await apiClient.get("/product/categories");
  
  if (!response.data?.data) {
    throw new Error('Invalid API response structure');
  }
  
  return response.data.data;
};