import { useContext } from 'react';
import { Link } from 'wouter';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';
import { CartContext } from '@/context/CartContext';
import { Game } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface GameCardProps {
  game: Game;
}

export default function GameCard({ game }: GameCardProps) {
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart(game);
    toast({
      title: "Añadido al carrito",
      description: `${game.title} ha sido añadido a tu carrito`,
      duration: 3000,
    });
  };

  // Render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} />);
    }
    
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} />);
    }
    
    return stars;
  };

  const hasDiscount = !!game.discountedPrice;
  const discountPercentage = hasDiscount 
    ? Math.round(((game.price - game.discountedPrice!) / game.price) * 100) 
    : 0;

  return (
    <div className="game-card bg-primary-light rounded-lg overflow-hidden shadow-lg hover:transform hover:-translate-y-1 transition-all duration-300">
      <div className="relative">
        <Link href={`/game/${game.id}`}>
            <img 
              src={game.imageUrl} 
              alt={game.title} 
              className="w-full h-40 object-cover cursor-pointer" 
            />
        </Link>
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-highlight text-primary font-bold px-2 py-1 rounded text-xs">
            -{discountPercentage}%
          </div>
        )}
      </div>
      <div className="p-4">
        <Link href={`/game/${game.id}`}>
            <h3 className="font-rajdhani font-bold text-lg text-white mb-1 cursor-pointer">{game.title}</h3>
        </Link>
        <div className="flex text-yellow-500 text-sm mb-2">
          {game.rating ? (
            <>
              {renderRating(game.rating)}
              <span className="text-gray-400 ml-1">{game.rating.toFixed(1)}</span>
            </>
          ) : (
            <span className="text-gray-400">Sin valoración</span>
          )}
        </div>
        <div className="flex justify-between items-center mb-3">
          <div>
            {hasDiscount ? (
              <>
                <span className="text-gray-400 line-through text-sm">€{game.price.toFixed(2)}</span>
                <span className="text-highlight font-bold ml-1">€{game.discountedPrice!.toFixed(2)}</span>
              </>
            ) : (
              <span className="text-highlight font-bold">€{game.price.toFixed(2)}</span>
            )}
          </div>
          {game.platforms && (
            <span className="text-xs text-gray-400">
              {Array.isArray(game.platforms) && game.platforms.length > 0 
                ? `PC, PS5, XSX`  /* Simplified for display */
                : ""}
            </span>
          )}
        </div>
        <button 
          onClick={handleAddToCart}
          className="w-full bg-accent hover:bg-accent-hover text-white py-2 rounded font-medium transition-colors"
        >
          Añadir al carrito
        </button>
      </div>
    </div>
  );
}
