import type { Type } from "@/interfaces/MovieCategory";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

import { MovieCard } from "../MovieCard";
import { SkeletonGrid } from "../skeletons/SkeletonGrid";
import { CustomError } from "@/components/custom/CustomError";
import { NoFoundWithFilters } from "./NoFoundWithFilters";
import { CustomPagination } from "@/components/custom/CustomPagination";

interface DiscoverContentProps {
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  movies: MovieMovieDB[] | TvShowMovieDB[];
  type: string;
  totalPages: number;
}

/**
 * Displays a grid of movies or TV shows for the "Discover" page.
 * Handles different UI states (loading, empty results, or error).
 */
export const DiscoverContent = ({
  isLoading,
  isEmpty,
  isError,
  movies,
  type,
  totalPages,
}: DiscoverContentProps) => {
  // Loading state: show skeleton grid placeholders
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <SkeletonGrid count={18} />
      </div>
    );
  }

  // Empty state: no results found after filtering
  if (isEmpty) {
    return <NoFoundWithFilters />;
  }

  // Error state: general fetch or network error
  if (isError) {
    return (
      <CustomError
        title="Error Loading Movies"
        message="Please try again later"
        action={{ label: "Home", to: "/" }}
      />
    );
  }

  // Success: render movie/TV grid and pagination
  return (
    <div>
      <div className="container grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
        {movies.map((movie: MovieMovieDB | TvShowMovieDB) => (
          <MovieCard
            key={`${movie.id}-${movie.poster_path}`}
            item={movie}
            mediaType={type as Type}
            size="xl"
          />
        ))}
      </div>

      {/* Pagination controls */}
      <CustomPagination totalPages={totalPages} />
    </div>
  );
};
