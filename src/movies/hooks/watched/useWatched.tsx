import { supabase } from "@/integrations/supabase/supabaseClient";
import type { SupabaseMovie } from "@/utils/FavoriteToMovieMapper";
import { useQuery } from "@tanstack/react-query";

/**
 * useWatched
 *
 * Custom hook to fetch a user's "watched" movies or TV shows from Supabase.
 * Uses React Query to handle caching, background refetching, and loading/error states.
 *
 * @param userId - Current user's ID
 * @returns React Query object containing:
 *   - data: Array of watched movies/TV shows
 *   - isLoading: boolean indicating if the query is loading
 *   - isError: boolean indicating if there was an error
 */
export const useWatched = (userId?: string) => {
  return useQuery<SupabaseMovie[]>({
    queryKey: ["watched", userId], // Unique key for caching per user
    queryFn: async () => {
      if (!userId) throw new Error("No user logged in");

      // Fetch all watched items for this user
      const { data, error } = await supabase
        .from("watched")
        .select("*")
        .eq("user_id", userId);

      if (error) throw new Error(error?.message);

      return data;
    },
    enabled: !!userId, // Only run query if userId is provided
  });
};
