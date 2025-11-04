import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { getCredits } from "../api/get-credits.action";
import type { PersonDetails } from "@/interfaces/Credits";

/**
 * useCredits
 *
 * Custom hook to fetch the cast/crew credits of a movie or TV show.
 * Uses React Query for caching, loading, and error handling.
 *
 * @param movieId - ID of the movie or TV show
 * @param type - Type of media, e.g., "movie" or "tv"
 * @param visibleCount - Number of cast members to show by default (slices the array)
 * @param language - Language for credits, default is "us-US"
 * @returns Object containing:
 *   - allPersons: full list of cast members
 *   - visiblePersons: limited list for initial display
 *   - ...response: React Query object (data, isLoading, isError, error, etc.)
 */
export const useCredits = (
  movieId: string,
  type: Type,
  visibleCount: number = 21,
  language: string = "us-US"
) => {
  // React Query fetch call
  const response = useQuery({
    queryKey: ["credits", movieId, type, language], // cache key includes movieId, type, and language
    queryFn: () => getCredits({ movieId, type, language }), // fetch function
  });

  // Full list of cast/crew members
  const allPersons: PersonDetails[] = [...(response.data?.cast ?? [])];

  // Slice array for display of top visibleCount members
  const visiblePersons = allPersons.slice(0, visibleCount);

  return {
    ...response, // React Query properties (isLoading, isError, data, etc.)
    visiblePersons, // Limited list for display
    allPersons, // Full cast/crew list
  };
};
