import { supabase } from "@/integrations/supabase/supabaseClient";
import type { SupabaseMovie } from "@/utils/FavoriteToMovieMapper";
import { useQuery } from "@tanstack/react-query";

/**
 * useWatchlist
 *
 * Custom hook to fetch the current user's watchlist from Supabase.
 * Integrates with React Query for caching, loading, and error states.
 *
 * @param userId - Current user's ID
 * @returns React Query object containing:
 *  - data: array of watchlist items (SupabaseMovie[])
 *  - isLoading: boolean indicating loading state
 *  - isError: boolean indicating error state
 *  - error: error object if query fails
 */
export const useWatchlist = (userId?: string) => {
  return useQuery<SupabaseMovie[]>({
    // Query key includes the userId to differentiate between users
    queryKey: ["watchlist", userId],

    // Query function fetches all watchlist items for the given user
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId!);

      if (error) throw new Error(error?.message);

      return data;
    },

    // Only run this query if a valid userId is provided
    enabled: !!userId,
  });
};
