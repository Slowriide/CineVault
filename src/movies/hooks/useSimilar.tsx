import { useQuery } from "@tanstack/react-query";
import type { Type } from "../../interfaces/MovieCategory";
import { getSimilar } from "../api/get-similar.action";
/**
 * useSimilar
 *
 * Fetches similar movies or TV shows for a given item.
 *
 * @param id - The ID of the movie or TV show
 * @param type - Type of media ("movie" or "tv")
 * @param page - Page number for paginated results (default: 1)
 * @param language - Language code for API results (default: "us-US")
 * @returns React Query result object containing data, status, etc.
 */
export const useSimilar = (
  id: string,
  type: Type,
  page: number = 1,
  language: string = "us-US"
) => {
  return useQuery({
    // Unique query key ensures caching and invalidation is correct
    queryKey: ["similarMovies", { id, type, page, language }],
    // Function to fetch similar items from the API
    queryFn: () => getSimilar({ id, type, page, language }),
    // Cache results for 5 minutes to reduce redundant API calls
    staleTime: 1000 * 60 * 5,
  });
};
