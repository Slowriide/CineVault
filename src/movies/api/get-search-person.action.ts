import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { SearchResponse } from "@/interfaces/Searchs";

interface Options {
  query: string;
  page?: number;
  language?: string;
}

export const getSearchPersonAction = async ({
  query,
  page,
  language,
}: Options): Promise<SearchResponse> => {
  const { data } = await TMDBAPI.get<SearchResponse>(`/search/person`, {
    params: {
      query,
      page,
      language,
    },
  });

  return {
    ...data,
  };
};
