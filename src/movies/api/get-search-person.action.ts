import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { SearchResponse } from "@/interfaces/Searchs";

// Define the expected parameters for the person search action:
// - query: The name or keyword to search for (required).
// - page: Optional pagination number (default is 1 in TMDB).
// - language: Optional ISO language code (e.g., "en-US") for localized results.
interface Options {
  query: string;
  page?: number;
  language?: string;
}

// Perform a search request to TMDB for people (actors, directors, etc.).
// Example: GET /search/person?query=tom+hanks&language=en-US&page=1
export const getSearchPersonAction = async ({
  query,
  page,
  language,
}: Options): Promise<SearchResponse> => {
  // Send a GET request to the TMDB search/person endpoint.
  const { data } = await TMDBAPI.get<SearchResponse>(`/search/person`, {
    params: {
      query, // The text to search for (required)
      page, // Optional page number for pagination
      language, // Optional localization for names and descriptions
    },
  });

  // Return the data as a shallow copy to ensure immutability and consistency
  return { ...data };
};
