export interface CreatePaymentUrlDto {
  orderId: string;
  amount: number;
  orderDescription: string;
  orderType: string;
  locale?: string;
  currCode?: string;
  clientIp: string;
  returnUrl?: string;
  cancelUrl?: string;
}

export type CreatePaymentUrlRequest = Omit<CreatePaymentUrlDto, 'clientIp'>;

export interface CreatePaymentUrlResponse {
  success: boolean;
  paymentUrl: string;
}