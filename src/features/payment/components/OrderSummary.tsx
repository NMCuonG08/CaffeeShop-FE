import React from 'react';
import {type CartItem,type PaymentMethod } from '../types/payment.type';
import { formatCurrency } from '@/utils/formatCurrency';

interface OrderSummaryProps {
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  onPlaceOrder: () => void;
  isProcessing: boolean;
  selectedPayment: PaymentMethod | null;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  subtotal,
  shippingFee,
  total,
  onPlaceOrder,
  isProcessing,
  selectedPayment
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
      
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
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
              </div>
            </div>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(item.price * item.quantity)}
            </span>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="space-y-2 border-t pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-900">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
        </div>
        <div className="flex justify-between text-lg font-semibold border-t pt-2">
          <span>Total</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>

      {/* Selected Payment Method */}
      {selectedPayment && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Payment Method:</p>
          <div className="flex items-center mt-1">
            <img src={selectedPayment.icon} alt={selectedPayment.name} className="h-6 w-6 mr-2" />
            <span className="font-medium">{selectedPayment.name}</span>
          </div>
        </div>
      )}

      {/* Place Order Button */}
      <button
        onClick={onPlaceOrder}
        disabled={isProcessing || !selectedPayment}
        className="w-full mt-6 bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : `Place Order - ${formatCurrency(total)}`}
      </button>
    </div>
  );
};

export default OrderSummary;