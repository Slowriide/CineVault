import { useQuery } from "@tanstack/react-query";

import type { TrendingCategory } from "@/interfaces/MovieCategory";
import type { TimeWindow } from "@/interfaces/TimeWindow";
import { getTrendingAction } from "@/movies/api/get-trending-movies.action";

export const useTrending = (
  trendingCategory: TrendingCategory,
  timeWindow: TimeWindow = "week",
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["trending", language, trendingCategory, timeWindow],
    queryFn: () =>
      getTrendingAction({ trendingCategory, timeWindow, language }),
    staleTime: 1000 * 60 * 5,
  });
};
