import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

export function FavoriteToMovieMapper(fav: any): MovieMovieDB | TvShowMovieDB {
  const meta = fav.metadata;

  const item = {
    id: Number(fav.movie_id),
    media_type: fav.media_type as "movie" | "tv",
    title: meta.title || "",
    poster_path: meta.poster_path || "",
    vote_average: meta.vote_average || 0,
    release_date: meta.release_date || "",
    adult: false,
    backdrop_path: "",
    genre_ids: [],
    original_language: "en",
    overview: meta.overview || "",
    video: false,
    vote_count: meta.vote_count || 0,
    popularity: meta.popularity || 0,
    name: meta.title || "",
    first_air_date: meta.release_date || "",
    original_name: meta.title || "",
    original_title: meta.title || "",
  } as MovieMovieDB | TvShowMovieDB;

  return item;
}
