import React from 'react';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

interface OrderConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
}

export const OrderConfirmation: React.FC<OrderConfirmationProps> = ({
  isOpen,
  onClose,
  orderNumber
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
          <p className="text-gray-600">
            Thank you for your purchase. Your order has been successfully placed.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Package className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Order Number</span>
          </div>
          <p className="text-lg font-bold text-gray-900 font-mono">
            #{orderNumber}
          </p>
        </div>

        <div className="space-y-3 text-sm text-gray-600 mb-8">
          <p>• Order confirmation sent to your email</p>
          <p>• Processing time: 1-2 business days</p>
          <p>• Shipping: 3-5 business days</p>
        </div>

        <button
          onClick={onClose}
          className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};