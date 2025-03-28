import { useContext } from 'react';
import { Link } from 'wouter';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { FaShoppingCart, FaArrowLeft } from 'react-icons/fa';

export default function Cart() {
  const { cartItems, updateCartItemQuantity, removeCartItem, getCartTotal, clearCart } = useContext(CartContext);
  
  const subtotal = getCartTotal();
  const tax = subtotal * 0.21; // 21% tax
  const total = subtotal + tax;
  
  if (cartItems.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Tu carrito</h1>
        <div className="bg-primary-light rounded-lg p-8 text-center">
          <FaShoppingCart className="text-gray-600 text-6xl mx-auto mb-4" />
          <h2 className="text-xl font-medium text-white mb-2">Tu carrito está vacío</h2>
          <p className="text-gray-400 mb-6">Añade algunos juegos increíbles para comenzar</p>
          <Link href="/">
            <Button className="bg-accent hover:bg-accent-hover text-white">
              Explorar juegos
            </Button>
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Tu carrito</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-primary-light rounded-lg overflow-hidden">
            <div className="p-4 bg-primary">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6 text-gray-300 font-medium">Producto</div>
                <div className="col-span-2 text-gray-300 font-medium text-center">Precio</div>
                <div className="col-span-2 text-gray-300 font-medium text-center">Cantidad</div>
                <div className="col-span-2 text-gray-300 font-medium text-right">Total</div>
              </div>
            </div>
            
            <div className="divide-y divide-gray-800">
              {cartItems.map(item => {
                const itemPrice = item.game.discountedPrice || item.game.price;
                const itemTotal = itemPrice * item.quantity;
                
                return (
                  <div key={item.id} className="p-4">
                    <div className="grid grid-cols-12 gap-4 items-center">
                      <div className="col-span-6">
                        <div className="flex items-center">
                          <Link href={`/game/${item.game.id}`}>
                            <a className="w-16 h-16 flex-shrink-0">
                              <img 
                                src={item.game.imageUrl} 
                                alt={item.game.title} 
                                className="w-full h-full object-cover rounded" 
                              />
                            </a>
                          </Link>
                          <div className="ml-4">
                            <Link href={`/game/${item.game.id}`}>
                              <a className="font-medium text-white hover:text-accent">{item.game.title}</a>
                            </Link>
                            <p className="text-gray-400 text-sm">PC</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-center">
                        {item.game.discountedPrice ? (
                          <div>
                            <span className="text-gray-400 line-through text-sm block">€{item.game.price.toFixed(2)}</span>
                            <span className="text-highlight font-medium">€{item.game.discountedPrice.toFixed(2)}</span>
                          </div>
                        ) : (
                          <span className="text-highlight font-medium">€{item.game.price.toFixed(2)}</span>
                        )}
                      </div>
                      
                      <div className="col-span-2">
                        <div className="flex items-center justify-center">
                          <button 
                            onClick={() => updateCartItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                          <span className="px-3 text-white">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartItemQuantity(item.id, item.quantity + 1)}
                            className="text-gray-400 hover:text-white"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      
                      <div className="col-span-2 text-right">
                        <div className="flex items-center justify-end">
                          <span className="text-highlight font-bold mr-3">€{itemTotal.toFixed(2)}</span>
                          <button 
                            onClick={() => removeCartItem(item.id)}
                            className="text-gray-400 hover:text-red-500"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="p-4 bg-primary flex justify-between">
              <Button 
                onClick={clearCart}
                variant="outline" 
                className="text-red-400 border-red-400 hover:bg-red-400/10"
              >
                Vaciar carrito
              </Button>
              <Link href="/">
                <Button variant="outline" className="flex items-center">
                  <FaArrowLeft className="mr-2" />
                  Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        <div className="md:col-span-1">
          <div className="bg-primary-light rounded-lg p-6">
            <h2 className="font-rajdhani font-bold text-xl text-white mb-4">Resumen del pedido</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-gray-300">Subtotal:</span>
                <span className="text-white font-medium">€{subtotal.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="text-gray-300">Impuestos (21%):</span>
                <span className="text-white font-medium">€{tax.toFixed(2)}</span>
              </div>
              
              <div className="border-t border-gray-800 pt-3 flex justify-between">
                <span className="text-white font-medium">Total:</span>
                <span className="text-highlight font-bold text-xl">€{total.toFixed(2)}</span>
              </div>
            </div>
            
            <Link href="/checkout">
              <Button className="w-full bg-accent hover:bg-accent-hover text-white py-3 rounded-lg font-medium">
                Proceder al pago
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
