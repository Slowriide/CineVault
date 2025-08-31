import { useQuery } from "@tanstack/react-query";
import { getTrendingAction } from "../api/get-trending-movies.action";
import type { TrendingCategory } from "@/interfaces/MovieCategory";
import type { TimeWindow } from "@/interfaces/TimeWindow";

export const useTrending = (
  trendingCategory: TrendingCategory,
  timeWindow: TimeWindow = "week",
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["trending", language, trendingCategory, timeWindow],
    queryFn: () =>
      getTrendingAction({ trendingCategory, timeWindow, language }),
  });
};
