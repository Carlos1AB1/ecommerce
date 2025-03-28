import { useContext, useEffect } from 'react';
import { Link } from 'wouter';
import { CartContext } from '@/context/CartContext';
import CartItem from './CartItem';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShoppingCart } from 'react-icons/fa';

export default function CartPanel() {
  const { cartItems, isCartOpen, toggleCartOpen, getCartTotal } = useContext(CartContext);
  
  // Close cart when pressing escape
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        toggleCartOpen();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isCartOpen, toggleCartOpen]);

  // Prevent scrolling when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCartOpen]);

  const subtotal = getCartTotal();
  const tax = subtotal * 0.21; // 21% tax
  const total = subtotal + tax;

  const panelVariants = {
    closed: { x: '100%' },
    open: { x: 0 }
  };

  const overlayVariants = {
    closed: { opacity: 0 },
    open: { opacity: 1 }
  };

  return (
    <>
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={overlayVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={toggleCartOpen}
          />
        )}
      </AnimatePresence>
      
      <motion.div
        initial="closed"
        animate={isCartOpen ? "open" : "closed"}
        variants={panelVariants}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed top-0 right-0 w-full sm:w-96 h-full bg-primary-light shadow-xl z-50 flex flex-col"
      >
        <div className="p-4 border-b border-gray-700 flex justify-between items-center">
          <h2 className="font-rajdhani font-bold text-xl text-white">Carrito de compra</h2>
          <button 
            onClick={toggleCartOpen} 
            className="text-gray-400 hover:text-white"
            aria-label="Cerrar carrito"
          >
            <FaTimes className="text-lg" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <FaShoppingCart className="text-gray-600 text-5xl mb-4" />
              <p className="text-gray-400 mb-2">Tu carrito está vacío</p>
              <p className="text-gray-500 text-sm mb-4">Añade algunos juegos increíbles para comenzar</p>
              <button 
                onClick={toggleCartOpen} 
                className="bg-accent hover:bg-accent-hover text-white py-2 px-6 rounded-lg font-medium"
              >
                Ver juegos
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className="p-4 bg-primary border-t border-gray-700">
            <div className="flex justify-between mb-2">
              <span className="text-gray-300">Subtotal:</span>
              <span className="text-white font-medium">€{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4">
              <span className="text-gray-300">Impuestos:</span>
              <span className="text-white font-medium">€{tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-4 text-lg">
              <span className="text-white font-medium">Total:</span>
              <span className="text-highlight font-bold">€{total.toFixed(2)}</span>
            </div>
            <Link href="/checkout">
              <a onClick={toggleCartOpen} className="block w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium mb-2 text-center">
                Proceder al pago
              </a>
            </Link>
            <button 
              onClick={toggleCartOpen}
              className="w-full bg-transparent border border-accent text-accent hover:bg-accent/10 py-2 rounded-lg font-medium"
            >
              Seguir comprando
            </button>
          </div>
        )}
      </motion.div>
    </>
  );
}
