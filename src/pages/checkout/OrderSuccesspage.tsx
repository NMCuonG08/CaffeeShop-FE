import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate } from '@/utils';
import { CheckCircle, Package, Truck, Home, MapPin } from 'lucide-react';
import type { CartItem } from '@/features/cart/types/cart.type';
import type { PaymentMethod } from '@/features/payment/types/payment.type';
import type { ShippingInfo } from '@/features/payment/types/payment.type';

interface OrderData {
  items: CartItem[]; // Use CartItem instead of OrderItem
  shippingInfo: ShippingInfo; // Use ShippingInfo instead of UserInfo
  paymentMethod: PaymentMethod; // Use PaymentMethod instead of PaymentType
  subtotal: number;
  shippingFee: number;
  total: number;
  orderId: string;
  createdAt: string | Date;
  backendOrderId?: string | number;
}

const OrderSuccessPage: React.FC = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    const storedOrder = localStorage.getItem('lastOrder');
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        setOrderData(parsedOrder);
      } catch (error) {
        console.error('Error parsing order data:', error);
        navigate('/');
      }
    } else {
      // Redirect to home if no order data
      navigate('/');
    }
  }, [navigate]);

  // Remove duplicate utility functions - now using imported ones

  if (!orderData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Đặt hàng thành công!
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Cảm ơn bạn đã đặt hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất.
          </p>
          <p className="text-sm text-gray-500">
            Mã đơn hàng: <span className="font-mono font-semibold text-blue-600">#{orderData.orderId}</span>
          </p>
          {orderData.backendOrderId && (
            <p className="text-xs text-gray-400 mt-1">
              ID hệ thống: {orderData.backendOrderId}
            </p>
          )}
        </div>

        {/* Order Timeline */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Trạng thái đơn hàng</h2>
          <div className="flex items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-green-500 rounded-full">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 mt-2">Đã đặt hàng</span>
              <span className="text-xs text-gray-500 mt-1">
                {formatDate(orderData.createdAt)}
              </span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Package className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400 mt-2">Đang chuẩn bị</span>
              <span className="text-xs text-gray-400 mt-1">Dự kiến 1-2h</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Truck className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400 mt-2">Đang giao</span>
              <span className="text-xs text-gray-400 mt-1">30-60 phút</span>
            </div>
            <div className="flex-1 h-1 bg-gray-200 mx-4"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center w-10 h-10 bg-gray-200 rounded-full">
                <Home className="w-6 h-6 text-gray-400" />
              </div>
              <span className="text-sm font-medium text-gray-400 mt-2">Hoàn thành</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Chi tiết đơn hàng</h2>
            <div className="space-y-4">
              {orderData.items.map((item, index) => (
                <div key={item.id || index} className="flex items-center space-x-4">
                  <img
                    src={item.image || '/placeholder-image.png'}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.src = '/placeholder-image.png';
                    }}
                  />
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{item.name}</h3>
                    <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tạm tính:</span>
                <span>{formatCurrency(orderData.subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Phí giao hàng:</span>
                <span>{formatCurrency(orderData.shippingFee)}</span>
              </div>
              <div className="flex justify-between text-lg font-semibold border-t pt-2">
                <span>Tổng cộng:</span>
                <span className="text-blue-600">{formatCurrency(orderData.total)}</span>
              </div>
            </div>
          </div>

          {/* Shipping & Payment Info */}
          <div className="space-y-6">
            {/* Shipping Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-blue-600" />
                Thông tin giao hàng
              </h2>
              <div className="space-y-2 text-sm">
                <p><strong>Người nhận:</strong> {orderData.shippingInfo.fullName}</p>
                <p><strong>Số điện thoại:</strong> {orderData.shippingInfo.phone}</p>
                <p><strong>Email:</strong> {orderData.shippingInfo.email}</p>
                <p><strong>Địa chỉ:</strong> {orderData.shippingInfo.address}, {orderData.shippingInfo.ward}, {orderData.shippingInfo.district}, {orderData.shippingInfo.city}</p>
                {orderData.shippingInfo.notes && (
                  <p><strong>Ghi chú:</strong> {orderData.shippingInfo.notes}</p>
                )}
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Phương thức thanh toán</h2>
              <div className="flex items-center">
                <img 
                  src={orderData.paymentMethod.icon} 
                  alt={orderData.paymentMethod.name}
                  className="h-8 w-8 mr-3"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder-payment.png';
                  }}
                />
                <div>
                  <p className="font-medium">{orderData.paymentMethod.name}</p>
                  <p className="text-sm text-gray-500">{orderData.paymentMethod.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Tiếp tục mua sắm
          </button>
          <button
            onClick={() => navigate('/orders')}
            className="bg-gray-100 text-gray-700 px-8 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            Xem đơn hàng của tôi
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('lastOrder');
              navigate('/');
            }}
            className="bg-red-100 text-red-700 px-8 py-3 rounded-lg hover:bg-red-200 transition-colors font-medium"
          >
            Xóa đơn hàng này
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Cần hỗ trợ?</h3>
          <p className="text-blue-800 mb-4">
            Nếu bạn có bất kỳ câu hỏi nào về đơn hàng, vui lòng liên hệ với chúng tôi:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium text-blue-900">Hotline:</p>
              <p className="text-blue-800">1900 1234</p>
            </div>
            <div>
              <p className="font-medium text-blue-900">Email:</p>
              <p className="text-blue-800">support@cafeaurora.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;