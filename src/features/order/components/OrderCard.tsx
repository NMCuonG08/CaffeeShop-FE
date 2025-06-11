import React, { useState } from 'react';
import  {type Order, OrderStatus, PaymentType } from '@/types/order.type';
import { ChevronDown, ChevronUp, Calendar, CreditCard, MapPin, Package } from 'lucide-react';

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getStatusConfig = (status: string) => {
    switch (status) {
      case OrderStatus.PENDING:
        return {
          label: 'Chờ xác nhận',
          color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
          dotColor: 'bg-yellow-400'
        };
      case OrderStatus.CONFIRMED:
        return {
          label: 'Đã xác nhận',
          color: 'bg-blue-100 text-blue-800 border-blue-200',
          dotColor: 'bg-blue-400'
        };
      case OrderStatus.PROCESSING:
        return {
          label: 'Đang chuẩn bị',
          color: 'bg-purple-100 text-purple-800 border-purple-200',
          dotColor: 'bg-purple-400'
        };
      case OrderStatus.SHIPPING:
        return {
          label: 'Đang giao hàng',
          color: 'bg-orange-100 text-orange-800 border-orange-200',
          dotColor: 'bg-orange-400'
        };
      case OrderStatus.DELIVERED:
        return {
          label: 'Đã giao hàng',
          color: 'bg-green-100 text-green-800 border-green-200',
          dotColor: 'bg-green-400'
        };
      case OrderStatus.CANCELLED:
        return {
          label: 'Đã hủy',
          color: 'bg-red-100 text-red-800 border-red-200',
          dotColor: 'bg-red-400'
        };
      default:
        return {
          label: status,
          color: 'bg-gray-100 text-gray-800 border-gray-200',
          dotColor: 'bg-gray-400'
        };
    }
  };

  const getPaymentTypeLabel = (paymentType: PaymentType) => {
    switch (paymentType) {
      case PaymentType.COD:
        return 'Thanh toán khi nhận hàng';
      case PaymentType.VNPAY:
        return 'VNPay';
      case PaymentType.MOMO:
        return 'MoMo';
      default:
        return paymentType;
    }
  };

  const statusConfig = getStatusConfig(order.status);
  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  
  const formatDate = (date: Date) => 
    new Intl.DateTimeFormat('vi-VN', { 
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Đơn hàng #{order.id}
            </h3>
            <span className={`
              inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border
              ${statusConfig.color}
            `}>
              <span className={`w-2 h-2 rounded-full mr-2 ${statusConfig.dotColor}`}></span>
              {statusConfig.label}
            </span>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-gray-900">
              {formatCurrency(order.totalAmount)}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(order.createdAt)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="h-4 w-4" />
            <span>{getPaymentTypeLabel(order.paymentType)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Package className="h-4 w-4" />
            <span>{order.items?.length || 0} sản phẩm</span>
          </div>
        </div>
      </div>

      {/* Items Preview */}
      <div className="p-6">
        {order.items && order.items.length > 0 && (
          <div className="flex items-center space-x-4 mb-4">
            {order.items.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center space-x-2">
                <img
                  src={item.product?.image || '/placeholder-product.jpg'}
                  alt={item.product?.name || 'Product'}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div>
                  <p className="font-medium text-gray-900 text-sm">
                    {item.product?.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {item.quantity}x {formatCurrency(item.unitPrice || 0)}
                  </p>
                </div>
              </div>
            ))}
            {order.items.length > 3 && (
              <div className="text-gray-500 text-sm">
                +{order.items.length - 3} sản phẩm khác
              </div>
            )}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-between w-full p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <span className="text-sm font-medium text-gray-700">
            {isExpanded ? 'Thu gọn' : 'Xem chi tiết'}
          </span>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-gray-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-gray-500" />
          )}
        </button>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="border-t border-gray-100 bg-gray-50">
          <div className="p-6 space-y-6">
            {/* Shipping Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Thông tin giao hàng
              </h4>
              <div className="bg-white p-4 rounded-lg space-y-2 text-sm">
                <p><span className="font-medium">Người nhận:</span> {order.userInfo.fullName}</p>
                <p><span className="font-medium">Số điện thoại:</span> {order.userInfo.phone}</p>
                <p><span className="font-medium">Địa chỉ:</span> {order.userInfo.address}, {order.userInfo.ward}, {order.userInfo.district}, {order.userInfo.city}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Chi tiết đơn hàng</h4>
              <div className="bg-white rounded-lg divide-y divide-gray-100">
                {order.items?.map((item) => (
                  <div key={item.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.product?.image || '/placeholder-product.jpg'}
                        alt={item.product?.name || 'Product'}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div>
                        <h5 className="font-medium text-gray-900">{item.product?.name}</h5>
                        <p className="text-gray-500 text-sm">Số lượng: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">
                        {formatCurrency((item.unitPrice || 0) * item.quantity)}
                      </p>
                      <p className="text-gray-500 text-sm">
                        {formatCurrency(item.unitPrice || 0)}/món
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {order.status === OrderStatus.PENDING && (
                <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm">
                  Hủy đơn hàng
                </button>
              )}
              {order.status === OrderStatus.DELIVERED && (
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                  Đặt lại
                </button>
              )}
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm">
                Liên hệ hỗ trợ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard;