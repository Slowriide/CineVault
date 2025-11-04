import {
  SupabaseToMovieMapper,
  type SupabaseMovie,
} from "@/utils/FavoriteToMovieMapper";

import { MovieCard } from "../../MovieCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SkeletonGrid } from "../../skeletons/SkeletonGrid";
import { CustomError } from "@/components/custom/CustomError";
import { TabsContent } from "@/components/ui/tabs";

interface ProfileTabsContentProps {
  movies: SupabaseMovie[];
  isError: boolean;
  isLoading: boolean;
  value: string;
  title: string;
  subtitle: string;
}

/**
 * Renders content for a profile tab including loading, error, empty state,
 * or a grid of favorite movies/TV shows.
 */
export const ProfileTabsContent = ({
  movies,
  isError,
  isLoading,
  value,
  title,
  subtitle,
}: ProfileTabsContentProps) => {
  return (
    <TabsContent value={value} className="space-y-6">
      {isLoading ? (
        <SkeletonGrid count={12} />
      ) : isError ? (
        <CustomError
          title={`Error loading ${value}`}
          message={"Please refresh"}
          height="h-40 items-center"
        />
      ) : movies.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground mb-6">{subtitle}</p>
          <Button asChild>
            <a href="/">Discover Movies and TV Shows</a>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {movies.map((fav) => {
            const item = SupabaseToMovieMapper(fav);
            return (
              <MovieCard
                key={`${value}-${fav.media_type}-${fav.movie_id}`}
                item={item}
                mediaType={item.media_type}
                size="xl"
              />
            );
          })}
        </div>
      )}
    </TabsContent>
  );
};
