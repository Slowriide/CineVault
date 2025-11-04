import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";

// Define the shape of the filter options accepted by this function.
// Each property corresponds to a valid TMDB "discover" query parameter.
interface Options {
  genre?: number; // TMDB genre ID
  year?: number; // Release year
  language?: string; // ISO language code (e.g., "en-US")
  sortBy?: string; // Sort order, e.g., "popularity.desc"
  type?: string; // "movie" or "tv"
  cast?: number; // Person ID to filter by (actors, directors, etc.)
  page?: number; // Pagination index (1-based)
}

// Fetch a list of movies or TV shows from TMDB using flexible filters.
// It calls the "discover" endpoint with dynamically built query parameters.
export const getMovieByFiltersAction = async (
  options: Options
): Promise<MovieDBResponse> => {
  // Destructure the filter options for cleaner access
  const { genre, year, language, sortBy, type, cast, page } = options;

  // Initialize a params object dynamically to include only defined values.
  const params: Record<string, string | number> = {};

  // Add filters to the request only if they are valid.
  if (language) params.language = language;
  if (genre && !isNaN(genre)) params.with_genres = genre;
  if (year && !isNaN(year)) params.primary_release_year = year;
  if (sortBy) params.sort_by = sortBy;
  if (cast && !isNaN(cast)) params.with_people = cast;
  if (page) params.page = page;

  // Example request:
  // GET /discover/movie?language=en-US&sort_by=popularity.desc&with_genres=28&page=2
  const { data } = await TMDBAPI.get<MovieDBResponse>(`/discover/${type}`, {
    params,
  });

  // Return a shallow copy of the response data (for immutability and consistency)
  return { ...data };
};
