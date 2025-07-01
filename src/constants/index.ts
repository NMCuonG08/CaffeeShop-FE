// src/constants/index.ts

// Locale configurations
export const LOCALE_CONFIG = {
  VI_VN: 'vi-VN',
  EN_US: 'en-US',
  EN_UK: 'en-UK',
} as const;

// Currency configurations
export const CURRENCY_CONFIG = {
  VND: 'VND',
  USD: 'USD',
} as const;

// Number format configurations
export const NUMBER_FORMAT_CONFIG = {
  VND: {
    locale: LOCALE_CONFIG.VI_VN,
    currency: CURRENCY_CONFIG.VND,
  },
  USD: {
    locale: LOCALE_CONFIG.EN_UK,
    currency: CURRENCY_CONFIG.USD,
  },
} as const;

// Date format configurations
export const DATE_FORMAT_CONFIG = {
  FULL_VI: {
    locale: LOCALE_CONFIG.VI_VN,
    options: {
      year: 'numeric' as const,
      month: 'long' as const,
      day: 'numeric' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    },
  },
  SHORT_VI: {
    locale: LOCALE_CONFIG.VI_VN,
    options: {
      year: 'numeric' as const,
      month: '2-digit' as const,
      day: '2-digit' as const,
      hour: '2-digit' as const,
      minute: '2-digit' as const,
    },
  },
} as const;

// Business constants
export const BUSINESS_CONFIG = {
  // Rate conversion (if needed)
  VND_TO_USD_RATE: 25000,
  DEFAULT_SHIPPING_FEE: 30000,
} as const;

// Payment types
export const PAYMENT_TYPES = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  MOMO: 'MOMO',
} as const;

// Payment type labels
export const PAYMENT_TYPE_LABELS = {
  [PAYMENT_TYPES.COD]: 'Thanh toán khi nhận hàng',
  [PAYMENT_TYPES.VNPAY]: 'VNPay',
  [PAYMENT_TYPES.MOMO]: 'MoMo',
} as const;

// Order status (example - adjust based on your actual status)
export const ORDER_STATUS = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
} as const;

export type PaymentType = keyof typeof PAYMENT_TYPES;
export type OrderStatus = keyof typeof ORDER_STATUS;
