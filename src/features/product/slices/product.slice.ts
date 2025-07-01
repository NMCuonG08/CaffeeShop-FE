import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { type Product } from '@/types/product.type';
import * as productAPI from '@/features/product/services/product.api';

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
}

interface FetchProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
  search?: string;
  sortOrder?: 'asc' | 'desc';
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
}

// Interface for the API response
interface GetProductsResponse {
  products: Product[];
  totalProducts: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalProducts: 0,
};

// Async thunk to fetch products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: FetchProductsParams): Promise<GetProductsResponse> => {
    console.log('Fetching products with params:', params);
    const response = await productAPI.getProducts(params);
    return response;
  }
);

// Async thunk to fetch single product by ID
export const fetchProductById = createAsyncThunk(
  'product/fetchProductById',
  async (id: number): Promise<Product> => {
    console.log('Fetching product with ID:', id);
    const product = await productAPI.getProductById(id);
    return product;
  }
);

// Async thunk to search products
export const searchProducts = createAsyncThunk(
  'product/searchProducts',
  async ({ searchTerm, params }: { searchTerm: string; params?: FetchProductsParams }): Promise<GetProductsResponse> => {
    console.log('Searching products with term:', searchTerm, 'and params:', params);
    const response = await productAPI.searchProducts(searchTerm, params);
    return response;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Add product manually (can be used in the future)
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
    // Clear products
    clearProducts(state) {
      state.products = [];
      state.totalProducts = 0;
    },
    // Clear error
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      // Fetch products cases
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<GetProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      
      // Fetch single product cases
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = false;
        // Update existing product or add new one
        const existingIndex = state.products.findIndex(p => p.product_id === action.payload.product_id);
        if (existingIndex >= 0) {
          state.products[existingIndex] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch product';
      })
      
      // Search products cases
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action: PayloadAction<GetProductsResponse>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to search products';
      });
  },
});

export const { addProduct, clearProducts } = productSlice.actions;

export default productSlice.reducer;