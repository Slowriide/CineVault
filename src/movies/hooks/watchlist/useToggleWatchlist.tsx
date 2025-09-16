import { supabase } from "@/integrations/supabase/supabaseClient";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useWatchlist } from "./useWatchlist";

export const useToggleWatclist = (userId?: string) => {
  const queryClient = useQueryClient();

  const addWatchlist = useMutation({
    mutationFn: async (item: MovieMovieDB | TvShowMovieDB) => {
      if (!userId) throw new Error("No user logged in");

      const title = "title" in item ? item.title : item.name;
      const releaseDate =
        "release_date" in item
          ? item.release_date
          : item.first_air_date.toString();
      const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";

      const { error } = await supabase.from("watchlist").insert({
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
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
      toast.success("Marqued to watch");
    },
  });

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
      queryClient.invalidateQueries({ queryKey: ["watchlist", userId] });
    },
  });
  const { data: watchlisted } = useWatchlist(userId);
  const watchListIds = new Set(watchlisted?.map((f) => f.movie_id));

  return { addWatchlist, removeWatchlist, watchListIds };
};
