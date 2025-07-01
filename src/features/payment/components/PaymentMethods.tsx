import React from 'react';
import {type PaymentMethod } from  '@/features/payment/types/payment.type';
import vnp from '@/assets/imgs/vnpay.png'
import momo from '@/assets/imgs/momo.png';
import cod from '@/assets/imgs/cod.png';


interface PaymentMethodsProps {
  selectedPayment: PaymentMethod | null;
  onSelect: (method: PaymentMethod) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ selectedPayment, onSelect }) => {
  const paymentMethods: PaymentMethod[] = [
    {
      id: 'vnpay',
      name: 'VNPay',
      icon: vnp,
      description: 'Pay securely with VNPay'
    },
    {
      id: 'momo',
      name: 'MoMo',
      icon: momo,
      description: 'Pay with MoMo e-wallet'
    },
    {
      id: 'cod',
      name: 'Cash on Delivery',
      icon: cod,
      description: 'Pay when you receive your order'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Method</h3>
      
      <div className="space-y-3">
        {paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`border rounded-lg p-4 cursor-pointer transition-colors ${
              selectedPayment?.id === method.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onSelect(method)}
          >
            <div className="flex items-center">
              <input
                type="radio"
                checked={selectedPayment?.id === method.id}
                onChange={() => onSelect(method)}
                className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
              />
              <img
                src={method.icon}
                alt={method.name}
                className="h-8 w-8 ml-3 mr-3"
                onError={(e) => {
                  e.currentTarget.src = '/icons/payment-default.png';
                }}
              />
              <div>
                <p className="font-medium text-gray-900">{method.name}</p>
                <p className="text-sm text-gray-600">{method.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentMethods;