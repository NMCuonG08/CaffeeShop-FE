import React from 'react';
import { type Order, OrderStatus, PaymentType } from '@/types';
import OrderCard from './OrderCard';
import { Package } from 'lucide-react';
import { useOrder } from '../hooks/useOrder';

interface ListOrdersProps {
  activeStatus: string;
}

const ListOrders: React.FC<ListOrdersProps> = ({ activeStatus }) => {


  const {userOrders, loading, error} = useOrder();

  

  console.log('userOrders:', userOrders);

  // Mock data - sẽ thay bằng API call sau
  const mockOrders: Order[] = [
    {
      id: 1,
      createdAt: new Date('2024-12-01T10:30:00'),
      totalAmount: 250000,
      status: OrderStatus.PENDING,
      paymentType: PaymentType.COD,
      userInfo: {
        id: 1,
        fullName: 'Nguyễn Văn A',
        email: 'nguyenvana@gmail.com',
        phone: '0901234567',
        address: '123 Nguyễn Trãi',
        city: 'Hồ Chí Minh',
        district: 'Quận 1',
        ward: 'Phường Bến Nghé'
      },
      items: [
        {
          id: 1,
          orderId: 1,
          productId: 1,
          quantity: 2,
          unitPrice: 75000,
          product: {
            id: 1,
            name: 'Cà phê Americano',
            price: 75000,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop'
          }
        },
        {
          id: 2,
          orderId: 1,
          productId: 2,
          quantity: 1,
          unitPrice: 100000,
          product: {
            id: 2,
            name: 'Bánh croissant',
            price: 100000,
            image: 'https://images.unsplash.com/photo-1555507036-ab794f17bbc0?w=300&h=300&fit=crop'
          }
        }
      ]
    },
  ];

  // Filter orders based on active status
  const filteredOrders = activeStatus === 'all' 
    ? mockOrders 
    : mockOrders.filter(order => order.status === activeStatus);

  if (filteredOrders.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <div className="text-gray-400 mb-4">
          <Package className="h-16 w-16 mx-auto" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Chưa có đơn hàng nào
        </h3>
        <p className="text-gray-500">
          {activeStatus === 'all' 
            ? 'Bạn chưa có đơn hàng nào. Hãy đặt hàng ngay!' 
            : `Không có đơn hàng nào ở trạng thái này.`
          }
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredOrders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
};

export default ListOrders;