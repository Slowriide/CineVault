import { useMoviesByFilter } from "../hooks/useMoviesByFilters";
import { useSearchParams } from "react-router";
import { DiscoverContent } from "../components/discover/DiscoverContent";
import { SearchFilters } from "../components/discover/SearchFilters";

export default function DiscoverPage() {
  // Get query parameters from the URL (e.g., type, genre, sort)
  const [searchParams] = useSearchParams();

  // Fetch movies using the custom hook that reads filters from URL params
  const { data, isError, isLoading } = useMoviesByFilter();

  // Determine the media type (default to "movie" if not specified)
  const type = searchParams.get("type") || "movie";

  // Extract movie results from API response
  const movies = data?.results || [];

  // Extract total pages for pagination
  const totalPages = data?.total_pages || 1;

  // Check if there are no movies to display
  const isEmpty = movies.length === 0;

  return (
    <main className="min-h-screen bg-gradient-hero">
      {/* Filters Section */}
      <SearchFilters />

      {/* Movies Grid / Discover Content */}
      <div className="container mx-auto p-4">
        <DiscoverContent
          isLoading={isLoading} // show loader if fetching
          isError={isError} // show error message if API fails
          isEmpty={isEmpty} // show empty state if no movies found
          movies={movies} // the list of movies to display
          type={type} // media type (movie or tv)
          totalPages={totalPages} // total pages for pagination
        />
      </div>
    </main>
  );
}
