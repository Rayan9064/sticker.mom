import { useState } from 'react';
import { Header } from './components/user/Header';
import { ProductGrid } from './components/user/ProductGrid';
import { Cart } from './components/user/Cart';
import { Checkout } from './components/user/Checkout';
import { OrderConfirmation } from './components/user/OrderConfirmation';
import { ProductModal } from './components/user/ProductModal';
import { StickyFooter } from './components/user/StickyFooter';
import { useCart } from './hooks/useCart';
import { products } from './data/products';
import { generateOrderNumber } from './utils/orderNumber';

function UserApp() {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalItems,
    getTotalPrice
  } = useCart();

  const [searchTerm, setSearchTerm] = useState('');
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderConfirmationOpen, setIsOrderConfirmationOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [currentOrderNumber, setCurrentOrderNumber] = useState('');

  const handleAddToCart = (product: any) => {
    addToCart(product);
    // Brief feedback animation could be added here
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderComplete = () => {
    const orderNumber = generateOrderNumber();
    setCurrentOrderNumber(orderNumber);
    setIsCheckoutOpen(false);
    setIsOrderConfirmationOpen(true);
    clearCart();
  };

  const handleProductClick = (product: any) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleCloseOrderConfirmation = () => {
    setIsOrderConfirmationOpen(false);
    setCurrentOrderNumber('');
  };

  return (
    <div className="min-h-screen bg-white">
      <Header
        cartItemsCount={getTotalItems()}
        onCartClick={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <main className="max-w-5xl mx-auto px-8 sm:px-12 lg:px-16 py-12">
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          onProductClick={handleProductClick}
          searchTerm={searchTerm}
        />
      </main>

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeFromCart}
        onCheckout={handleCheckout}
        totalPrice={getTotalPrice()}
      />

      <Checkout
        isOpen={isCheckoutOpen}
        onClose={() => {
          setIsCheckoutOpen(false);
          setIsCartOpen(true);
        }}
        cartItems={cartItems}
        totalPrice={getTotalPrice()}
        onOrderComplete={handleOrderComplete}
      />

      <OrderConfirmation
        isOpen={isOrderConfirmationOpen}
        onClose={handleCloseOrderConfirmation}
        orderNumber={currentOrderNumber}
      />

      <ProductModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />

      <StickyFooter />
    </div>
  );
}

export default UserApp;