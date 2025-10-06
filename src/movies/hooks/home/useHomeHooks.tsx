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
      // PRIORITY 1: Featured
      {
        queryKey: ["featured", "movie"],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "movie",
            timeWindow: "week",
          }),
        staleTime: 5 * 60 * 1000, // 5 min
        gcTime: 10 * 60 * 1000, // 10 min
      },

      // PRIORITY 2: Trending (above the fold)
      {
        queryKey: ["trending", "movie", timeWindowM],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "movie",
            timeWindow: timeWindowM,
          }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },

      {
        queryKey: ["trending", "tv", timeWindowT],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "tv",
            timeWindow: timeWindowT,
          }),
        staleTime: 5 * 60 * 1000,
        gcTime: 10 * 60 * 1000,
      },

      // PRIORITY 3: (below the fold - can wait)
      {
        queryKey: ["movies", "popular"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "popular" }),
        staleTime: 10 * 60 * 1000, // 10 min
        gcTime: 30 * 60 * 1000, // 30 min
        // Defer: espera a que las críticas terminen
        enabled: true,
      },

      {
        queryKey: ["movies", "now_playing"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "now_playing" }),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      },

      {
        queryKey: ["movies", "top_rated"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "top_rated" }),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      },

      {
        queryKey: ["movies", "upcoming"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "upcoming" }),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      },

      {
        queryKey: ["tvShows", "popular"],
        queryFn: () => getPopularTvShowsAction({}),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      },
    ],
  });

  const featuredMovies = queries[0].data?.results ?? [];
  const trendingMovies = queries[1].data?.results ?? [];
  const trendingTVShows = queries[2].data?.results ?? [];
  const popularMovies = queries[3].data?.results ?? [];
  const nowPlayingMovies = queries[4].data?.results ?? [];
  const topRatedMovies = queries[5].data?.results ?? [];
  const upcomingMovies = queries[6].data?.results ?? [];
  const popularTVShows = queries[7].data?.results ?? [];

  const loadingStates = {
    featured: queries[0].isLoading,
    trendingMovies: queries[1].isLoading,
    trendingTV: queries[2].isLoading,
    popular: queries[3].isLoading,
    nowPlaying: queries[4].isLoading,
    topRated: queries[5].isLoading,
    upcoming: queries[6].isLoading,
    popularTV: queries[7].isLoading,
  };
  const errorStates = {
    featured: queries[0].isError,
    trendingMovies: queries[1].isError,
    trendingTV: queries[2].isError,
    popular: queries[3].isError,
    nowPlaying: queries[4].isError,
    topRated: queries[5].isError,
    upcoming: queries[6].isError,
    popularTV: queries[7].isError,
  };

  // Error crítico: si TODAS las queries fallan
  const allErrors = queries.every((q) => q.isError);
  const hasError = queries.some((q) => q.isError);
  const isLoading = queries.some((q) => q.isLoading);

  return {
    //Movies
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTVShows,
    trendingMovies,
    trendingTVShows,
    featuredMovies,
    isLoading,

    //Loading
    loadingStates,

    //Errors
    isError: allErrors ? queries[0].error : null,
    errorStates,
    hasPartialError: hasError,
  };
};
