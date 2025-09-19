import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

export function SupabaseToMovieMapper(fav: any): MovieMovieDB | TvShowMovieDB {
  const meta = fav.metadata;

  const item = {
    id: Number(fav.movie_id),
    media_type: fav.media_type as "movie" | "tv",
    title: meta.title || "",
    poster_path: (meta as any).poster_path || "",
    vote_average: (meta as any).vote_average || 0,
    release_date: (meta as any).release_date || "",
    overview: (meta as any).overview || "",
    vote_count: (meta as any).vote_count || 0,
    popularity: (meta as any).popularity || 0,
    adult: false,
    backdrop_path: "",
    genre_ids: [],
    original_language: "en",
    video: false,
    name: (meta as any).title || "",
    first_air_date: (meta as any).release_date || "",
    original_name: (meta as any).title || "",
    original_title: (meta as any).title || "",
  } as MovieMovieDB | TvShowMovieDB;

  return item;
}
