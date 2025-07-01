import React, { useState } from 'react';
import { type CartItem, type PaymentMethod, type ShippingInfo } from '@/features/payment/types';
import { formatCurrency } from '@/utils/formatCurrency';
import { useAuth } from '@/features/auth/hooks/useAuth';
import {  showError } from '@/components';
import { AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  selectedPayment: PaymentMethod | null;
  shippingInfo: ShippingInfo;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingFee,
  total,
  onPlaceOrder,
  isProcessing,
  selectedPayment,
  shippingInfo
}) => {
  const { isAuthenticated } = useAuth();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Validate shipping info
  const validateShippingInfo = () => {
    const requiredFields: (keyof ShippingInfo)[] = ['fullName', 'email', 'phone', 'address', 'city', 'district', 'ward'];
    const emptyFields = requiredFields.filter(field => !shippingInfo[field] || shippingInfo[field]!.trim() === '');
    return emptyFields;
  };

  const isShippingComplete = () => {
    return validateShippingInfo().length === 0;
  };

  const canPlaceOrder = () => {
    return isAuthenticated && selectedPayment && isShippingComplete() && !isProcessing;
  };

  const handlePlaceOrderClick = () => {
    if (!isAuthenticated) {
      showError('Vui lòng đăng nhập để đặt hàng');
      return;
    }

    if (!selectedPayment) {
      showError('Vui lòng chọn phương thức thanh toán');
      return;
    }

    const emptyFields = validateShippingInfo();
    if (emptyFields.length > 0) {
      showError(`Vui lòng điền đầy đủ thông tin: ${emptyFields.join(', ')}`);
      return;
    }

    setShowConfirmDialog(true);
  };

  const handleConfirmOrder = () => {
    setShowConfirmDialog(false);
    onPlaceOrder();
  };

  const getButtonText = () => {
    if (isProcessing) return 'Đang xử lý...';
    if (!isAuthenticated) return 'Đăng nhập để đặt hàng';
    if (!selectedPayment) return 'Chọn phương thức thanh toán';
    if (!isShippingComplete()) return 'Điền thông tin giao hàng';
    return `Đặt hàng - ${formatCurrency(total)}`;
  };

  const getButtonColor = () => {
    if (!canPlaceOrder()) return 'bg-gray-400 cursor-not-allowed';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tóm tắt đơn hàng</h3>
        
        {/* Items */}
        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image || '/placeholder-image.png'}
                  alt={item.name}
                  className="h-12 w-12 object-cover rounded"
                />
                <div>
                  <p className="text-sm font-medium text-gray-900 line-clamp-1">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                </div>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {formatCurrency(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Rest of the component remains the same... */}
        {/* Totals */}
        <div className="space-y-2 border-t pt-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="text-gray-900">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
          </div>
          <div className="flex justify-between text-lg font-semibold border-t pt-2">
            <span>Tổng cộng</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>

        {/* Order Status Checklist */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Trạng thái đặt hàng</h4>
          <div className="space-y-2">
            {/* Authentication Check */}
            <div className="flex items-center">
              {isAuthenticated ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={`text-sm ${isAuthenticated ? 'text-green-700' : 'text-red-700'}`}>
                Đăng nhập
              </span>
            </div>

            {/* Shipping Info Check */}
            <div className="flex items-center">
              {isShippingComplete() ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={`text-sm ${isShippingComplete() ? 'text-green-700' : 'text-red-700'}`}>
                Thông tin giao hàng
              </span>
            </div>

            {/* Payment Method Check */}
            <div className="flex items-center">
              {selectedPayment ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              ) : (
                <XCircle className="h-4 w-4 text-red-500 mr-2" />
              )}
              <span className={`text-sm ${selectedPayment ? 'text-green-700' : 'text-red-700'}`}>
                Phương thức thanh toán
              </span>
            </div>
          </div>
        </div>

        {/* Selected Payment Method */}
         {selectedPayment && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Phương thức thanh toán:</p>
          <div className="flex items-center mt-1">
            <img src={selectedPayment.icon} alt={selectedPayment.name} className="h-6 w-6 mr-2" />
            <span className="font-medium">{selectedPayment.name}</span>
          </div>
        </div>
      )}
        

        {/* Missing Info Warning */}
        {!canPlaceOrder() && isAuthenticated && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                {!selectedPayment && 'Vui lòng chọn phương thức thanh toán'}
                {!isShippingComplete() && selectedPayment && 'Vui lòng điền đầy đủ thông tin giao hàng'}
              </span>
            </div>
          </div>
        )}

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrderClick}
          disabled={!canPlaceOrder()}
          className={`w-full mt-6 text-white py-3 px-4 rounded-lg font-medium transition-colors ${getButtonColor()}`}
        >
          {getButtonText()}
        </button>

        {/* Additional Info */}
        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>Bằng cách đặt hàng, bạn đồng ý với điều khoản dịch vụ của chúng tôi</p>
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-yellow-500 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Xác nhận đặt hàng</h3>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Bạn có chắc chắn muốn đặt hàng với thông tin sau:
              </p>
              
              <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tổng tiền:</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Thanh toán:</span>
                  <span>{selectedPayment?.name}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Giao đến:</span>
                  <span className="text-right max-w-48 truncate">{shippingInfo.fullName}</span>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OrderSummary;