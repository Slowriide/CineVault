import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/utils/tmdbUtils";
import type { Genre } from "@/interfaces/Genres";

/**
 * useGenres
 *
 * Custom hook to fetch the list of genres for movies or TV shows.
 * Uses React Query for caching, automatic refetching, and stale-time control.
 *
 * @param type - "movie" or "tv" to specify which type of genres to fetch
 * @param language - Optional language code (default: "us-US") for localized genre names
 * @returns React Query result object containing:
 *   - data: Genre[] | undefined
 *   - isLoading: boolean
 *   - isError: boolean
 *   - and other query state properties
 */
export const useGenres = (type: Type, language: string = "us-US") => {
  return useQuery<Genre[]>({
    // Unique query key based on type and language
    queryKey: ["genres", type, language],
    // Query function to fetch genres from TMDB
    queryFn: async () => await getGenres(type, language),
    // Cache the data for a week (7 days) before refetching
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
};
