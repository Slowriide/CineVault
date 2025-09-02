import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Type } from "@/interfaces/MovieCategory";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

export interface PaginatedResponse {
  page: number;
  results: MovieMovieDB[] | TvShowMovieDB[];
  total_pages: number;
  total_results: number;
}

interface Options {
  id: string;
  type: Type;
  page?: number;
  language?: string;
}

export const getSimilar = async ({
  id,
  type,
  page,
  language,
}: Options): Promise<PaginatedResponse> => {
  const { data } = await TMDBAPI.get(`/${type}/${id}/similar`, {
    params: {
      language,
      page,
    },
  });

  return { ...data };
};
