import type { Json } from "@/integrations/supabase/supabase";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

/**
 * SupabaseMovie represents a movie record stored in Supabase
 */
export interface SupabaseMovie {
  created_at: string | null;
  id: number | string;
  media_type: string | null;
  metadata: Json; // JSON object containing movie or TV show details
  movie_id: string;
  user_id: string;
}

/**
 * Metadata structure inside SupabaseMovie.metadata
 */
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

/**
 * Maps a SupabaseMovie to a normalized MovieMovieDB or TvShowMovieDB object
 */
export function SupabaseToMovieMapper(
  fav: SupabaseMovie
): MovieMovieDB | TvShowMovieDB {
  const meta = fav.metadata as MetadataMovie;

  // Construct a MovieMovieDB or TvShowMovieDB object using metadata
  const item = {
    id: Number(fav.movie_id), // Convert movie_id to number
    media_type: fav.media_type as "movie" | "tv", // Force type
    title: meta?.title || meta?.name || "", // Prefer title, fallback to name
    poster_path: (meta as any).poster_path || "",
    vote_average: (meta as any).vote_average || 0,
    release_date: meta.release_date || "",
    overview: (meta as any).overview || "",
    vote_count: (meta as any).vote_count || 0,
    popularity: (meta as any).popularity || 0,
    adult: false, // Default value
    backdrop_path: "",
    genre_ids: [],
    original_language: "en",
    video: false,
    name: meta.name || meta.title || "", // Name fallback
    first_air_date: meta.release_date || "",
    original_name: (meta as any).title || "",
    original_title: (meta as any).title || "",
  } as MovieMovieDB | TvShowMovieDB;

  return item;
}
