import { supabase } from "@/integrations/supabase/supabaseClient";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFavs } from "./useFavs";

/**
 * useToggleFavorite Hook
 *
 * Provides functionality to add or remove a movie/TV show
 * from the current user's favorites. Works with Supabase and React Query.
 *
 * @param userId - Supabase user ID (optional)
 * @returns
 *  - addFavorite: mutation to add an item to favorites
 *  - removeFavorite: mutation to remove an item from favorites
 *  - favoriteIds: a Set of favorite movie IDs for quick lookup
 *
 * Usage Example:
 * const { addFavorite, removeFavorite, favoriteIds } = useToggleFavorite(user?.id);
 * const isFavorite = favoriteIds.has(String(movie.id));
 */
export const useToggleFavorite = (userId?: string) => {
  const queryClient = useQueryClient();

  /**
   * Mutation to add a movie/TV show to the favorites table.
   */
  const addFavorite = useMutation({
    mutationFn: async (item: MovieMovieDB | TvShowMovieDB) => {
      if (!userId) {
        toast.error("Must be logged in to save movies in favorites");
        throw new Error("No user logged in");
      }

      const title = "title" in item ? item.title : item.name;
      const releaseDate =
        "release_date" in item
          ? item.release_date
          : item.first_air_date?.toString();
      const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

      const { error } = await supabase.from("favorites").insert({
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

      if (error) {
        toast.error("Error adding to favorites");
        throw new Error(error.message);
      }

      toast.success("Added to favorites");
    },

    // Invalidate favorites cache so UI updates automatically
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  /**
   * Mutation to remove a movie/TV show from the favorites table.
   */
  const removeFavorite = useMutation({
    mutationFn: async (movieId: string) => {
      if (!userId) {
        toast.error("Must be logged in to save movies in favorites");
        throw new Error("No user logged in");
      }

      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);

      if (error) {
        toast.error("Error removing from favorites");
        throw new Error(error.message);
      }
    },

    // Invalidate favorites cache so UI updates automatically
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  // Get the current user's favorites using the useFavs hook
  const { data: favorites } = useFavs(userId);

  // Create a Set for efficient lookups of favorite movie IDs
  const favoriteIds = new Set(favorites?.map((f) => f.movie_id));

  return { addFavorite, removeFavorite, favoriteIds };
};
