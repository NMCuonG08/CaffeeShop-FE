import React, { useState } from 'react';
import { useCart } from '@/features/cart/hooks/useCart';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '@/features/payment/components/OrderSummary';
import ShippingForm from '@/features/payment/components/ShippingForm';
import PaymentMethods from '@/features/payment/components/PaymentMethods';
import { type ShippingInfo, type PaymentMethod } from '@/features/payment/types/payment.type';
import { ArrowLeft } from 'lucide-react';
import { z } from 'zod';

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

  const handlePlaceOrder = async () => {
    // Clear previous errors
    setValidationErrors([]);

    // Validate payment method
    if (!selectedPayment) {
      setValidationErrors(['Vui lòng chọn phương thức thanh toán']);
      return;
    }

    // Validate shipping info
    if (!validateShippingInfo()) {
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create order data
      const orderData = {
        items,
        shippingInfo,
        paymentMethod: selectedPayment,
        subtotal: total,
        shippingFee,
        total: finalTotal,
        orderId: Date.now().toString(),
        createdAt: new Date()
      };

      // Store order data for success page
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
      
      // Clear cart and redirect to success page
      clearCart();
      navigate('/order-success');
    } catch (error) {
      console.error('Order failed:', error);
      setValidationErrors(['Đặt hàng thất bại. Vui lòng thử lại.']);
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
              isProcessing={isProcessing}
              selectedPayment={selectedPayment}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;