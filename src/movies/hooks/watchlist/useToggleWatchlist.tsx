import { supabase } from "@/integrations/supabase/supabaseClient";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWatchlist } from "./useWatchlist";

/**
 * useToggleWatchlist
 *
 * Custom hook to handle adding/removing movies or TV shows
 * from a user's watchlist in Supabase.
 * Uses React Query to automatically manage caching, invalidation, and reactivity.
 *
 * @param userId - Current user's ID
 * @returns
 *   - addWatchlist: mutation to add an item to watchlist
 *   - removeWatchlist: mutation to remove an item from watchlist
 *   - watchListIds: Set of movie IDs currently in the user's watchlist
 */
export const useToggleWatchlist = (userId?: string) => {
  const queryClient = useQueryClient();

  // Mutation to add an item to the watchlist
  const addWatchlist = useMutation({
    mutationFn: async (item: MovieMovieDB | TvShowMovieDB) => {
      if (!userId) throw new Error("No user logged in");

      const title = "title" in item ? item.title : item.name;
      const releaseDate =
        "release_date" in item ? item.release_date : item.first_air_date;
      const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

      const { error } = await supabase.from("watchlist").insert({
        user_id: userId,
        movie_id: String(item.id),
        media_type: item.media_type,
        metadata: {
          title,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          release_date: year,
          overview: item.overview,
        },
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Invalidate and refetch the watchlist query
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      toast.success("Marked to watch");
    },
  });

  // Mutation to remove an item from the watchlist
  const removeWatchlist = useMutation({
    mutationFn: async (movieId: string) => {
      if (!userId) throw new Error("No user logged in");

      const { error } = await supabase
        .from("watchlist")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Invalidate and refetch the watchlist query
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
    },
  });

  // Fetch the current user's watchlist
  const { data: watchlisted } = useWatchlist(userId);

  // Create a Set of movie IDs currently in the watchlist for easy lookup
  const watchListIds = new Set(watchlisted?.map((f) => f.movie_id));

  return { addWatchlist, removeWatchlist, watchListIds };
};
