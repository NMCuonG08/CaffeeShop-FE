import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import productReducer from '../features/product/slices/product.slice';
import productAdminReducer from '../features/admin/slices/product.admin.slice';
import authReducer from '../features/auth/slices/auth.slice';
import cartReducer from '../features/cart/slices/cart.slice';

// Cấu hình persist cho auth
const authPersistConfig = {
  key: 'auth',
  storage,
  whitelist: ['user', 'token', 'isAuthenticated'],
};

const cartPersistConfig = {
  key: 'cart',
  storage,
  whitelist: ['items', 'total', 'itemCount'], 
};

// Gộp reducers với persist riêng lẻ
const rootReducer = combineReducers({
  product: productReducer,
  adminProduct: productAdminReducer,
  auth: persistReducer(authPersistConfig, authReducer),
  cart: persistReducer(cartPersistConfig, cartReducer),
});

// Tạo store KHÔNG persist root
export const store = configureStore({
  reducer: rootReducer, // Không persist root
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;