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

  const loadingStates = {
    popular: queries[0].isLoading,
    nowPlaying: queries[1].isLoading,
    topRated: queries[2].isLoading,
    upcoming: queries[3].isLoading,
    popularTV: queries[4].isLoading,
    trendingMovies: queries[5].isLoading,
    trendingTV: queries[6].isLoading,
    featured: queries[7].isLoading,
  };
  const errorStates = {
    popular: queries[0].isError,
    nowPlaying: queries[1].isError,
    topRated: queries[2].isLoading,
    upcoming: queries[3].isError,
    popularTV: queries[4].isError,
    trendingMovies: queries[5].isError,
    trendingTV: queries[6].isError,
    featured: queries[7].isError,
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
