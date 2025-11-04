import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Credits } from "@/interfaces/Credits";
import type { Type } from "@/interfaces/MovieCategory";

// Define expected parameters for fetching credits:
// - movieId: the unique TMDB ID of the movie or TV show
// - type: content type ("movie" or "tv") used to build the API route
// - language (optional): ISO language code (e.g., "en-US") for localized responses
interface Options {
  movieId: string;
  type: Type;
  language?: string;
}

// Fetch cast and crew credits for a given movie or TV show from TMDB.
export const getCredits = async ({
  movieId,
  type,
  language,
}: Options): Promise<Credits> => {
  // Send a GET request to the TMDB endpoint:
  // Example: /movie/1234/credits or /tv/5678/credits
  const { data } = await TMDBAPI.get(`/${type}/${movieId}/credits`, {
    params: {
      language, // Optional query parameter for localized results
    },
  });

  // Spread and return the response data (contains cast, crew, etc.)
  return { ...data };
};
