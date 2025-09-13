import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TermsModal: React.FC<TermsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyPress = () => {
      onClose();
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Terms of Service</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6 space-y-4 text-gray-700">
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">1. Acceptance of Terms</h3>
              <p>By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">2. Products and Services</h3>
              <p>We provide high-quality sticker sheets and related products. All product descriptions, pricing, and availability are subject to change without notice.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">3. Orders and Payment</h3>
              <p>All orders are subject to acceptance and availability. We reserve the right to refuse or cancel any order. Payment must be made in full before shipping.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">4. Shipping and Delivery</h3>
              <p>We will make every effort to deliver products within the estimated timeframe. However, delivery times are not guaranteed and may vary due to circumstances beyond our control.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">5. Returns and Refunds</h3>
              <p>Returns are accepted within 30 days of purchase for unused products in original condition. Refunds will be processed within 5-7 business days after receiving returned items.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">6. Limitation of Liability</h3>
              <p>Our liability is limited to the purchase price of the products. We are not liable for any indirect, incidental, or consequential damages.</p>
            </section>

            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">7. Changes to Terms</h3>
              <p>We reserve the right to modify these terms at any time. Changes will be effective immediately upon posting on this website.</p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};