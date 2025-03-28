import { useContext } from 'react';
import { Link } from 'wouter';
import { CartContext } from '@/context/CartContext';
import { Game } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

interface FeaturedGameProps {
  game: Game;
}

export default function FeaturedGame({ game }: FeaturedGameProps) {
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

  return (
    <div className="relative rounded-xl overflow-hidden h-80 mb-6">
      <div className="absolute z-10 inset-0 bg-gradient-to-r from-black to-transparent flex items-center">
        <div className="p-8">
          <h2 className="font-rajdhani font-bold text-4xl mb-2 text-white">{game.title}</h2>
          <p className="text-gray-300 mb-4 max-w-md">{game.description}</p>
          <div className="flex space-x-3 mb-4">
            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold">RPG</span>
            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold">Aventura</span>
            <span className="bg-accent px-3 py-1 rounded-full text-sm font-semibold">Espacio</span>
          </div>
          <div className="flex items-center mb-4">
            <div className="mr-4">
              {game.discountedPrice ? (
                <>
                  <span className="text-gray-400 line-through text-lg mr-2">€{game.price.toFixed(2)}</span>
                  <span className="text-highlight font-bold text-2xl">€{game.discountedPrice.toFixed(2)}</span>
                </>
              ) : (
                <span className="text-highlight font-bold text-2xl">€{game.price.toFixed(2)}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button 
                onClick={handleAddToCart}
                className="bg-accent hover:bg-accent-hover text-white py-2 px-6 rounded-lg font-medium flex items-center btn-glow transition-all"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                </svg>
                Añadir al carrito
              </button>
              <Link href={`/game/${game.id}`}>
                <a className="bg-transparent border border-accent text-white py-2 px-6 rounded-lg font-medium hover:bg-accent/10 transition-colors">
                  Ver detalles
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <img src={game.imageUrl} alt={game.title} className="w-full h-full object-cover" />
    </div>
  );
}
