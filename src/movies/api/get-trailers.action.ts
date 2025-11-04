import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TrailerResponse } from "@/interfaces/Trailers";
import type { Type } from "@/interfaces/MovieCategory";

/**
 * Parameters for fetching trailers or videos.
 * @param language Optional language code (e.g., "en-US", "es-ES").
 * @param type Either "movie" or "tv".
 * @param id The TMDB ID of the item.
 */
interface Options {
  language?: string;
  type: Type;
  id: string;
}

/**
 * Fetches trailers, teasers, and video clips for a movie or TV show from TMDB.
 * Example endpoints:
 * - /movie/{id}/videos
 * - /tv/{id}/videos
 *
 * Returns all available video metadata (YouTube keys, names, types, etc.).
 */
export const getTrailersAction = async ({
  language,
  type,
  id,
}: Options): Promise<TrailerResponse> => {
  const { data } = await TMDBAPI.get<TrailerResponse>(`/${type}/${id}/videos`, {
    params: { language },
  });

  return { ...data };
};
