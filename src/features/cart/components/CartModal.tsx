import React, { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { X, Plus, Minus, Trash2, ShoppingBag, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<CartModalProps> = ({ isOpen, onClose }) => {
  const {
    items,
    total,
    itemCount,
    updateQuantity,
    removeFromCart,
    clearCart,
    loading
  } = useCart();
  const navigate = useNavigate();
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>({});

  if (!isOpen) return null;

  const handleQuantityChange = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(id);
    } else {
      updateQuantity(id, newQuantity);
    }
  };
  
  const handleCheckout = () => {
    navigate('/checkout');
    onClose();
  };

  const handleImageError = (itemId: string) => {
    setImageErrors(prev => ({ ...prev, [itemId]: true }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount * 25000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute right-0 top-0 h-full w-full max-w-sm bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="bg-amber-500 px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold flex items-center">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Giỏ Hàng ({itemCount})
              </h2>
              <button
                onClick={onClose}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full px-4">
                <div className="bg-amber-100 p-6 rounded-full mb-4">
                  <Coffee className="h-12 w-12 text-amber-500" />
                </div>
                <h3 className="text-lg font-medium text-gray-800 mb-2">Giỏ hàng trống</h3>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Thêm sản phẩm để bắt đầu mua sắm
                </p>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-amber-500 text-white text-sm rounded hover:bg-amber-600 transition-colors"
                >
                  Tiếp tục mua sắm
                </button>
              </div>
            ) : (
              <div className="p-3 space-y-3">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start space-x-3">
                      {/* Product Image */}
                      <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden border border-gray-200">
                        {!imageErrors[item.id] && item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                            onError={() => handleImageError(item.id)}
                          />
                        ) : (
                          <div className="h-full w-full bg-amber-100 flex items-center justify-center">
                            <Coffee className="h-6 w-6 text-amber-500" />
                          </div>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm font-medium text-gray-900 line-clamp-2">
                          {item.name}
                        </h3>
                        <p className="text-sm font-semibold text-amber-600 mt-1">
                          {formatCurrency(item.price)}
                        </p>
                        
                        {/* Controls */}
                        <div className="flex items-center justify-between mt-2">
                          {/* Quantity */}
                          <div className="flex items-center border border-gray-200 rounded">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="p-1 hover:bg-gray-50 transition-colors"
                              disabled={loading}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="px-2 py-1 text-xs font-medium min-w-[24px] text-center text-black">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="p-1 hover:bg-gray-50 transition-colors"
                              disabled={loading}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Total & Remove */}
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-semibold text-gray-800">
                              {formatCurrency(item.price * item.quantity)}
                            </span>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                              disabled={loading}
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t bg-gray-50 px-4 py-4">
              {/* Total */}
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-gray-600">Tổng ({itemCount} món):</span>
                <span className="text-lg font-bold text-amber-600">{formatCurrency(total)}</span>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white py-3 px-4 rounded-lg text-sm font-medium transition-colors"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Thanh toán'}
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg text-sm hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Xóa tất cả
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartModal;