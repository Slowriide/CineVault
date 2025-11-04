import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/get-movie-details.action";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { useTrailers } from "./useTrailers";

/**
 * useMovieDetails
 *
 * Custom hook to fetch and normalize movie details from TMDB.
 * Integrates with trailers fetched via `useTrailers`.
 *
 * @param id - The TMDB movie ID
 * @param language - Optional language code for localized data (default: "us-US")
 * @returns An object containing:
 *   - data: NormalizedMovieDetailsData | null
 *   - trailers: array of trailers from useTrailers
 *   - isLoading, isError, error, refetch, etc. from React Query
 */
export const useMovieDetails = (id: string, language: string = "us-US") => {
  // Fetch movie details using React Query
  const query = useQuery({
    queryKey: ["movieDetails", id, language], // Unique query key
    queryFn: () => getMovieDetails({ id, language }), // Fetch function
    staleTime: 1000 * 60 * 5, // Data considered fresh for 5 minutes
    enabled: !!id, // Only run query if `id` is provided
  });

  // Fetch trailers (could be used in UI components)
  const { trailers } = useTrailers();

  // Normalize data for consistent access in the app
  const normalizedData: NormalizedMovieDetailsData | null = query.data
    ? {
        id: query.data.id,
        title: query.data.title ?? "Untitled", // Default title if missing
        overview: query.data.overview,
        poster_path: query.data.poster_path ?? "/placeholder.svg", // Default poster
        backdrop_path: query.data.backdrop_path ?? "",
        release_date: query.data.release_date,
        runtime: query.data.runtime,
        vote_average: query.data.vote_average,
        vote_count: query.data.vote_count,
        genres: query.data.genres ?? [], // Default empty array
        homepage: query.data.homepage ?? null,
        tagline: query.data.tagline ?? "",
      }
    : null;

  // Return the normalized data along with trailers and query state
  return {
    ...query, // Include isLoading, isError, error, refetch, etc.
    data: normalizedData,
    trailers,
  };
};
