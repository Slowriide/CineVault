import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Credits } from "@/interfaces/Credits";
import type { Type } from "@/interfaces/MovieCategory";

interface Options {
  movieId: string;
  type: Type;
  language?: string;
}

export const getCredits = async ({
  movieId,
  type,
  language,
}: Options): Promise<Credits> => {
  const { data } = await TMDBAPI.get(`/${type}/${movieId}/credits`, {
    params: {
      language,
    },
  });

  return { ...data };
};
