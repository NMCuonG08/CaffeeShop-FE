// src/utils/formatCurrency.ts
import { 
  NUMBER_FORMAT_CONFIG, 
  DATE_FORMAT_CONFIG, 
  BUSINESS_CONFIG 
} from '@/constants';

/**
 * Format number as Vietnamese currency (VND)
 */
export const formatCurrency = (amount: number): string => {
  const { locale, currency } = NUMBER_FORMAT_CONFIG.VND;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount);
};

/**
 * Format number as US currency (USD)
 */
export const formatPrice = (price: number): string => {
  const { locale, currency } = NUMBER_FORMAT_CONFIG.USD;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(price);
};

/**
 * Convert VND to USD using business rate
 */
export const convertVNDToUSD = (amountVND: number): number => {
  return amountVND / BUSINESS_CONFIG.VND_TO_USD_RATE;
};

/**
 * Format VND amount as USD equivalent
 */
export const formatVNDAsUSD = (amountVND: number): string => {
  const usdAmount = convertVNDToUSD(amountVND);
  return formatPrice(usdAmount);
};

/**
 * Format date with full Vietnamese locale
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { locale, options } = DATE_FORMAT_CONFIG.FULL_VI;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format date with short Vietnamese locale
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const { locale, options } = DATE_FORMAT_CONFIG.SHORT_VI;
  return new Intl.DateTimeFormat(locale, options).format(dateObj);
};

/**
 * Format number without currency symbol
 */
export const formatNumber = (amount: number, locale: string = 'vi-VN'): string => {
  return new Intl.NumberFormat(locale).format(amount);
};