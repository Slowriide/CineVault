import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TrendingCategory } from "@/interfaces/MovieCategory";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";
import type { TimeWindow } from "@/interfaces/TimeWindow";

interface Options {
  trendingCategory: TrendingCategory;
  timeWindow: TimeWindow;
  language?: string;
}

export const getTrendingAction = async ({
  trendingCategory,
  timeWindow,
  language,
}: Options): Promise<MovieDBResponse> => {
  const { data } = await TMDBAPI.get<MovieDBResponse>(
    `/trending/${trendingCategory}/${timeWindow}`,
    {
      params: {
        language,
      },
    }
  );

  return {
    ...data,
  };
};
