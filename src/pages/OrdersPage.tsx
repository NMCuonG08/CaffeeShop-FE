import React, {  useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck, MapPin } from 'lucide-react';
import ListOrders from '@/features/order/components/ListOrders';
import { OrderStatus } from '@/types/order.type';
import { useOrder } from '@/features/order/hooks/useOrder';

const OrdersPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  const { orderStats } = useOrder();
  
  // console.log('Order Stats:', orderStats);
  

  const tabs = [
    { 
      id: 'all', 
      label: 'Tất cả', 
      count: orderStats.ALL,
      icon: Package,
      color: 'text-gray-600 bg-gray-100'
    },
    { 
      id: OrderStatus.PENDING, 
      label: 'Chờ xác nhận', 
      count: orderStats.PENDING,
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-100'
    },
    { 
      id: OrderStatus.CONFIRMED, 
      label: 'Đã xác nhận', 
      count: orderStats.CONFIRMED,
      icon: CheckCircle,
      color: 'text-blue-600 bg-blue-100'
    },
    { 
      id: OrderStatus.PROCESSING, 
      label: 'Đang chuẩn bị', 
      count: orderStats.PROCESSING,
      icon: Package,
      color: 'text-purple-600 bg-purple-100'
    },
    { 
      id: OrderStatus.SHIPPING, 
      label: 'Đang giao', 
      count: orderStats.SHIPPING,
      icon: Truck,
      color: 'text-orange-600 bg-orange-100'
    },
    { 
      id: OrderStatus.DELIVERED, 
      label: 'Đã giao', 
      count: orderStats.DELIVERED,
      icon: MapPin,
      color: 'text-green-600 bg-green-100'
    },
    { 
      id: OrderStatus.CANCELLED, 
      label: 'Đã hủy', 
      count: orderStats.CANCELLED,
      icon: XCircle,
      color: 'text-red-600 bg-red-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Theo dõi và quản lý các đơn hàng của bạn</p>
        </div>

        {/* Status Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors
                    ${isActive 
                      ? 'border-blue-500 text-blue-600 bg-blue-50' 
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`
                      ml-2 px-2 py-1 text-xs rounded-full
                      ${isActive ? tab.color : 'bg-gray-100 text-gray-600'}
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Orders List */}
        <ListOrders activeStatus={activeTab} />
      </div>
    </div>
  );
};

export default OrdersPage;