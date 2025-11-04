import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Type } from "@/interfaces/MovieCategory";
import type { ReviewsResponse } from "@/interfaces/MovieReviews";

// Define accepted parameters for fetching reviews:
// - id: The unique TMDB ID of the movie or TV show.
// - type: Content type ("movie" or "tv") — determines which endpoint to hit.
// - page: Optional pagination index for large result sets.
// - language: Optional ISO language code for localized reviews.
interface Options {
  id: number;
  type: Type;
  page?: number;
  language?: string;
}

// Fetch paginated user reviews for a movie or TV show from TMDB.
// Example request: GET /movie/550/reviews?language=en-US&page=2
export const getReviewsAction = async ({
  id,
  type,
  page,
  language,
}: Options): Promise<ReviewsResponse> => {
  // Perform the GET request to the correct TMDB endpoint.
  // Using the "type" parameter allows this function to work for both movies and TV shows.
  const { data } = await TMDBAPI.get<ReviewsResponse>(
    `/${type}/${id}/reviews`,
    {
      params: {
        page, // Optional pagination support.
        language, // Optional localization parameter.
      },
    }
  );

  // Return a shallow copy of the API response for immutability and consistency.
  return { ...data };
};
