import { useQuery } from "@tanstack/react-query";
import { getMultipleSearchsAction } from "../api/get-multiple-searchs.action";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { normalizeSearchResults } from "@/utils/NormalizeResult";
import { useSearchParams } from "react-router";

/**
 * useMultipleSearchs
 *
 * Custom hook to fetch search results (movies, TV shows, actors) based on a search query.
 * Normalizes the results for consistent use in the UI.
 *
 * @param query - The search term to query for.
 * @param include_adult - Optional flag to include adult content.
 * @param language - Language code for the results (default "us-US").
 *
 * @returns An object containing:
 *   - normalizedData: Normalized and sorted search results
 *   - All React Query states: isLoading, isError, data, error, etc.
 */
export const useMultipleSearchs = (
  query: string,
  include_adult?: boolean,
  language: string = "us-US"
) => {
  // Get current page number from URL query params
  const [searchParams] = useSearchParams();
  const pageQuery = searchParams.get("page") || 1;
  const page = Number(pageQuery);

  // Fetch search results using React Query
  const result = useQuery({
    queryKey: ["multipleSearch", query, include_adult, language, page], // Unique cache key
    queryFn: () =>
      getMultipleSearchsAction({ query, include_adult, page, language }), // API call
    enabled: !!query, // Only fetch if query is not empty
    staleTime: 1000 * 60 * 5, // 5 minutes freshness
    retry: false, // Do not retry failed queries
  });

  // Normalize API results for consistent structure
  const normalizedResults: NormalizedSearchResult[] = result.data?.results
    ? (
        result.data.results
          .map(normalizeSearchResults) // Map raw API results to normalized objects
          .filter(Boolean) as NormalizedSearchResult[]
      ).sort((a, b) => b.popularity - a.popularity) // Sort descending by popularity
    : [];

  return {
    ...result, // Return all React Query states
    normalizedData: normalizedResults, // Normalized and sorted data
  };
};
