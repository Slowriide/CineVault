import { TMDBAPI } from "@/api/TheMovieDBApi";

import type { MultiSearchResponse } from "@/interfaces/SearchResponse";

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
}: Options): Promise<MultiSearchResponse> => {
  const { data } = await TMDBAPI.get<MultiSearchResponse>(`/search/multi`, {
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
