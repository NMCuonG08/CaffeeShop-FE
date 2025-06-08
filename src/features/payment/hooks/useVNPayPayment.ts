import { useState } from 'react';
import {type CreatePaymentUrlRequest } from '@/types';
import { createPaymentUrl as createURL } from '@/features/payment/services/vnpay.api';


export const useVNPayPayment = () => {
  const [isCreatingPayment, setIsCreatingPayment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createPaymentUrl = async (paymentData: CreatePaymentUrlRequest): Promise<string | null> => {
    setIsCreatingPayment(true);
    setError(null);

    try {
      const response = await createURL(paymentData);
      
      if (response.success && response.paymentUrl) {
        return response.paymentUrl;
      } else {
        throw new Error('Failed to create payment URL');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Có lỗi xảy ra khi tạo link thanh toán';
      setError(errorMessage);
      return null;
    } finally {
      setIsCreatingPayment(false);
    }
  };

  return {
    createPaymentUrl,
    isCreatingPayment,
    error,
  };
};