import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
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
        <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>

          <h2 className="text-xl font-semibold text-gray-900 mb-6">Information</h2>
          
          <div className="space-y-4 text-gray-700">
            <p className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Sticker sheets come in an A5 sheet with pre-cut edges for easy peeling</span>
            </p>
            
            <p className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>Orders can be managed through WhatsApp, hence kindly use your WhatsApp number when placing order</span>
            </p>
            
            <p className="flex items-start gap-2">
              <span className="text-gray-400 mt-1">•</span>
              <span>
                We'd love to get your feedback to improve our service delivery, kindly use this{' '}
                <a 
                  href="https://forms.gle/T9iAyknNSdWg8NFK6" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 underline font-medium"
                >
                  FORM
                </a>
                {' '}to let us know ^.^
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};