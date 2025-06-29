import type { RootState } from '@/store';

export const selectProducts = (state: RootState) => state.product.products;
export const selectLoading = (state: RootState) => state.product.loading;
export const selectError = (state: RootState) => state.product.error;
