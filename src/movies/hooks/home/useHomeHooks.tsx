import { getTimeWindow } from "@/interfaces/TimeWindow";

import { getPopularMoviesAction } from "@/movies/api/get-popular-movies.action";
import { getPopularTvShowsAction } from "@/movies/api/get-popular-tvshow.action";
import { getTrendingAction } from "@/movies/api/get-trending-movies.action";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

export const useHomeHooks = () => {
  const [searchParams] = useSearchParams();

  const timeWindowM = getTimeWindow(searchParams.get("timeWindowMovie"));
  const timeWindowT = getTimeWindow(searchParams.get("timeWindowTV"));

  const queries = useQueries({
    queries: [
      {
        queryKey: ["movies", "popular"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "popular" }),
      },

      {
        queryKey: ["movies", "now_playing"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "now_playing" }),
      },

      {
        queryKey: ["movies", "top_rated"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "top_rated" }),
      },

      {
        queryKey: ["movies", "upcoming"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "upcoming" }),
      },

      {
        queryKey: ["tvShows", "popular"],
        queryFn: () => getPopularTvShowsAction({}),
      },

      {
        queryKey: ["trending", "movie", timeWindowM],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "movie",
            timeWindow: timeWindowM,
          }),
      },

      {
        queryKey: ["trending", "tv", timeWindowT],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "tv",
            timeWindow: timeWindowT,
          }),
      },

      {
        queryKey: ["featured", "movie"],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "movie",
            timeWindow: "week",
          }),
      },
    ],
  });

  const popularMovies = queries[0].data?.results ?? [];
  const nowPlayingMovies = queries[1].data?.results ?? [];
  const topRatedMovies = queries[2].data?.results ?? [];
  const upcomingMovies = queries[3].data?.results ?? [];
  const popularTVShows = queries[4].data?.results ?? [];
  const trendingMovies = queries[5].data?.results ?? [];
  const trendingTVShows = queries[6].data?.results ?? [];
  const featuredMovies = queries[7].data?.results ?? [];

  const isLoading = queries.some((q) => q.isLoading);
  const isError = queries.find((q) => q.error)?.error ?? null;

  return {
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTVShows,
    trendingMovies,
    trendingTVShows,
    featuredMovies,
    isLoading,
    isError,
  };
};
