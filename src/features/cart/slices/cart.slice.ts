import { createSlice,type PayloadAction } from '@reduxjs/toolkit';

export interface CartItem {
  id: string;             
  name: string;            
  price: number;          
  quantity: number;        
  image?: string;                
}

export interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
  directCheckoutItem: CartItem | null; 
}

export interface AddToCartPayload {
  productId: number;
  quantity: number;
  productDetails: {
    name: string;
    price: number;
    imageUrl: string | null;
    maxQuantity?: number; 
  }
}

// Function để load cart từ localStorage
const loadCartFromLocalStorage = (): Partial<CartState> => {
  try {
    const savedCart = localStorage.getItem('persist:cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      
      // Parse nested JSON strings nếu có
      const items = parsedCart.items ? JSON.parse(parsedCart.items) : [];
      const total = parsedCart.total ? JSON.parse(parsedCart.total) : 0;
      const itemCount = parsedCart.itemCount ? JSON.parse(parsedCart.itemCount) : 0;
      
      return {
        items,
        total,
        itemCount,
      };
    }
  } catch (error) {
    console.error('Error loading cart from localStorage:', error);
  }
  
  return {
    items: [],
    total: 0,
    itemCount: 0,
  };
};

const savedCartData = loadCartFromLocalStorage();

const initialState: CartState = {
  items: savedCartData.items || [],
  total: savedCartData.total || 0,
  itemCount: savedCartData.itemCount || 0,
  loading: false,
  error: null,
  directCheckoutItem: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<AddToCartPayload>) => {
      const { productId, quantity, productDetails } = action.payload;
      const existingItem = state.items.find(item => item.id === productId.toString());

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        const maxQuantity = productDetails.maxQuantity || 999;
        existingItem.quantity = Math.min(newQuantity, maxQuantity);
      } else {
        const newItem: CartItem = {
          id: productId.toString(),
          name: productDetails.name,
          price: productDetails.price,
          quantity,
          image: productDetails.imageUrl || undefined,
        };
        state.items.push(newItem);
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action: PayloadAction<{ id: string; quantity: number }>) => {
      const { id, quantity } = action.payload;
      const item = state.items.find(item => item.id === id);
      
      if (item) {
        if (quantity <= 0) {
          state.items = state.items.filter(item => item.id !== id);
        } else {
          item.quantity = quantity;
        }
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      state.itemCount = 0;
      state.directCheckoutItem = null;
    },

    setDirectCheckoutItem: (state, action: PayloadAction<CartItem | null>) => {
      state.directCheckoutItem = action.payload;
    },

    loadCartFromStorage: (state) => {
      const savedData = loadCartFromLocalStorage();
      state.items = savedData.items || [];
      state.total = savedData.total || 0;
      state.itemCount = savedData.itemCount || 0;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },

    calculateTotals: (state) => {
      state.itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
      state.total = state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setDirectCheckoutItem,
  loadCartFromStorage,
  setLoading,
  setError,
  calculateTotals,
} = cartSlice.actions;

export default cartSlice.reducer;