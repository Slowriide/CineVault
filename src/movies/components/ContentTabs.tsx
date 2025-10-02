import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Type } from "@/interfaces/MovieCategory";
import type { PersonDetails } from "@/interfaces/Credits";
import type { PaginatedResponse } from "../api/get-similar.action";
import { ActorCard } from "./ActorCard";
import { MovieCard } from "./MovieCard";
import { Button } from "@/components/ui/button";

interface ContentTabsProps {
  credits?: PersonDetails[];
  similarMovies?: PaginatedResponse;
  isErrorCredits?: Error | null;
  isLoadingSimilar?: boolean;
  isErrorSimilar?: Error | null;
  type: Type;
  visibleCount: number;
  allPersons: number;
  onClick: () => void;
}

export const ContentTabs: React.FC<ContentTabsProps> = ({
  credits,
  similarMovies,
  isErrorCredits,
  isErrorSimilar,
  type,
  visibleCount,
  allPersons,
  onClick,
}) => {
  return (
    <Tabs defaultValue="cast" className="space-y-6">
      <TabsList className="bg-muted/50">
        <TabsTrigger value="cast">Cast</TabsTrigger>
        <TabsTrigger value="similar">Similar Movies</TabsTrigger>
      </TabsList>

      <TabsContent value="cast" className="space-y-4">
        <h2 className="text-xl font-semibold">Cast</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {isErrorCredits ? (
            <p className="text-red-500">Error loading movies</p>
          ) : (
            credits!.map((actor) => (
              <ActorCard key={`${actor.id}-${actor.name}`} {...actor} />
            ))
          )}
        </div>
        {credits && visibleCount < allPersons && (
          <div className="flex justify-center mt-8">
            <Button variant="outline" onClick={onClick}>
              Load more
            </Button>
          </div>
        )}
      </TabsContent>

      <TabsContent value="similar">
        <h2 className="text-xl font-semibold">Cast</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
          {isErrorSimilar ? (
            <p className="text-red-500">Error loading similar movies</p>
          ) : !similarMovies || !similarMovies.results ? (
            <p className="text-muted-foreground">No similar movies found</p>
          ) : (
            similarMovies.results.map((movie) => (
              <MovieCard
                key={`${movie.id}-${movie.media_type}`}
                item={movie}
                mediaType={type}
                size="xl"
              />
            ))
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};
