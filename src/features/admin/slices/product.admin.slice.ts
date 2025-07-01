import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import * as productAPI from '@/features/admin/services/product.admin.api';

interface AdminProduct {
  product_id: number;
  product_group: string;
  product_category: string;
  product_type?: string;
  product?: string;
  product_description?: string;
  unit_of_measure?: string;
  current_wholesale_price?: number;
  current_retail_price?: number;
  tax_exempt_yn?: boolean;
  promo_yn?: boolean;
  new_product_yn?: boolean;
  product_image_cover?: string;
}

interface ProductState {
  products: AdminProduct[];
  loading: boolean;
  error: string | null;
  totalProducts: number;
  searchQuery: string;
}

interface FetchProductsParams {
  page?: number;
  limit?: number;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
  totalProducts: 0,
  searchQuery: '',
};

// Async thunk để gọi API lấy products
export const fetchAdminProducts = createAsyncThunk(
  'adminProduct/fetchAdminProducts',
  async (params: FetchProductsParams) => {
    console.log('Fetching products with params:', params);
    const products = await productAPI.getProducts(params);
    console.log('Fetched products:', products);
    return products;
  }
);

export const addProduct = createAsyncThunk(
  'adminProduct/addProduct',
  async  (formData: FormData) => {
    try {
      const newProduct = await productAPI.addProduct(formData);
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }
);

export const updateProduct = createAsyncThunk(
  'adminProduct/updateProduct',
  async ({ formData, productId }: { formData: FormData, productId: string }) => {
    console.log("Product ID:", productId);
    try {
      const response = await productAPI.updateProduct(formData, productId);
      return response;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }
);


export const deleteProduct = createAsyncThunk(
  'adminProduct/deleteProduct',
  async (productId: string) => {
    try {
      
      const response = await productAPI.deleteProduct(productId);
      console.log('Product deleted:', response);
      return response;
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }
)


const productSlice = createSlice({
  name: 'adminProduct',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || action.payload;
        state.totalProducts = action.payload.totalProducts || action.payload.products.length;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Fetch failed';
      })
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<AdminProduct>) => {
        state.loading = false;
        state.products.push(action.payload);
        state.totalProducts += 1;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Add product failed';
      })
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<AdminProduct>) => {
        state.loading = false;
        const index = state.products.findIndex(product => product.product_id === action.payload.product_id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      }
      )
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Update product failed';
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter(product => product.product_id !== action.payload);
        state.totalProducts -= 1;
      }
      )
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Delete product failed';
      }
      );
    
  },
});

export const { setSearchQuery } = productSlice.actions;

export default productSlice.reducer;