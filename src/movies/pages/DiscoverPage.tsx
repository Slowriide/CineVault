import { SearchFilters } from "../components/SearchFilters";
import { useMoviesByFilter } from "../hooks/useMoviesByFilters";
import { useSearchParams } from "react-router";
import { DiscoverContent } from "../components/discover/DiscoverContent";

export default function DiscoverPage() {
  const [searchParams] = useSearchParams();
  const { data, isError, isLoading } = useMoviesByFilter();

  const type = searchParams.get("type") || "movie";
  const movies = data?.results || [];
  const totalPages = data?.total_pages || 1;
  const isEmpty = movies.length === 0;

  return (
    <main className="min-h-screen bg-gradient-hero">
      {/* Filters */}
      <SearchFilters />

      {/* Movies Grid */}
      <div className="container mx-auto p-4">
        <DiscoverContent
          isLoading={isLoading}
          isError={isError}
          isEmpty={isEmpty}
          movies={movies}
          type={type}
          totalPages={totalPages}
        />
      </div>
    </main>
  );
}
