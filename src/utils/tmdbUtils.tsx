import type { Type } from "@/interfaces/MovieCategory";
import { getMovieGenresAction } from "@/movies/api/get-movie-genres.action";

export async function getGenres(type: Type, language = "us-US") {
  const cacheKey = `${type}_genres`;
  const cache = localStorage.getItem(cacheKey);

  if (cache) {
    const { genres, lastUpdated } = JSON.parse(cache);
    const diffDays =
      (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);

    if (diffDays < 7) {
      return genres;
    }
  }

  const response = await getMovieGenresAction({ type, language });
  const data = await response.genres;

  console.log(data);

  localStorage.setItem(
    cacheKey,
    JSON.stringify({ genres: data, lastUpdated: new Date().toISOString() })
  );

  return data;
}
