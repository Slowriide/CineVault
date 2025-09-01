import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDetails } from "@/interfaces/MovieDetails";

interface Options {
  id: string;
  language?: string;
}

export const getMovieDetails = async ({
  id,
  language,
}: Options): Promise<MovieDetails> => {
  const { data } = await TMDBAPI.get<MovieDetails>(`/movie/${id}`, {
    params: {
      language,
    },
  });

  return { ...data };
};
