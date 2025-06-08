// features/product/productSlice.ts
import { createSlice, createAsyncThunk,type PayloadAction } from '@reduxjs/toolkit';
import {type Product } from '../../../types/product.type';
import * as productAPI from '../services/product.api';


interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  totalProducts: number | 0;
}

interface FetchProductsParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  category?: string;
}



const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalProducts: 0,

};

// Async thunk để gọi API lấy products
export const fetchProducts = createAsyncThunk(
  'product/fetchProducts',
  async (params: FetchProductsParams) => {
    console.log('Fetching products with params:', params);
    const products = await productAPI.getProducts(params);
    return products;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    // Ví dụ thêm product thủ công (có thể dùng trong tương lai)
    addProduct(state, action: PayloadAction<Product>) {
      state.products.push(action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.totalProducts;

      })
      // .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<number>) => {
      //   state.loading = false;
      //   state.totalProducts = action.payload;
      // })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch failed';
      });
  },
});

export const { addProduct } = productSlice.actions;

export default productSlice.reducer;
