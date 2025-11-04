import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { MovieDetails } from "@/interfaces/MovieDetails";

// Define the expected parameters for fetching movie details:
// - id: TMDB movie ID
// - language (optional): ISO language code (e.g., "en-US") for localized results
interface Options {
  id: string;
  language?: string;
}

// Fetch detailed information for a specific movie from TMDB.
// Returns a strongly typed MovieDetails object.
export const getMovieDetails = async ({
  id,
  language,
}: Options): Promise<MovieDetails> => {
  // Send a GET request to TMDB’s /movie/:id endpoint.
  // Example request: /movie/550?language=en-US
  const { data } = await TMDBAPI.get<MovieDetails>(`/movie/${id}`, {
    params: {
      language, // Optional query parameter to localize title, overview, etc.
    },
  });

  // Return the full data object.
  // Spreading ensures it’s a shallow copy, keeping it immutable by convention.
  return { ...data };
};
