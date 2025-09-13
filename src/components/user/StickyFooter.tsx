import React from 'react';
import { TermsModal } from './TermsModal';
import { PrivacyModal } from './PrivacyModal';

export const StickyFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isTermsModalOpen, setIsTermsModalOpen] = React.useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = React.useState(false);

  return (
    <>
      <footer className="bg-gray-50 border-t border-gray-200 py-12 mt-16">
        <div className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="md:col-span-1">
              <h3 className="text-xl font-bold mb-4 text-gray-900">Sticker MOM</h3>
              <p className="text-gray-600 text-sm mb-4">
                Premium quality stickers and designs for your creative needs.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Products</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Custom Orders</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About Us</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Shipping Info</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Returns</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-lg font-semibold mb-4 text-gray-900">Contact</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p> hello@stickermom.com</p>
                <p> +1 (555) 123-4567</p>
                <p> 123 Design Street</p>
                <p>Creative City, CC 12345</p>
              </div>
            </div>
          </div>

          {/* Bottom Footer */}
          <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-600 mb-4 md:mb-0">
               {currentYear} Sticker MOM. All rights reserved.
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <button
                onClick={() => setIsTermsModalOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
              >
                Terms of Service
              </button>
              <span className="text-gray-400">|</span>
              <button
                onClick={() => setIsPrivacyModalOpen(true)}
                className="text-gray-600 hover:text-gray-900 transition-colors focus:outline-none"
              >
                Privacy Policy
              </button>
            </div>
          </div>
        </div>
      </footer>

      <TermsModal 
        isOpen={isTermsModalOpen} 
        onClose={() => setIsTermsModalOpen(false)} 
      />
      
      <PrivacyModal 
        isOpen={isPrivacyModalOpen} 
        onClose={() => setIsPrivacyModalOpen(false)} 
      />
    </>
  );
};
