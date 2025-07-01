import { useSelector, useDispatch } from 'react-redux';
import {type RootState,type AppDispatch } from '@/store';
import {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setDirectCheckoutItem,
 type AddToCartPayload,
 type CartItem,
} from '../slices/cart.slice';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector((state: RootState) => state.cart);

  const handleAddToCart = (payload: AddToCartPayload) => {
    dispatch(addToCart(payload));
  };

  const handleRemoveFromCart = (productId: string) => {
    dispatch(removeFromCart(productId));
  };

  const handleUpdateQuantity = (id: string, quantity: number) => {
    dispatch(updateQuantity({ id, quantity }));
  };

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  const handleSetDirectCheckout = (item: CartItem | null) => {
    dispatch(setDirectCheckoutItem(item));
  };

  const getCartItemById = (id: string) => {
    return cart.items.find(item => item.id === id);
  };

  const getTotalItems = () => {
    return cart.itemCount;
  };

  const getTotalPrice = () => {
    return cart.total;
  };

  return {
    // State
    items: cart.items,
    total: cart.total,
    itemCount: cart.itemCount,
    loading: cart.loading,
    error: cart.error,
    directCheckoutItem: cart.directCheckoutItem,
    
    // Actions
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    updateQuantity: handleUpdateQuantity,
    clearCart: handleClearCart,
    setDirectCheckout: handleSetDirectCheckout,
    
    // Utilities
    getCartItemById,
    getTotalItems,
    getTotalPrice,
  };
};