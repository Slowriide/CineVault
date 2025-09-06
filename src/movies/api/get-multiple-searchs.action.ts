import { TMDBAPI } from "@/api/TheMovieDBApi";

import type { SearchResponse } from "@/interfaces/SearchResponse";

interface Options {
  query: string;
  include_adult?: boolean;
  page?: number;
  language?: string;
}

export const getMultipleSearchsAction = async ({
  query,
  page,
  language,
}: Options): Promise<SearchResponse> => {
  const { data } = await TMDBAPI.get<SearchResponse>(`/search/multi`, {
    params: {
      query,
      language,
      page,
    },
  });

  return {
    ...data,
  };
};
