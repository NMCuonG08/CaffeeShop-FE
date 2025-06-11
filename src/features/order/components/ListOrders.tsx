import React from 'react';
import { type Order} from '@/types';
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
  const mockOrders: Order[] = userOrders;

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-amber-200 border-t-amber-600"></div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-lg">
        <p className="font-medium">Lỗi khi tải đơn hàng: {error.message}</p>
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