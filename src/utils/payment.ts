// src/utils/payment.ts
import { PAYMENT_TYPE_LABELS, PAYMENT_TYPES } from '@/constants';

export type PaymentType = keyof typeof PAYMENT_TYPES;

/**
 * Get payment type display label
 */
export const getPaymentTypeLabel = (paymentType: PaymentType): string => {
  return PAYMENT_TYPE_LABELS[paymentType] || paymentType;
};

/**
 * Check if payment type is valid
 */
export const isValidPaymentType = (paymentType: string): paymentType is PaymentType => {
  return Object.values(PAYMENT_TYPES).includes(paymentType as PaymentType);
};

/**
 * Get all available payment types
 */
export const getAvailablePaymentTypes = (): PaymentType[] => {
  return Object.keys(PAYMENT_TYPES) as PaymentType[];
};
