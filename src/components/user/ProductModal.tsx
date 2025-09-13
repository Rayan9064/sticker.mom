import React from 'react';
import { X, Plus } from 'lucide-react';
import { Product } from '../../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart: (product: Product) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  onAddToCart
}) => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    if (!isOpen || !product || product.images.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
    }, 800);

    return () => clearInterval(interval);
  }, [isOpen, product]);

  React.useEffect(() => {
    if (isOpen) {
      setCurrentImageIndex(0);
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black/20 backdrop-blur-sm" 
        onClick={onClose} 
      />
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          
          <div className="p-6">
            {/* A5 Sticker Sheet Preview */}
            <div className="mb-6">
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center relative overflow-hidden">
                <div 
                  className="bg-white shadow-lg rounded-lg overflow-hidden"
                  style={{ 
                    width: '210px', 
                    height: '297px',
                    aspectRatio: '210/297'
                  }}
                >
                  <div className="h-full w-full relative">
                    <img
                      src={product.images[currentImageIndex]}
                      alt={`${product.name} A5 Sheet`}
                      className="w-full h-full object-cover filter grayscale transition-opacity duration-300"
                    />
                    
                    {/* Grid overlay to simulate sticker cuts */}
                    <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 gap-1 p-2">
                      {Array.from({ length: 24 }).map((_, index) => (
                        <div 
                          key={index}
                          className="border border-dashed border-gray-300 opacity-30"
                        />
                      ))}
                    </div>
                    
                    {/* A5 label */}
                    <div className="absolute bottom-2 right-2 bg-white/90 px-2 py-1 rounded text-xs font-medium text-gray-600">
                      A5 Sheet
                    </div>
                  </div>
                </div>
                
                {/* Image indicators */}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                    {product.images.map((_: string, index: number) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                          index === currentImageIndex ? 'bg-gray-600' : 'bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
              
              <p className="text-center text-sm text-gray-500 mt-4">
                A5 size (148 × 210 mm) with pre-cut edges for easy peeling
              </p>
            </div>

            {/* Product Details */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Category</h3>
                <span className="inline-block bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                  {product.category}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                  <p className="text-sm text-gray-500 mt-1">Per A5 sheet</p>
                </div>
                
                <button
                  onClick={handleAddToCart}
                  className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors duration-200"
                >
                  <Plus className="w-5 h-5" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};