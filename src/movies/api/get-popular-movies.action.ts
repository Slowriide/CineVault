import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";
import type { MovieCategory } from "../../interfaces/MovieCategory";

// Define the options accepted by this action:
// - movieCategory: Determines which movie list to fetch (e.g., "popular", "top_rated", "upcoming").
// - page: Optional pagination index.
// - language: Optional ISO language code for localized titles and overviews.
interface Options {
  movieCategory: MovieCategory;
  page?: number;
  language?: string;
}

// Fetch a paginated list of movies from TMDB based on the selected category.
// Example endpoints:
//   - /movie/popular
//   - /movie/top_rated
//   - /movie/upcoming
export const getPopularMoviesAction = async ({
  page,
  language,
  movieCategory,
}: Options): Promise<MovieDBResponse> => {
  // Perform the GET request to TMDB using axios.
  // Pass pagination and language as query parameters.
  const { data } = await TMDBAPI.get<MovieDBResponse>(
    `/movie/${movieCategory}`,
    {
      params: {
        page,
        language,
      },
    }
  );

  // Return a shallow copy of the response object.
  // This keeps data immutable and consistent with other API actions.
  return { ...data };
};
