import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TrendingCategory } from "@/interfaces/MovieCategory";
import type { MovieDBResponse } from "@/interfaces/MovieDB.response";
import type { TimeWindow } from "@/interfaces/TimeWindow";

/**
 * Options for fetching trending content.
 *
 * @param trendingCategory - The type of media to fetch (e.g. "movie", "tv", or "all").
 * @param timeWindow - The trending time period ("day" or "week").
 * @param language - Optional ISO 639-1 language code (e.g. "en-US").
 */
interface Options {
  trendingCategory: TrendingCategory;
  timeWindow: TimeWindow;
  language?: string;
}

/**
 * Fetches trending movies or TV shows from TMDB.
 *
 * Endpoint examples:
 * - `/trending/movie/day`   → Trending movies today
 * - `/trending/tv/week`     → Trending TV shows this week
 *
 * @returns A paginated list of trending media items.
 */
export const getTrendingAction = async ({
  trendingCategory,
  timeWindow,
  language,
}: Options): Promise<MovieDBResponse> => {
  const { data } = await TMDBAPI.get<MovieDBResponse>(
    `/trending/${trendingCategory}/${timeWindow}`,
    {
      params: { language },
    }
  );

  return { ...data };
};
