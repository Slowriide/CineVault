import { supabase } from "@/integrations/supabase/supabaseClient";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWatched } from "./useWatched";

/**
 * useToggleWatched
 *
 * Custom hook to manage a user's "watched" movies or TV shows.
 * Provides:
 * - Adding a movie/TV show to the watched list
 * - Removing a movie/TV show from the watched list
 * - A set of IDs of already watched items for quick lookup
 *
 * @param userId - Current user's ID
 */
export const useToggleWatched = (userId?: string) => {
  const queryClient = useQueryClient();

  /**
   * addWatched
   *
   * Mutation to add an item to the user's watched list in Supabase.
   * Stores minimal metadata about the item for display purposes.
   */
  const addWatched = useMutation({
    mutationFn: async (item: MovieMovieDB | TvShowMovieDB) => {
      if (!userId) throw new Error("No user logged in");

      // Extract title and release date based on type
      const title = "title" in item ? item.title : item.name;
      const releaseDate =
        "release_date" in item ? item.release_date : item.first_air_date;
      const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

      // Insert into Supabase
      const { error } = await supabase.from("watched").insert({
        user_id: userId,
        movie_id: String(item.id),
        media_type: item.media_type,
        metadata: {
          title: title,
          poster_path: item.poster_path,
          vote_average: item.vote_average,
          release_date: year,
          overview: item.overview,
        },
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Refresh the cached watched list and show success toast
      queryClient.invalidateQueries({ queryKey: ["watched", userId] });
      toast.success("Marked as watched");
    },
  });

  /**
   * removeWatched
   *
   * Mutation to remove an item from the user's watched list in Supabase.
   */
  const removeWatched = useMutation({
    mutationFn: async (movieId: string) => {
      if (!userId) throw new Error("No user logged in");

      const { error } = await supabase
        .from("watched")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      // Refresh the cached watched list
      queryClient.invalidateQueries({ queryKey: ["watched", userId] });
    },
  });

  // Retrieve the current watched list
  const { data: watched } = useWatched(userId);
  // Create a Set of watched IDs for quick lookup
  const watchedsIds = new Set(watched?.map((f) => f.movie_id));

  return { addWatched, removeWatched, watchedsIds };
};
