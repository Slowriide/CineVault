import { supabase } from "@/integrations/supabase/supabaseClient";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useFavs } from "./useFavs";

export const useToggleFavorite = (userId?: string) => {
  const queryClient = useQueryClient();

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
          : item.first_air_date.toString();
      const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

      const { error } = await supabase.from("favorites").insert({
        user_id: userId,
        movie_id: String(item.id),
        media_type: item?.media_type,
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

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["favorites", userId] });
    },
  });

  const { data: favorites } = useFavs(userId);
  const favoriteIds = new Set(favorites?.map((f) => f.movie_id));

  return { addFavorite, removeFavorite, favoriteIds };
};
