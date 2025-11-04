import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MultiSearchResponse } from "@/interfaces/SearchResponse";

// Define accepted parameters for the multi-search request:
// - query: The search term entered by the user (required).
// - include_adult: Whether to include adult content (optional).
// - page: Pagination index (optional, defaults to 1 in TMDB API).
// - language: ISO code for localized search results (optional, e.g. "en-US").
interface Options {
  query: string;
  include_adult?: boolean;
  page?: number;
  language?: string;
}

// Perform a multi-category search request to TMDB.
// This endpoint searches across multiple content types (movies, TV shows, and people)
// using a single query string.
export const getMultipleSearchsAction = async ({
  query,
  page,
  language,
}: Options): Promise<MultiSearchResponse> => {
  // Example request:
  // GET /search/multi?query=inception&language=en-US&page=1
  const { data } = await TMDBAPI.get<MultiSearchResponse>(`/search/multi`, {
    params: {
      query, // The user’s search input
      language, // Optional language filter
      page, // Pagination support
    },
  });

  // Return the API response as a new object for immutability
  return { ...data };
};
