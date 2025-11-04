import type { Type } from "@/interfaces/MovieCategory";
import { getMovieGenresAction } from "@/movies/api/get-movie-genres.action";

/**
 * getGenres
 *
 * Fetches genres for a given media type (movie or tv) and caches them in localStorage for 7 days.
 *
 * @param type - "movie" or "tv"
 * @param language - language code (default: "us-US")
 * @returns array of genre objects
 */
export async function getGenres(type: Type, language = "us-US") {
  const cacheKey = `${type}_genres`; // Key for localStorage cache
  const cache = localStorage.getItem(cacheKey); // Try to get cached data

  if (cache) {
    // If cached data exists, parse it
    const { genres, lastUpdated } = JSON.parse(cache);

    // Calculate difference in days between now and last cache update
    const diffDays =
      (Date.now() - new Date(lastUpdated).getTime()) / (1000 * 60 * 60 * 24);

    // If cache is less than 7 days old, return cached genres
    if (diffDays < 7) {
      return genres;
    }
  }

  // If no valid cache, fetch genres from API
  const response = await getMovieGenresAction({ type, language });

  // Extract genres array from API response
  const data = await response.genres;

  // Save fetched genres in localStorage with timestamp
  localStorage.setItem(
    cacheKey,
    JSON.stringify({ genres: data, lastUpdated: new Date().toISOString() })
  );

  return data; // Return fresh genre data
}
