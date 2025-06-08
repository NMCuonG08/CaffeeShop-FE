export interface ShippingInfo {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  district: string;
  ward: string;
  notes?: string;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  shipping: ShippingInfo;
  paymentMethod: PaymentMethod;
  subtotal: number;
  shippingFee?: number;
  total: number;
  status?: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered';
  createdAt?: Date;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}