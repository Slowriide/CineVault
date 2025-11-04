import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { GenresResponse } from "@/interfaces/Genres";
import type { Type } from "@/interfaces/MovieCategory";

// Define the expected function parameters:
// - type: The content type ("movie" or "tv"), used to fetch the correct genre list.
// - language (optional): ISO language code (e.g., "en-US") for localized genre names.
interface Options {
  type: Type;
  language?: string;
}

// Fetch the list of genres from The Movie Database (TMDB) API.
// This endpoint returns all genres associated with a given type (movie or TV).
export const getMovieGenresAction = async ({
  type,
  language,
}: Options): Promise<GenresResponse> => {
  // Example API call:
  // GET /genre/movie/list?language=en-US
  const { data } = await TMDBAPI.get<GenresResponse>(`/genre/${type}/list`, {
    params: {
      language, // Optional parameter for localized results
    },
  });

  // Return the genre data from the API response.
  // Spreading into a new object ensures immutability and avoids reference issues.
  return { ...data };
};
