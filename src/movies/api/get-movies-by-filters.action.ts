import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";

interface Options {
  genre?: number;
  year?: number;
  language?: string;
  sortBy?: string;
  type?: string;
  cast?: number;
  page?: number;
}

export const getMovieByFiltersAction = async (
  options: Options
): Promise<MovieDBResponse> => {
  const { genre, year, language, sortBy, type, cast, page } = options;

  console.log(options);

  const params: Record<string, string | number> = {};

  if (language) params.language = language;
  if (genre && !isNaN(genre)) params.with_genres = genre;
  if (year && !isNaN(year)) params.primary_release_year = year;
  if (sortBy) params.sort_by = sortBy;
  if (cast && !isNaN(cast)) params.with_people = cast;
  if (page) params.page = page;

  const { data } = await TMDBAPI.get<MovieDBResponse>(`/discover/${type}`, {
    params,
  });

  return { ...data };
};
