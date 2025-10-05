import type { Json } from "@/integrations/supabase/supabase";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

export interface SupabaseMovie {
  created_at: string | null;
  id: number | string;
  media_type: string | null;
  metadata: Json;
  movie_id: string;
  user_id: string;
}

interface MetadataMovie {
  title?: string;
  name?: string;
  poster_path?: string;
  vote_average?: number;
  release_date?: string;
  overview?: string;
  vote_count?: number;
  popularity?: number;
}

export function SupabaseToMovieMapper(
  fav: SupabaseMovie
): MovieMovieDB | TvShowMovieDB {
  const meta = fav.metadata as MetadataMovie;

  const item = {
    id: Number(fav.movie_id),
    media_type: fav.media_type as "movie" | "tv",
    title: meta?.title || meta?.name || "",
    poster_path: (meta as any).poster_path || "",
    vote_average: (meta as any).vote_average || 0,
    release_date: meta.release_date || "",
    overview: (meta as any).overview || "",
    vote_count: (meta as any).vote_count || 0,
    popularity: (meta as any).popularity || 0,
    adult: false,
    backdrop_path: "",
    genre_ids: [],
    original_language: "en",
    video: false,
    name: meta.name || meta.title || "",
    first_air_date: meta.release_date || "",
    original_name: (meta as any).title || "",
    original_title: (meta as any).title || "",
  } as MovieMovieDB | TvShowMovieDB;

  return item;
}
