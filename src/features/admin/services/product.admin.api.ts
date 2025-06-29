
import type { Product } from '@/types/product.type';

import apiClient from '@/configs/apiClient';


export const getProducts = async (params): Promise<Product[]> => {
  const response = await apiClient.get("/product/list",{
    params:params
  } );
  
  if (!response.data?.data?.products) {
  throw new Error('Invalid API response structure');
}
  return {
    products: response.data.data.products,
    totalProducts: response.data.data.total || 0,
  }
};


export const updateProduct = async (formData: FormData,product_id: string) => {
  const response = await apiClient.patch(`/product/update/${product_id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  if (!response.data?.data?.product) {
    throw new Error('Invalid API response structure');
  }
  return response.data.data.product;
}

export const addProduct = async (formData: FormData) => {
  // GỬI TRỰC TIẾP FormData, KHÔNG wrap trong object
  const response = await apiClient.post("/product/add", formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  if (!response.data?.data?.product) {
    throw new Error('Invalid API response structure');
  }
  return response.data.data.product;
};

export const deleteProduct = async (productId: string) => {
  console.log("Deleting product with ID:", productId);
  const response = await apiClient.delete(`/product/delete/${productId}`);
  
  if (!response.data?.message) {
    throw new Error('Invalid API response structure');
  }
  
  return response.data.message;
}
