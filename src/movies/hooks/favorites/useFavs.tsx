import { supabase } from "@/integrations/supabase/supabaseClient";
import type { SupabaseMovie } from "@/utils/FavoriteToMovieMapper";
import { useQuery } from "@tanstack/react-query";

/**
 * useFavs Hook
 *
 * Fetches a user's favorite movies from Supabase.
 * Uses React Query for caching, automatic refetching, and async state management.
 *
 * @param userId - Optional Supabase user ID
 * @returns React Query object containing favorites, loading, and error states
 *
 * Usage Example:
 * const { data: favorites, isLoading, isError } = useFavs(user?.id);
 */
export const useFavs = (userId?: string) => {
  return useQuery<SupabaseMovie[]>({
    // Unique key for caching and refetching. Includes userId to separate caches per user
    queryKey: ["favorites", userId],

    // Function that fetches data from Supabase
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites") // Supabase table
        .select("*") // Select all columns
        .eq("user_id", userId!); // Filter by user ID

      if (error) throw new Error(error.message); // Throw error to be handled by React Query

      return data; // Return array of SupabaseMovie
    },

    // Only enable this query if userId exists
    enabled: !!userId,
  });
};
