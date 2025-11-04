import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { slugify } from "./slugify";

/**
 * Normalizes a credit object to ensure fallback values for images and origin_country.
 * Useful when rendering credits where some fields may be missing.
 *
 * @param credit - The raw credit object
 * @returns A normalized credit with default paths and origin_country array
 */
export function normalizeCredit(credit: any) {
  return {
    ...credit,
    backdrop_path: credit.backdrop_path ?? "assets/placeholder.svg", // fallback backdrop
    poster_path: credit.poster_path ?? "assets/placeholder.svg", // fallback poster
    origin_country:
      "origin_country" in credit
        ? Array.isArray(credit.origin_country)
          ? credit.origin_country
          : [credit.origin_country] // ensure origin_country is always an array
        : [],
  };
}

/**
 * Returns the top-rated or worst-rated movie/TV show from a list of credits.
 *
 * @param credits - Array of MovieMovieDB or TvShowMovieDB
 * @param type - "best" to get top-rated, "worst" to get lowest-rated
 * @returns The selected movie/TV show or undefined if list is empty
 */
export function getRatedMovie(
  credits: (MovieMovieDB | TvShowMovieDB)[],
  type: "best" | "worst"
) {
  if (credits.length === 0) return undefined;

  // Sort by vote_average in ascending or descending order based on type
  const sorted = [...credits].sort((a, b) =>
    type === "best"
      ? b.vote_average - a.vote_average
      : a.vote_average - b.vote_average
  );

  return sorted[0]; // return the first item (best or worst)
}

/**
 * Extracts key display details from a movie or TV show.
 * Returns title, release year, and a link for navigation.
 *
 * @param item - MovieMovieDB or TvShowMovieDB object
 * @returns An object with { title, year, link } or undefined if no item provided
 */
export function getMovieDetails(
  item: MovieMovieDB | TvShowMovieDB | undefined
) {
  if (!item) return undefined;

  const isMovie = "title" in item;

  return {
    // Use 'title' for movies, 'name' for TV shows
    title: isMovie ? item.title : item.name,

    // Extract the release year
    year: isMovie
      ? new Date(item.release_date ?? "").getFullYear()
      : new Date(item.first_air_date ?? "").getFullYear(),

    // Generate URL slug for navigation
    link: isMovie
      ? `/movie/${slugify(item.title, item.id)}`
      : `/tv/${slugify(item.name, item.id)}`,
  };
}
