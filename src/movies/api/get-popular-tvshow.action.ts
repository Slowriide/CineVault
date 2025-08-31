import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";

interface Options {
  page?: number;
  language?: string;
}

export const getPopularTvShowsAction = async ({
  page,
  language,
}: Options): Promise<MovieDBResponse> => {
  const { data } = await TMDBAPI.get<MovieDBResponse>(`/tv/popular`, {
    params: {
      page,
      language,
    },
  });

  return {
    ...data,
  };
};
