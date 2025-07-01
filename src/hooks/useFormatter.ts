// src/hooks/useFormatter.ts
import { useCallback } from 'react';
import { formatCurrency, formatDate, formatDateShort, formatPrice, formatNumber } from '@/utils';

/**
 * Custom hook for formatting utilities
 * Provides memoized formatting functions
 */
export const useFormatter = () => {
  const currency = useCallback((amount: number) => formatCurrency(amount), []);
  const price = useCallback((amount: number) => formatPrice(amount), []);
  const date = useCallback((date: Date | string) => formatDate(date), []);
  const dateShort = useCallback((date: Date | string) => formatDateShort(date), []);
  const number = useCallback((amount: number, locale?: string) => formatNumber(amount, locale), []);

  return {
    currency,
    price,
    date,
    dateShort,
    number,
  };
};
