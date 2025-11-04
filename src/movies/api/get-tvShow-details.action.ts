import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TVShowDetails } from "@/interfaces/TVShowDetails";

/**
 * Parameters for fetching detailed information about a TV show.
 *
 * @param id - The TMDB ID of the TV show.
 * @param language - (Optional) ISO 639-1 language code (e.g. "en-US", "es-ES").
 */
interface Options {
  id: string;
  language?: string;
}

/**
 * Fetches detailed information about a specific TV show from TMDB.
 *
 * Example endpoint:
 *  - `/tv/{id}`
 *
 * The response typically includes metadata such as title, overview, genres,
 * seasons, cast information, and more.
 */
export const getTvShowDetails = async ({
  id,
  language,
}: Options): Promise<TVShowDetails> => {
  const { data } = await TMDBAPI.get<TVShowDetails>(`/tv/${id}`, {
    params: { language },
  });

  return { ...data };
};
