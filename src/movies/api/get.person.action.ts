import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Person } from "@/interfaces/Person";

/**
 * Parameters for fetching detailed information about a specific person (actor, director, etc.)
 * from The Movie Database (TMDB).
 *
 * @param personId - The TMDB ID of the person.
 * @param append_to_response - (Optional) Comma-separated list of extra resources to include.
 *   Example: "combined_credits,images" to get both credits and profile images in one call.
 * @param language - (Optional) ISO 639-1 language code (e.g. "en-US").
 */
interface Options {
  personId: string;
  append_to_response?: string;
  language?: string;
}

/**
 * Fetches detailed information about a person (actor, director, etc.) from TMDB.
 *
 * Example endpoint:
 *   GET /person/{person_id}
 *
 * If `append_to_response` is provided, the API can include additional data
 * like movie credits, TV credits, or images, reducing the need for extra requests.
 */
export const getPerson = async ({
  personId,
  append_to_response,
  language,
}: Options): Promise<Person> => {
  const { data } = await TMDBAPI.get<Person>(`/person/${personId}`, {
    params: {
      append_to_response,
      language,
    },
  });

  return data;
};
