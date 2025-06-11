import React, { useState } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '@/features/payment/components/OrderSummary';
import ShippingForm from '@/features/payment/components/ShippingForm';
import PaymentMethods from '@/features/payment/components/PaymentMethods';
import { type ShippingInfo, type PaymentMethod } from '@/features/payment/types/payment.type';
import { useVNPayPayment } from '@/features/payment/hooks/useVNPayPayment';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useOrder } from '@/features/order/hooks/useOrder';
import { useUserInfo } from '@/features/auth/hooks/useUserInfo';
import { showSuccess } from '@/components';

// Import schema để validate
const shippingSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^(0[3|5|7|8|9])+([0-9]{8})$/, 'Số điện thoại không hợp lệ'),
  city: z.string().min(1, 'Vui lòng chọn tỉnh/thành phố'),
  district: z.string().min(2, 'Quận/huyện phải có ít nhất 2 ký tự'),
  ward: z.string().min(2, 'Phường/xã phải có ít nhất 2 ký tự'),
  address: z.string().min(10, 'Địa chỉ phải có ít nhất 10 ký tự'),
  notes: z.string().optional()
});

const CheckoutPage: React.FC = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth(); // Lấy thêm user info
  const { createPaymentUrl, isCreatingPayment, error: paymentError } = useVNPayPayment();
  
  // Fix: Convert user.id to number if it's a string, or use undefined as fallback
  const userId = user?.id ? (typeof user.id === 'string' ? parseInt(user.id) : user.id) : undefined;
  
  // Lấy userInfo để check userInfoId
  const { userInfo, loading, updateUserInfo } = useUserInfo(userId);
  const { createOrder, creating } = useOrder();
  
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    notes: ''
  });
  
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const shippingFee = 30000; // 30,000 VND
  const finalTotal = total + shippingFee;

  const validateShippingInfo = () => {
    try {
      shippingSchema.parse(shippingInfo);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => err.message);
        setValidationErrors(errors);
        return false;
      }
      return false;
    }
  };

  const generateOrderId = () => {
    return `ORDER_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  const handlePlaceOrder = async () => {
    setValidationErrors([]);
    
    if (!isAuthenticated || !userId) {
      setValidationErrors(['Vui lòng đăng nhập để đặt hàng']);
      return;
    }
    
    if (!selectedPayment) {
      setValidationErrors(['Vui lòng chọn phương thức thanh toán']);
      return;
    }
    
    if (!validateShippingInfo()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = generateOrderId();

      // Nếu chưa có userInfo, tạo/cập nhật userInfo trước
      if (userInfo) {
        console.log('Creating/updating user info...');
        
        const userInfoData = {
          fullname: shippingInfo.fullName, // Use fullname to match UserInfo interface
          email: shippingInfo.email,
          phone: shippingInfo.phone,
          address: shippingInfo.address,
          city: shippingInfo.city,
          district: shippingInfo.district,
          ward: shippingInfo.ward,
        };

        await updateUserInfo(userInfoData);
      }

      // Tạo order data để gửi lên backend
      const createOrderData = {
        userId: userId, // Now properly typed as number
        paymentType: selectedPayment.id === 'vnpay' ? 'VNPAY' : 'COD',
        items: items.map(item => ({
          productId: parseInt(item.id),
          quantity: item.quantity,
          unitPrice: item.price
        })),
      };

      // Gọi API tạo order
      console.log('Creating order with data:', createOrderData);
      const orderResult = await createOrder(createOrderData);
      
      // Order data để lưu localStorage (UI purpose)
      const orderData = {
        items,
        shippingInfo,
        paymentMethod: selectedPayment,
        subtotal: total,
        shippingFee,
        total: finalTotal,
        orderId,
        createdAt: new Date(),
        backendOrderId: orderResult?.createOrder?.id // Lưu ID từ backend
      };

      localStorage.setItem('pendingOrder', JSON.stringify(orderData));

      if (selectedPayment?.id === 'vnpay') {
        // Handle VNPay payment
        const paymentData = {
          orderId,
          amount: finalTotal,
          orderDescription: `Thanh toán đơn hàng ${orderId}`,
          orderType: 'billpayment',
          locale: 'vn',
          currCode: 'VND'
        };

        const paymentUrl = await createPaymentUrl(paymentData);
        console.log('Payment URL:', paymentUrl);
        
        if (paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          throw new Error(paymentError || 'Không thể tạo link thanh toán VNPay');
        }
      } else {
        // Handle COD payment
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        localStorage.setItem('lastOrder', JSON.stringify(orderData));
        localStorage.removeItem('pendingOrder');
        clearCart();
        // navigate('/order-success');
        showSuccess('Đặt hàng thành công!');
      }
    } catch (error) {
      console.error('Order failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đặt hàng thất bại. Vui lòng thử lại.';
      setValidationErrors([errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Giỏ hàng của bạn đang trống</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tiếp tục mua sắm
          </button>
        </div>
      </div>
    );
  }

  if (loading || creating) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang tải...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Quay lại
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Thanh toán</h1>
        </div>

        {/* Validation Errors */}
        {validationErrors.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-red-800 font-medium mb-2">Vui lòng kiểm tra lại thông tin:</h3>
            <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            <ShippingForm 
              shippingInfo={shippingInfo}
              onChange={setShippingInfo}
            />
            <PaymentMethods
              selectedPayment={selectedPayment}
              onSelect={setSelectedPayment}
            />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <OrderSummary
              items={items}
              subtotal={total}
              shippingFee={shippingFee}
              total={finalTotal}
              onPlaceOrder={handlePlaceOrder}
              isProcessing={isProcessing || isCreatingPayment}
              selectedPayment={selectedPayment}
              shippingInfo={shippingInfo}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;