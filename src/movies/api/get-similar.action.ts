import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Type } from "@/interfaces/MovieCategory";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

// Defines a reusable type for paginated TMDB responses.
// The "results" field can contain either movies or TV shows depending on the request type.
export interface PaginatedResponse {
  page: number;
  results: MovieMovieDB[] | TvShowMovieDB[];
  total_pages: number;
  total_results: number;
}

// Request parameters for fetching similar items from TMDB.
// - id: The movie or TV show ID to find similar content for.
// - type: Determines whether to request from the "movie" or "tv" endpoint.
// - page: Optional pagination (default = 1).
// - language: Optional language for localized titles and descriptions.
interface Options {
  id: string;
  type: Type;
  page?: number;
  language?: string;
}

// Fetches similar movies or TV shows using TMDB’s /{type}/{id}/similar endpoint.
// Example: GET /movie/603/similar or /tv/1399/similar
export const getSimilar = async ({
  id,
  type,
  page,
  language,
}: Options): Promise<PaginatedResponse> => {
  const { data } = await TMDBAPI.get<PaginatedResponse>(
    `/${type}/${id}/similar`,
    {
      params: {
        language,
        page,
      },
    }
  );

  // Return a shallow copy of the response to ensure immutability
  return { ...data };
};
