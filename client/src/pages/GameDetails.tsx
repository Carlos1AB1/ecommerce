import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useLocation } from 'wouter';
import { FaStar, FaStarHalfAlt, FaRegStar, FaShoppingCart } from 'react-icons/fa';
import { Game } from '@shared/schema';
import { CartContext } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

export default function GameDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const gameId = parseInt(id);
  const { addToCart } = useContext(CartContext);
  const { toast } = useToast();

  const { data: game, isLoading, error } = useQuery<Game>({
    queryKey: [`/api/games/${gameId}`],
    enabled: !isNaN(gameId),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['/api/categories'],
  });

  const { data: platforms = [] } = useQuery({
    queryKey: ['/api/platforms'],
  });

  if (isNaN(gameId)) {
    setLocation('/not-found');
    return null;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-white mb-2">Error</h2>
          <p className="text-gray-300">No se pudo cargar el juego. Por favor intenta de nuevo.</p>
          <Button
            onClick={() => setLocation('/')}
            variant="default"
            className="mt-4"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (game) {
      addToCart(game);
      toast({
        title: "Añadido al carrito",
        description: `${game.title} ha sido añadido a tu carrito`,
        duration: 3000,
      });
    }
  };

  // Render stars based on rating
  const renderRating = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<FaStar key={`full-${i}`} className="text-yellow-500" />);
    }
    
    if (halfStar) {
      stars.push(<FaStarHalfAlt key="half" className="text-yellow-500" />);
    }
    
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<FaRegStar key={`empty-${i}`} className="text-yellow-500" />);
    }
    
    return stars;
  };

  if (isLoading || !game) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Skeleton className="h-[400px] w-full rounded-lg" />
          <div>
            <Skeleton className="h-12 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/3 mb-4" />
            <Skeleton className="h-24 w-full mb-6" />
            <Skeleton className="h-10 w-1/4 mb-4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.id === game.categoryId);
  
  const gamePlatforms = Array.isArray(game.platforms) 
    ? game.platforms.map(id => platforms.find(p => p.id === id)?.name).filter(Boolean).join(', ')
    : '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <img 
            src={game.imageUrl} 
            alt={game.title} 
            className="w-full h-auto rounded-lg shadow-lg object-cover" 
          />
        </div>
        
        <div>
          <h1 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-2">{game.title}</h1>
          
          <div className="flex items-center mb-4">
            {game.rating && (
              <div className="flex items-center">
                {renderRating(game.rating)}
                <span className="ml-2 text-gray-300">{game.rating.toFixed(1)}</span>
              </div>
            )}
            {category && (
              <span className="ml-4 bg-accent text-white px-3 py-1 rounded-full text-sm">{category.name}</span>
            )}
          </div>
          
          <p className="text-gray-300 mb-6">{game.description}</p>
          
          <div className="mb-6">
            <div className="flex items-center mb-2">
              <span className="text-gray-400 w-24">Precio:</span>
              {game.discountedPrice ? (
                <div>
                  <span className="text-gray-400 line-through mr-2">€{game.price.toFixed(2)}</span>
                  <span className="text-highlight font-bold text-2xl">€{game.discountedPrice.toFixed(2)}</span>
                  <span className="ml-2 bg-highlight text-primary px-2 py-1 rounded text-xs font-bold">
                    {Math.round(((game.price - game.discountedPrice) / game.price) * 100)}% OFF
                  </span>
                </div>
              ) : (
                <span className="text-highlight font-bold text-2xl">€{game.price.toFixed(2)}</span>
              )}
            </div>
            
            {gamePlatforms && (
              <div className="flex items-center mb-2">
                <span className="text-gray-400 w-24">Plataformas:</span>
                <span className="text-white">{gamePlatforms}</span>
              </div>
            )}
            
            {game.releaseDate && (
              <div className="flex items-center mb-2">
                <span className="text-gray-400 w-24">Lanzamiento:</span>
                <span className="text-white">{new Date(game.releaseDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          <Button
            onClick={handleAddToCart}
            className="w-full bg-accent hover:bg-accent-hover text-white py-4 rounded-lg font-medium flex items-center justify-center"
          >
            <FaShoppingCart className="mr-2" />
            Añadir al carrito
          </Button>
        </div>
      </div>
      
      {/* Game details tabs could go here */}
      <div className="mt-12 border-t border-gray-800 pt-8">
        <h2 className="font-rajdhani font-bold text-2xl text-white mb-4">Descripción</h2>
        <div className="prose prose-invert max-w-none">
          <p className="text-gray-300">{game.description}</p>
          {/* More detailed description would go here */}
          <p className="text-gray-300 mt-4">
            Explora un vasto mundo lleno de aventuras. Mejora tus habilidades, consigue nuevos equipos y 
            enfrenta a enemigos desafiantes en este épico juego.
          </p>
        </div>
      </div>
      
      {/* Related games could go here */}
    </div>
  );
}
