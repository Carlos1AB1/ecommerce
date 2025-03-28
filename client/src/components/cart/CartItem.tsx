import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';
import { FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { Link } from 'wouter';
import { CartItemWithGame } from '@shared/schema';

interface CartItemProps {
  item: CartItemWithGame;
}

export default function CartItem({ item }: CartItemProps) {
  const { updateCartItemQuantity, removeCartItem } = useContext(CartContext);
  const { game, quantity } = item;

  const handleUpdateQuantity = (newQuantity: number) => {
    if (newQuantity >= 1) {
      updateCartItemQuantity(item.id, newQuantity);
    }
  };

  const handleRemove = () => {
    removeCartItem(item.id);
  };

  const itemPrice = game.discountedPrice || game.price;
  const totalPrice = itemPrice * quantity;

  return (
    <div className="flex items-center space-x-3 border-b border-gray-700 pb-4">
      <Link href={`/game/${game.id}`}>
        <a>
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            className="w-16 h-16 object-cover rounded" 
          />
        </a>
      </Link>
      <div className="flex-1">
        <Link href={`/game/${game.id}`}>
          <a className="font-medium text-white hover:text-accent">{game.title}</a>
        </Link>
        <p className="text-sm text-gray-400">PC</p>
        <div className="flex justify-between items-center mt-1">
          <span className="text-highlight font-bold">€{totalPrice.toFixed(2)}</span>
          <div className="flex items-center space-x-2">
            <button 
              onClick={() => handleUpdateQuantity(quantity - 1)}
              className="text-gray-400 hover:text-white"
              aria-label="Decrease quantity"
            >
              <FaMinus />
            </button>
            <span className="text-gray-300">{quantity}</span>
            <button 
              onClick={() => handleUpdateQuantity(quantity + 1)}
              className="text-gray-400 hover:text-white"
              aria-label="Increase quantity"
            >
              <FaPlus />
            </button>
            <button 
              onClick={handleRemove}
              className="text-gray-400 hover:text-red-500 ml-2"
              aria-label="Remove item"
            >
              <FaTrash />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
