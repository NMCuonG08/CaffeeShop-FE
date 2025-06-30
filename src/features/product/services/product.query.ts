import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import  apiClient  from '@/configs/apiClient'; // Assume you have apiClient setup

// Types based on API response
export interface Product {
  product_id: number;
  product_group: string;
  product_category: string;
  product_type: string;
  product: string;
  product_description: string;
  unit_of_measure?: string;
  current_wholesale_price: number;
  current_retail_price: number;
  tax_exempt_yn: boolean;
  promo_yn: boolean;
  new_product_yn: boolean;
  product_image_cover?: string;
  stock: number;
}

export interface ProductResponse {
  statusCode: number;
  message: string;
  data: {
    products: Product[];
    source: string;
    timestamp: string;
    count: number;
  };
}

// API functions
const fetchCheapestProducts = async (): Promise<Product[]> => {
  try {
    const response = await apiClient.get<ProductResponse>("/product/cheapest");
    
    if (response.data.statusCode === 200) {
      return response.data.data.products;
    } else {
      throw new Error(response.data.message || 'Failed to fetch products');
    }
  } catch (error) {
    console.error('Error fetching cheapest products:', error);
    throw error;
  }
};

// Query hooks
export const useCheapestProducts = () => {
  return useQuery({
    queryKey: ['products', 'cheapest'],
    queryFn: fetchCheapestProducts,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};

// Add to cart mutation (you might need to adjust based on your cart API)
export const useAddToCart = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ productId, quantity }: { 
      productId: number; 
      quantity: number; 
    }) => {
      const response = await apiClient.post('/cart/add', {
        product_id: productId,
        quantity: quantity
      });
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart queries
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (error) => {
      console.error('Add to cart failed:', error);
    }
  });
};