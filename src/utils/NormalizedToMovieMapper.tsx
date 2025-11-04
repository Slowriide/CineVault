import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";

/**
 * Maps normalized movie/TV show details to the TMDB-like MovieDB interface.
 *
 * @param data - The normalized movie details
 * @param mediaType - "movie" or "tv"
 * @returns A MovieMovieDB or TvShowMovieDB object
 */
export function mapMovieDetailsToMovieDB(
  data: NormalizedMovieDetailsData,
  mediaType: "movie" | "tv"
): MovieMovieDB | TvShowMovieDB {
  if (mediaType === "movie") {
    // Mapping for movies
    return {
      id: data.id,
      media_type: "movie",
      title: data.title,
      original_title: data.title,
      name: data.title,
      original_name: data.title,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      popularity: 0, // default placeholder
      genre_ids: [], // empty array as placeholder
      adult: false, // default value
      original_language: "en", // default
      video: false, // default
      release_date: data.release_date?.toString() ?? "", // ensure string
      first_air_date: "", // not applicable for movies
    } as MovieMovieDB;
  } else {
    // Mapping for TV shows
    return {
      id: data.id,
      media_type: "tv",
      title: data.title,
      original_title: data.title,
      name: data.title,
      original_name: data.title,
      poster_path: data.poster_path,
      backdrop_path: data.backdrop_path,
      overview: data.overview,
      vote_average: data.vote_average,
      vote_count: data.vote_count,
      popularity: 0, // placeholder
      genre_ids: [], // placeholder
      adult: false, // default
      original_language: "en",
      first_air_date: data.release_date?.toString() ?? "", // required field for TV shows
      origin_country: [], // TV-specific field
    } as TvShowMovieDB;
  }
}
