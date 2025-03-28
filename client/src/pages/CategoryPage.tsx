import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import GameGrid from '@/components/game/GameGrid';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Game, Category } from '@shared/schema';

export default function CategoryPage() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const categoryId = id === 'offers' || id === 'new-releases' || id === 'top-rated' ? id : parseInt(id);
  const [sortBy, setSortBy] = useState("default");

  // Fetch all games
  const { data: allGames = [], isLoading: isAllGamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  // Fetch categories for the category name
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  // Get games based on category type
  const getFilteredGames = () => {
    if (categoryId === 'offers') {
      return allGames.filter(game => game.discountedPrice !== null);
    } else if (categoryId === 'new-releases') {
      return allGames.filter(game => game.isNewRelease);
    } else if (categoryId === 'top-rated') {
      return allGames.filter(game => game.isTopRated);
    } else if (typeof categoryId === 'number') {
      return allGames.filter(game => game.categoryId === categoryId);
    }
    return [];
  };

  // Get sorted games
  const getSortedGames = () => {
    const filtered = getFilteredGames();
    
    switch (sortBy) {
      case "price-asc":
        return [...filtered].sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceA - priceB;
        });
      case "price-desc":
        return [...filtered].sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceB - priceA;
        });
      case "rating":
        return [...filtered].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
      case "title":
        return [...filtered].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return filtered;
    }
  };

  const getCategoryTitle = () => {
    if (categoryId === 'offers') {
      return "Ofertas";
    } else if (categoryId === 'new-releases') {
      return "Nuevos lanzamientos";
    } else if (categoryId === 'top-rated') {
      return "Mejor valorados";
    } else if (typeof categoryId === 'number') {
      const category = categories.find(cat => cat.id === categoryId);
      return category ? category.name : "Categoría";
    }
    return "Categoría";
  };

  // Redirect on invalid category
  useEffect(() => {
    const isValidCategory = 
      categoryId === 'offers' || 
      categoryId === 'new-releases' || 
      categoryId === 'top-rated' || 
      (typeof categoryId === 'number' && 
        !isNaN(categoryId) && 
        categories.some(cat => cat.id === categoryId));
    
    if (!isValidCategory && categories.length > 0) {
      setLocation('/not-found');
    }
  }, [categoryId, categories, setLocation]);

  // Get games
  const games = getSortedGames();
  const categoryTitle = getCategoryTitle();

  return (
    <div className="flex-1 px-4 py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="font-rajdhani font-bold text-3xl text-white mb-4 md:mb-0">{categoryTitle}</h1>
        
        <div className="flex items-center space-x-4 w-full md:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-primary-light border-gray-700 text-white w-full md:w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent className="bg-primary-light border-gray-700 text-white">
              <SelectItem value="default">Más relevante</SelectItem>
              <SelectItem value="price-asc">Precio: Menor a mayor</SelectItem>
              <SelectItem value="price-desc">Precio: Mayor a menor</SelectItem>
              <SelectItem value="rating">Mejor valorados</SelectItem>
              <SelectItem value="title">Título</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {isAllGamesLoading ? (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-accent border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-gray-400">Cargando juegos...</p>
        </div>
      ) : games.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {games.map(game => (
            <GameGrid 
              key={game.id} 
              games={[game]} 
              title="" 
              isLoading={false} 
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-primary-light rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">No se encontraron juegos</h2>
          <p className="text-gray-400 mb-6">No hay juegos disponibles en esta categoría actualmente.</p>
          <Button asChild className="bg-accent hover:bg-accent-hover">
            <a href="/">Volver al inicio</a>
          </Button>
        </div>
      )}
    </div>
  );
}
