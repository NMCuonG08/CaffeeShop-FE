
import type { Product } from '@/features/product';

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
