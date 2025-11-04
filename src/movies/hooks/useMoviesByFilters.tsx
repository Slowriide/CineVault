import { useQuery } from "@tanstack/react-query";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { normalizeSearchResults } from "@/utils/NormalizeResult";
import { useSearchParams } from "react-router";
import { getMovieByFiltersAction } from "../api/get-movies-by-filters.action";

/**
 * useMoviesByFilter
 *
 * Custom hook to fetch movies (or TV shows) based on filter query parameters from the URL.
 * Normalizes the results for consistent usage in the UI.
 *
 * @returns An object containing:
 *   - normalizedData: Normalized and sorted search results
 *   - All React Query states: isLoading, isError, data, error, etc.
 */
export const useMoviesByFilter = () => {
  // Get search params from the URL
  const [searchParams] = useSearchParams();

  // Extract filter parameters from the query string
  const language = searchParams.get("language") || "us-US";
  const sortBy = searchParams.get("sort") || undefined;
  const genreQuery = searchParams.get("genre") || undefined;
  const type = searchParams.get("type") || "movie";
  const year = searchParams.get("year") || undefined;
  const castString = searchParams.get("cast") || undefined;

  // Parse genre from query (e.g., "action-28" => 28)
  const genreString = genreQuery
    ? parseInt(genreQuery.split("-").pop()!).toString()
    : null;
  const genre = Number(genreString);

  // Parse cast ID from query (e.g., "brad-pitt-12345" => 12345)
  const cast = castString
    ? parseInt(castString.split("-").pop()!).toString()
    : null;

  // Parse current page number from query
  const pageQuery = searchParams.get("page") || 1;
  const page = Number(pageQuery);

  // Fetch filtered movies using React Query
  const result = useQuery({
    queryKey: [
      "multipleSearch",
      language,
      sortBy,
      genre,
      type,
      year,
      page,
      cast,
    ], // Query key ensures caching & updates
    queryFn: () =>
      getMovieByFiltersAction({
        language,
        sortBy,
        genre,
        type,
        year: Number(year),
        page,
        cast: Number(cast),
      }),
    staleTime: 1000 * 60 * 5, // 5 minutes freshness
    retry: false, // Do not retry failed queries
  });

  // Normalize results for consistent structure in the UI
  const normalizedResults: NormalizedSearchResult[] = result.data?.results
    ? (
        result.data.results
          .map(normalizeSearchResults) // Convert raw API response to normalized objects
          .filter(Boolean) as NormalizedSearchResult[]
      ).sort((a, b) => b.popularity - a.popularity) // Sort by popularity descending
    : [];

  return {
    ...result, // Return all React Query states
    normalizedData: normalizedResults, // Return normalized and sorted data
  };
};
