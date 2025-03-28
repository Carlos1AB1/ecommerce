import GameCard from './GameCard';
import { Game } from '@shared/schema';
import { Skeleton } from '@/components/ui/skeleton';

interface GameGridProps {
  games: Game[];
  title: string;
  seeAllLink?: string;
  isLoading?: boolean;
}

export default function GameGrid({ games, title, seeAllLink, isLoading = false }: GameGridProps) {
  const renderSkeletonCards = () => {
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
    <section className="mb-10">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-rajdhani font-bold text-2xl text-white">{title}</h2>
        {seeAllLink && (
          <a href={seeAllLink} className="text-accent hover:text-accent-hover font-medium">
            Ver todo
          </a>
        )}
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {isLoading ? (
          renderSkeletonCards()
        ) : (
          games.map(game => (
            <GameCard key={game.id} game={game} />
          ))
        )}
      </div>
    </section>
  );
}
