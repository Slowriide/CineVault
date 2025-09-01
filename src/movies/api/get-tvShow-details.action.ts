import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TVShowDetails } from "@/interfaces/TVShowDetails";

interface Options {
  id: string;
  language?: string;
}

export const getTvShowDetails = async ({
  id,
  language,
}: Options): Promise<TVShowDetails> => {
  const { data } = await TMDBAPI.get<TVShowDetails>(`/tv/${id}`, {
    params: {
      language,
    },
  });

  return { ...data };
};
