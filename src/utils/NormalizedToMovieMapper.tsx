import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";

export function mapMovieDetailsToMovieDB(
  data: NormalizedMovieDetailsData,
  mediaType: "movie" | "tv"
): MovieMovieDB | TvShowMovieDB {
  if (mediaType === "movie") {
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
      popularity: 0,
      genre_ids: [],
      adult: false,
      original_language: "en", // default
      video: false, // default
      release_date: data.release_date.toString(), // obligatorio
      first_air_date: "", // no aplica para movies
    } as MovieMovieDB;
  } else {
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
      popularity: 0,
      genre_ids: [],
      adult: false,
      original_language: "en",
      first_air_date: new Date(),
      origin_country: [],
    } as TvShowMovieDB;
  }
}
