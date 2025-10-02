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

export const DiscoverContent = ({
  isLoading,
  isEmpty,
  isError,
  movies,
  type,
  totalPages,
}: DiscoverContentProps) => {
  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <SkeletonGrid count={18} />
      </div>
    );
  }

  if (isEmpty) {
    return <NoFoundWithFilters />;
  }

  if (isError) {
    return (
      <CustomError
        title={"Error Loading Movies"}
        message={"Please try again later"}
        action={{ label: "Home", to: "/" }}
      />
    );
  }

  return (
    <div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
        {movies.map((movie: MovieMovieDB | TvShowMovieDB) => (
          <MovieCard
            key={`${movie.id}-${movie.poster_path}`}
            item={movie}
            mediaType={type as Type}
            size="xl"
          />
        ))}
      </div>
      <CustomPagination totalPages={totalPages} />
    </div>
  );
};
