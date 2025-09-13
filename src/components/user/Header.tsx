import React from 'react';
import { ShoppingBag, Search, Info } from 'lucide-react';
import { InfoModal } from './InfoModal';

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  cartItemsCount,
  onCartClick,
  searchTerm,
  onSearchChange
}) => {
  const [isInfoModalOpen, setIsInfoModalOpen] = React.useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <img 
                src="/stickermom LOGO.svg" 
                alt="StickerCo" 
                className="h-12 w-auto"
              />
            </div>

            <div className="flex-1 max-w-lg mx-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search sticker sheets..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsInfoModalOpen(true)}
                className="p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <Info className="w-6 h-6" />
              </button>
              
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
              >
                <ShoppingBag className="w-6 h-6" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <InfoModal 
        isOpen={isInfoModalOpen} 
        onClose={() => setIsInfoModalOpen(false)} 
      />
    </>
  );
};