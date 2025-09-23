import { Button } from "@/components/ui/button";
import { MovieCard } from "../components/MovieCard";
import { SearchFilters } from "../components/SearchFilters";
import { CustomPagination } from "../../components/custom/CustomPagination";
import { useMoviesByFilter } from "../hooks/useMoviesByFilters";
import { useSearchParams } from "react-router";
import type { Type } from "@/interfaces/MovieCategory";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { SkeletonGrid } from "../components/SkeletonGrid";
import { VideoOff } from "lucide-react";
import { useCallback } from "react";

export default function DiscoverPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const { data, isLoading } = useMoviesByFilter();
  const type = searchParams.get("type") || "movie";

  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;

  const handleClearAllFilters = useCallback(() => {
    searchParams.delete("language");
    searchParams.delete("sort");
    searchParams.delete("genre");
    searchParams.delete("type");
    searchParams.delete("year");
    searchParams.delete("cast");
    setSearchParams(searchParams);
  }, [searchParams, setSearchParams]);

  return (
    <main className="min-h-screen bg-gradient-hero">
      {/* Filters */}
      <SearchFilters />

      {/* Movies Grid */}
      <div className="container mx-auto p-4">
        {isLoading ? (
          <SkeletonGrid />
        ) : movies.length > 0 ? (
          <>
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

            {/* Pagination */}
            <CustomPagination totalPages={totalPages} />
          </>
        ) : (
          <div className="justify-items-center text-center py-12 space-y-4">
            <VideoOff aria-hidden="true" />
            <p className="text-muted-foreground text-lg ">
              No movies found with the current filters.
            </p>
            <Button
              variant="outline"
              onClick={handleClearAllFilters}
              aria-label="Clear all filters"
            >
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
