import { useQuery } from '@tanstack/react-query';
import FeaturedGame from '@/components/game/FeaturedGame';
import GameGrid from '@/components/game/GameGrid';
import Newsletter from '@/components/newsletter/Newsletter';
import { Game } from '@shared/schema';

export default function Home() {
  // Fetch featured games
  const { data: featuredGames = [], isLoading: isFeaturedLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/featured'],
  });

  // Fetch new releases
  const { data: newReleases = [], isLoading: isNewReleasesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/new-releases'],
  });

  // Fetch discounted games (games with a discounted price)
  const { data: allGames = [], isLoading: isAllGamesLoading } = useQuery<Game[]>({
    queryKey: ['/api/games'],
  });

  // Fetch top rated games
  const { data: topRatedGames = [], isLoading: isTopRatedLoading } = useQuery<Game[]>({
    queryKey: ['/api/games/top-rated'],
  });

  // Filter games with discounts
  const discountedGames = allGames.filter(game => game.discountedPrice !== null);

  return (
    <main className="flex-1 px-4 py-6">
      {/* Featured Game */}
      <section className="mb-10">
        {isFeaturedLoading ? (
          <div className="relative rounded-xl overflow-hidden h-80 mb-6 bg-primary-light animate-pulse"></div>
        ) : featuredGames.length > 0 ? (
          <FeaturedGame game={featuredGames[0]} />
        ) : (
          <div className="relative rounded-xl overflow-hidden h-80 mb-6 bg-primary-light flex items-center justify-center">
            <p className="text-white">No hay juegos destacados disponibles.</p>
          </div>
        )}
      </section>

      {/* New Releases */}
      <GameGrid 
        games={newReleases.slice(0, 4)} 
        title="Nuevos lanzamientos" 
        seeAllLink="/category/new-releases"
        isLoading={isNewReleasesLoading}
      />
      
      {/* Deals */}
      <GameGrid 
        games={discountedGames.slice(0, 4)} 
        title="Ofertas destacadas" 
        seeAllLink="/category/offers"
        isLoading={isAllGamesLoading}
      />

      {/* Top Rated */}
      <GameGrid 
        games={topRatedGames.slice(0, 4)} 
        title="Mejor valorados" 
        seeAllLink="/category/top-rated"
        isLoading={isTopRatedLoading}
      />
      
      {/* Newsletter */}
      <Newsletter />
    </main>
  );
}
