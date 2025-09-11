import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { GenresResponse } from "@/interfaces/Genres";
import type { Type } from "@/interfaces/MovieCategory";

interface Options {
  type: Type;
  language?: string;
}

export const getMovieGenresAction = async ({
  type,
  language,
}: Options): Promise<GenresResponse> => {
  const { data } = await TMDBAPI.get<GenresResponse>(`/genre/${type}/list`, {
    params: {
      language,
    },
  });

  return { ...data };
};
