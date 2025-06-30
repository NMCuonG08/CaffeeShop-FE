import type { Product } from './product.type';
import type { UserInfo } from './user-info.type';
import type { User } from './user.type';

export const PaymentType = {
  COD: 'COD',
  VNPAY: 'VNPAY',
  MOMO: 'MOMO'
} as const;

export type PaymentType = typeof PaymentType[keyof typeof PaymentType];

export const OrderStatus = {
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPING: 'SHIPPING',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED'
} as const;

export type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];

export interface OrderItem {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
  product?: Product;
}

export interface Order {
  id: number;
  createdAt: Date;
  totalAmount: number;
  status: string;
  userId?: number;
  userInfoId: number;
  paymentType: PaymentType;
  user?: User;
  userInfo: UserInfo;
  items?: OrderItem[];
}

// Add the missing OrderWithDetails interface
export interface OrderWithDetails extends Order {
  items: OrderItem[];
  user: User;
  userInfo: UserInfo;
}

// ...existing code...

export interface CreateOrderRequest {
  userId?: number;
  paymentType: PaymentType;
  items: CreateOrderItemRequest[];
  // notes?: string;
}

export interface CreateOrderItemRequest {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface UpdateOrderRequest {
  status?: string;
  paymentType?: PaymentType;
  userInfoId?: number;
  items?: UpdateOrderItemRequest[];
}

export interface UpdateOrderItemRequest {
  id?: number;
  productId: number;
  quantity: number;
  unitPrice?: number;
}

// API Response interfaces
export interface OrderResponse {
  success: boolean;
  data?: Order;
  message?: string;
  error?: string;
}

export interface OrderListResponse {
  success: boolean;
  data?: Order[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
  error?: string;
}

// Filter and search interfaces
export interface OrderFilters {
  status?: string;
  paymentType?: PaymentType;
  userId?: number;
  dateFrom?: Date;
  dateTo?: Date;
  minAmount?: number;
  maxAmount?: number;
  search?: string; // Search by order ID, user name, phone
}

export interface OrderSortOptions {
  field: 'createdAt' | 'totalAmount' | 'status';
  direction: 'asc' | 'desc';
}

// Component props interfaces
export interface OrderListProps {
  orders: OrderWithDetails[];
  loading?: boolean;
  error?: string;
  onStatusChange?: (orderId: number, newStatus: string) => void;
  onViewDetails?: (orderId: number) => void;
  onDelete?: (orderId: number) => void;
}

export interface OrderItemProps {
  order: OrderWithDetails;
  onStatusChange?: (orderId: number, newStatus: string) => void;
  onViewDetails?: (orderId: number) => void;
  onEdit?: (orderId: number) => void;
  onDelete?: (orderId: number) => void;
}

export interface CreateOrderFormProps {
  onSubmit: (orderData: CreateOrderRequest) => void;
  userInfoOptions: UserInfo[];
  productOptions: Product[];
  loading?: boolean;
  error?: string;
}

export interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'md' | 'lg';
}

export interface PaymentTypeBadgeProps {
  paymentType: PaymentType;
  size?: 'sm' | 'md' | 'lg';
}

// Utility interfaces
export interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  pendingOrders: number;
  completedOrders: number;
  cancelledOrders: number;
  averageOrderValue: number;
}

export interface OrderStatistics {
  byStatus: Record<string, number>;
  byPaymentType: Record<PaymentType, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    orderCount: number;
  }>;
}