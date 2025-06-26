import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useOrder } from '@/features/order/hooks/useOrder';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useCart } from '@/features/cart/hooks/useCart';
import { showSuccess, showError } from '@/components';

const VNPayCallbackPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { createOrder } = useOrder(user?.id);
  const { clearCart } = useCart();
  
  const [isProcessing, setIsProcessing] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | 'processing'>('processing');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasProcessed, setHasProcessed] = useState(false);

  useEffect(() => {
    // Prevent multiple executions
    if (hasProcessed) {
      console.log('VNPay callback already processed in this session, skipping...');
      return;
    }

    const processVNPayCallback = async () => {
      console.log('=== Starting VNPay Callback Processing ===');
      
      // Lấy transaction reference để tạo unique key
      const vnp_TxnRef = searchParams.get('vnp_TxnRef');
      const callbackKey = `vnpay_callback_${vnp_TxnRef}`;
      
      // Kiểm tra xem callback này đã được xử lý chưa (qua sessionStorage)
      const alreadyProcessed = sessionStorage.getItem(callbackKey);
      if (alreadyProcessed) {
        console.log(`VNPay callback với TxnRef ${vnp_TxnRef} đã được xử lý trước đó`);
        setHasProcessed(true);
        setIsProcessing(false);
        setPaymentStatus('success');
        
        // Redirect về trang success nếu có order ID
        const savedOrderId = sessionStorage.getItem(`order_id_${vnp_TxnRef}`);
        if (savedOrderId) {
          setTimeout(() => {
            navigate('/order-success', { state: { orderId: savedOrderId } });
          }, 1000);
        } else {
          navigate('/');
        }
        return;
      }
      
      // Đánh dấu callback này đang được xử lý
      sessionStorage.setItem(callbackKey, 'processing');
      setHasProcessed(true); // Mark as processing immediately
      
      try {
        // Lấy các tham số từ VNPay callback
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TxnRef = searchParams.get('vnp_TxnRef'); // Order ID
        const vnp_Amount = searchParams.get('vnp_Amount');
        const vnp_BankCode = searchParams.get('vnp_BankCode');
        const vnp_PayDate = searchParams.get('vnp_PayDate');

        console.log('VNPay callback params:', {
          vnp_ResponseCode,
          vnp_TxnRef,
          vnp_Amount,
          vnp_BankCode,
          vnp_PayDate
        });

        // Kiểm tra xem có phải từ VNPay callback không
        if (!vnp_ResponseCode || !vnp_TxnRef) {
          console.log('No VNPay params found, redirecting to home');
          setErrorMessage('Không tìm thấy thông tin thanh toán');
          setPaymentStatus('failed');
          return;
        }

        // Kiểm tra mã phản hồi từ VNPay
        if (vnp_ResponseCode === '00') {
          // Thanh toán thành công
          console.log('VNPay payment successful');
             // Lấy thông tin đơn hàng từ localStorage
        const pendingOrderData = localStorage.getItem('pendingOrder');
        console.log('Pending order data from localStorage:', pendingOrderData ? 'Found' : 'Not found');
        
        if (!pendingOrderData) {
          console.error('No pending order data found in localStorage');
          // Log all localStorage keys for debugging
          console.log('All localStorage keys:', Object.keys(localStorage));
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        const orderData = JSON.parse(pendingOrderData);
        console.log('Parsed order data:', orderData);
        
        // Kiểm tra xem order đã được tạo chưa
        if (orderData.backendOrderId) {
          console.log('Order already created with ID:', orderData.backendOrderId);
          // Order đã được tạo rồi, chỉ cần redirect
          localStorage.setItem('lastOrder', JSON.stringify({
            ...orderData,
            status: 'paid',
            paymentInfo: {
              vnp_ResponseCode,
              vnp_TxnRef,
              vnp_Amount,
              vnp_BankCode,
              vnp_PayDate,
              paymentMethod: 'VNPay'
            }
          }));
          localStorage.removeItem('pendingOrder');
          
          // Lưu thông tin callback đã xử lý thành công vào sessionStorage
          sessionStorage.setItem(callbackKey, 'completed');
          sessionStorage.setItem(`order_id_${vnp_TxnRef}`, orderData.backendOrderId);
          
          clearCart();
          setPaymentStatus('success');
          showSuccess('Thanh toán VNPay thành công!');
          setTimeout(() => navigate('/order-success'), 3000);
          return;
        }
          
          // Tạo order trong database
          console.log('Creating order after successful VNPay payment:', orderData.createOrderData);
          
          const orderResult = await createOrder(orderData.createOrderData);
          console.log('Order created successfully:', orderResult);

          // Cập nhật orderData với thông tin thanh toán và backend order ID
          const finalOrderData = {
            ...orderData,
            backendOrderId: orderResult?.createOrder?.id,
            status: 'paid',
            paymentInfo: {
              vnp_ResponseCode,
              vnp_TxnRef,
              vnp_Amount,
              vnp_BankCode,
              vnp_PayDate,
              paymentMethod: 'VNPay'
            }
          };

          // Lưu order thành công và xóa pending order
          localStorage.setItem('lastOrder', JSON.stringify(finalOrderData));
          localStorage.removeItem('pendingOrder');
          
          // Lưu thông tin callback đã xử lý thành công vào sessionStorage
          sessionStorage.setItem(callbackKey, 'completed');
          sessionStorage.setItem(`order_id_${vnp_TxnRef}`, orderResult?.createOrder?.id);
          
          // Clear cart
          clearCart();
          
          setPaymentStatus('success');
          showSuccess('Thanh toán VNPay thành công!');
          
          // Redirect sau 3 giây
          setTimeout(() => {
            navigate('/order-success');
          }, 3000);

        } else {
          // Thanh toán thất bại
          console.log('VNPay payment failed with code:', vnp_ResponseCode);
          
          const errorMessages: Record<string, string> = {
            '07': 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).',
            '09': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.',
            '10': 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần',
            '11': 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.',
            '12': 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.',
            '13': 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP).',
            '24': 'Giao dịch không thành công do: Khách hàng hủy giao dịch',
            '51': 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.',
            '65': 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.',
            '75': 'Ngân hàng thanh toán đang bảo trì.',
            '79': 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định.',
            '99': 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)'
          };

          const message = errorMessages[vnp_ResponseCode || '99'] || 'Giao dịch thất bại';
          setErrorMessage(message);
          setPaymentStatus('failed');
          showError('Thanh toán VNPay thất bại: ' + message);
          
          // Lưu thông tin callback đã xử lý thất bại vào sessionStorage
          sessionStorage.setItem(callbackKey, 'failed');
        }

      } catch (error) {
        console.error('Error processing VNPay callback:', error);
        setErrorMessage(error instanceof Error ? error.message : 'Có lỗi xảy ra khi xử lý thanh toán');
        setPaymentStatus('failed');
        showError('Có lỗi xảy ra khi xử lý thanh toán');
        
        // Lưu thông tin callback đã xử lý lỗi vào sessionStorage
        const vnp_TxnRef = searchParams.get('vnp_TxnRef');
        if (vnp_TxnRef) {
          const callbackKey = `vnpay_callback_${vnp_TxnRef}`;
          sessionStorage.setItem(callbackKey, 'error');
        }
      } finally {
        setIsProcessing(false);
      }
    };

    processVNPayCallback();
  }, [hasProcessed, searchParams, createOrder, clearCart, navigate]); // Bao gồm tất cả dependencies cần thiết

  const handleBackToHome = () => {
    navigate('/');
  };

  const handleRetryPayment = () => {
    navigate('/checkout');
  };

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="h-16 w-16 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Đang xử lý thanh toán...</h2>
          <p className="text-gray-600">Vui lòng không đóng trang này</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        {paymentStatus === 'success' ? (
          <>
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thành công!</h2>
            <p className="text-gray-600 mb-6">
              Đơn hàng của bạn đã được thanh toán thành công qua VNPay.
              Đang chuyển hướng đến trang chi tiết đơn hàng...
            </p>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/order-success')}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Xem đơn hàng
              </button>
              <button
                onClick={handleBackToHome}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </>
        ) : (
          <>
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Thanh toán thất bại!</h2>
            <p className="text-red-600 mb-6">{errorMessage}</p>
            <div className="flex space-x-4">
              <button
                onClick={handleRetryPayment}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Thử lại
              </button>
              <button
                onClick={handleBackToHome}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Về trang chủ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VNPayCallbackPage;
