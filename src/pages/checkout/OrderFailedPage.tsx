import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { XCircleIcon, ArrowLeftIcon, HomeIcon } from '@heroicons/react/24/outline'

const OrderFailedPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [orderInfo, setOrderInfo] = useState({
    orderId: '',
    message: ''
  })

  useEffect(() => {
    const orderId = searchParams.get('orderId') || ''
    const message = searchParams.get('message') || 'Có lỗi xảy ra trong quá trình thanh toán'
    
    setOrderInfo({
      orderId,
      message: decodeURIComponent(message)
    })
  }, [searchParams])

  const handleGoHome = () => {
    navigate('/')
  }

  const handleGoBack = () => {
    navigate('/cart')
  }

  const handleRetryPayment = () => {
    if (orderInfo.orderId) {
      navigate(`/checkout/payment?orderId=${orderInfo.orderId}`)
    } else {
      navigate('/cart')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          {/* Icon thất bại */}
          <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-red-100 mb-6">
            <XCircleIcon className="h-12 w-12 text-red-600" />
          </div>
          
          {/* Tiêu đề */}
          <h2 className="text-3xl font-extrabold text-gray-900 mb-2">
            Thanh toán thất bại
          </h2>
          
          {/* Thông báo lỗi */}
          <p className="text-lg text-gray-600 mb-6">
            {orderInfo.message}
          </p>
          
          {/* Thông tin đơn hàng */}
          {orderInfo.orderId && (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
              <p className="text-sm text-gray-500 mb-1">Mã đơn hàng:</p>
              <p className="text-lg font-semibold text-gray-900">
                #{orderInfo.orderId}
              </p>
            </div>
          )}
          
          {/* Hướng dẫn */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Đơn hàng của bạn chưa được thanh toán. 
              Bạn có thể thử lại thanh toán hoặc liên hệ hỗ trợ nếu cần thiết.
            </p>
          </div>
          
          {/* Các nút hành động */}
          <div className="space-y-3">
            {/* Nút thử lại thanh toán */}
            <button
              onClick={handleRetryPayment}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              Thử lại thanh toán
            </button>
            
            {/* Nút quay lại giỏ hàng */}
            <button
              onClick={handleGoBack}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2" />
              Quay lại giỏ hàng
            </button>
            
            {/* Nút về trang chủ */}
            <button
              onClick={handleGoHome}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out"
            >
              <HomeIcon className="h-4 w-4 mr-2" />
              Về trang chủ
            </button>
          </div>
          
          {/* Liên hệ hỗ trợ */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Cần hỗ trợ? Liên hệ với chúng tôi qua{' '}
              <a href="tel:+84123456789" className="text-red-600 hover:text-red-700 font-medium">
                hotline: 0123 456 789
              </a>
              {' '}hoặc{' '}
              <a href="mailto:support@cafeshop.com" className="text-red-600 hover:text-red-700 font-medium">
                email hỗ trợ
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OrderFailedPage