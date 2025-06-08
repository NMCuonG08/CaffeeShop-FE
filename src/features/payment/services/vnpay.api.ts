import {type CreatePaymentUrlRequest } from '@/types/payment.type';

import apiClient from '@/configs/apiClient';

export const createPaymentUrl = async (data: CreatePaymentUrlRequest) => {
  const response = await apiClient.post("vnpay/create-payment-url", data);

  const result = response.data; 
  const paymentData = result.data; 

  if (!paymentData.success) {
    throw new Error("Không thể tạo liên kết thanh toán.");
  }


  return paymentData;
};
