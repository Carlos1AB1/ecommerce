import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import GameCard from '@/components/game/GameCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FaSearch } from 'react-icons/fa';
import { useLocation } from 'wouter';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

export default function SearchPage() {
  const [location] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState("default");
  
  // Extract query parameter from URL
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const q = params.get('q');
    if (q) setSearchTerm(q);
  }, [location]);

  // Query games based on search term
  const { 
    data: searchResults = [], 
    isLoading,
    refetch
  } = useQuery<Game[]>({
    queryKey: [`/api/games/search?q=${encodeURIComponent(searchTerm)}`],
    enabled: searchTerm.length > 0,
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      refetch();
    }
  };

  // Get sorted games
  const getSortedGames = () => {
    switch (sortBy) {
      case "price-asc":
        return [...searchResults].sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceA - priceB;
        });
      case "price-desc":
        return [...searchResults].sort((a, b) => {
          const priceA = a.discountedPrice || a.price;
          const priceB = b.discountedPrice || b.price;
          return priceB - priceA;
        });
      case "rating":
        return [...searchResults].sort((a, b) => {
          const ratingA = a.rating || 0;
          const ratingB = b.rating || 0;
          return ratingB - ratingA;
        });
      case "title":
        return [...searchResults].sort((a, b) => 
          a.title.localeCompare(b.title)
        );
      default:
        return searchResults;
    }
  };

  const sortedGames = getSortedGames();

  // Render skeleton loaders
  const renderSkeletons = () => {
    return Array(4).fill(0).map((_, index) => (
      <div key={`skeleton-${index}`} className="bg-primary-light rounded-lg overflow-hidden shadow-lg">
        <Skeleton className="w-full h-40" />
        <div className="p-4">
          <Skeleton className="h-6 w-2/3 mb-2" />
          <Skeleton className="h-4 w-1/3 mb-3" />
          <Skeleton className="h-4 w-1/2 mb-3" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    ));
  };

  return (
    <div className="flex-1 px-4 py-6">
      <h1 className="font-rajdhani font-bold text-3xl text-white mb-6">Buscar juegos</h1>

      <div className="bg-primary-light rounded-lg p-6 mb-8">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <FaSearch className="absolute left-3 top-3 text-gray-500" />
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nombre de juego, género, etc."
              className="pl-10 bg-primary border-gray-700 text-white"
            />
          </div>
          <Button type="submit" className="bg-accent hover:bg-accent-hover">
            Buscar
          </Button>
        </form>
      </div>

      {searchTerm && (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h2 className="font-rajdhani font-semibold text-xl text-white mb-4 md:mb-0">
            {isLoading ? 'Buscando...' : 
              `Resultados para "${searchTerm}" (${sortedGames.length} ${sortedGames.length === 1 ? 'juego' : 'juegos'})`}
          </h2>
          
          {sortedGames.length > 0 && (
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
          )}
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {renderSkeletons()}
        </div>
      ) : searchTerm ? (
        sortedGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedGames.map(game => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-primary-light rounded-lg">
            <h2 className="text-xl font-bold text-white mb-2">No se encontraron resultados</h2>
            <p className="text-gray-400 mb-6">
              No encontramos juegos que coincidan con "{searchTerm}". 
              Intenta con otra búsqueda o explora nuestras categorías.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild className="bg-accent hover:bg-accent-hover">
                <a href="/">Ir al inicio</a>
              </Button>
              <Button asChild variant="outline" className="text-white border-gray-600">
                <a href="/category/new-releases">Ver novedades</a>
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-12 bg-primary-light rounded-lg">
          <h2 className="text-xl font-bold text-white mb-4">Busca tu próximo juego</h2>
          <p className="text-gray-400 mb-6">
            Introduce un término de búsqueda para encontrar juegos por título, categoría o características.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild className="bg-accent hover:bg-accent-hover">
              <a href="/category/offers">Ver ofertas</a>
            </Button>
            <Button asChild variant="outline" className="text-white border-gray-600">
              <a href="/category/top-rated">Juegos populares</a>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
