import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { tmdbService } from "@/mocks/tmdb";

import { MovieCard } from "../components/MovieCard";
import { SearchFilters } from "../components/SearchFilters";
import { CustomPagination } from "../../components/custom/CustomPagination";
import { useMoviesByFilter } from "../hooks/useMoviesByFilters";
import { useSearchParams } from "react-router";
import type { Type } from "@/interfaces/MovieCategory";

interface DiscoverFilters {
  with_genres?: string;
  primary_release_year?: string;
  with_original_language?: string;
  sort_by: string;
  page: number;
}

export default function DiscoverPage() {
  const [searcParams] = useSearchParams();

  const { data } = useMoviesByFilter();
  const type = searcParams.get("type") || "movie";

  console.log(data?.results);

  const [filters, setFilters] = useState<DiscoverFilters>({
    sort_by: "popularity.desc",
    page: 1,
  });

  // Fetch movies based on filters
  const { data: moviesData, isLoading } = useQuery({
    queryKey: ["discover-movies", filters],
    queryFn: () => tmdbService.discoverMovies(filters),
  });

  const movies = data?.results || [];
  const totalPages = moviesData?.data.total_pages || 1;

  const clearFilters = () => {
    setFilters({
      sort_by: "popularity.desc",
      page: 1,
    });
  };

  return (
    <main className="min-h-screen bg-gradient-hero">
      {/* Filters */}
      <SearchFilters />

      {/* Movies Grid */}
      <div className="container mx-auto p-4">
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
            {Array.from({ length: 20 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[2/3] bg-muted animate-pulse rounded-lg"
              />
            ))}
          </div>
        ) : movies.length > 0 ? (
          <>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
              {movies.map((movie: any) => (
                <MovieCard
                  key={movie.id}
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
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No movies found with the current filters.
            </p>
            <Button variant="outline" onClick={clearFilters} className="mt-4">
              Clear filters
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
