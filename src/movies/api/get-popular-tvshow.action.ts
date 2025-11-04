import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";

// Define the accepted parameters for fetching popular TV shows:
// - page: Optional pagination index (1-based).
// - language: Optional ISO code for localization (e.g., "en-US").
interface Options {
  page?: number;
  language?: string;
}

// Fetch a paginated list of popular TV shows from TMDB.
// Endpoint example: GET /tv/popular?language=en-US&page=2
export const getPopularTvShowsAction = async ({
  page,
  language,
}: Options): Promise<MovieDBResponse> => {
  // Make the GET request to the TMDB API.
  // The TMDBAPI instance already includes the base URL and API token.
  const { data } = await TMDBAPI.get<MovieDBResponse>(`/tv/popular`, {
    params: {
      page, // Enables pagination through multiple result pages.
      language, // Allows localized TV show titles and descriptions.
    },
  });

  // Return a shallow copy of the data to ensure immutability and consistency.
  return { ...data };
};
