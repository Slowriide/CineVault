import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";
import type { MovieCategory } from "../../interfaces/MovieCategory";

interface Options {
  movieCategory: MovieCategory;
  page?: number;
  language?: string;
}

export const getPopularMoviesAction = async ({
  page,
  language,
  movieCategory,
}: Options): Promise<MovieDBResponse> => {
  const { data } = await TMDBAPI.get<MovieDBResponse>(
    `/movie/${movieCategory}`,
    {
      params: {
        page,
        language,
      },
    }
  );

  return {
    ...data,
  };
};
