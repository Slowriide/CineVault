import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Person } from "@/interfaces/Person";

interface Options {
  personId: string;
  append_to_response?: string;
  language?: string;
}

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
