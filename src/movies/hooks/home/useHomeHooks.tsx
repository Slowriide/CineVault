import { getTimeWindow } from "@/interfaces/TimeWindow";
import { getPopularMoviesAction } from "@/movies/api/get-popular-movies.action";
import { getPopularTvShowsAction } from "@/movies/api/get-popular-tvshow.action";
import { getTrendingAction } from "@/movies/api/get-trending-movies.action";
import { useQueries } from "@tanstack/react-query";
import { useSearchParams } from "react-router";

/**
 * useHomeHooks
 *
 * Custom hook to fetch all home page data including:
 * - Featured movies
 * - Trending movies & TV shows
 * - Popular movies & TV shows
 * - Now playing, top rated, and upcoming movies
 *
 * Utilizes React Query's useQueries for parallel data fetching.
 * Supports query-based time windows for trending items.
 *
 * Returns structured data, loading states, and error states for UI consumption.
 */
export const useHomeHooks = () => {
  const [searchParams] = useSearchParams();

  // Get time window params from URL query for trending movies/TV shows
  const timeWindowM = getTimeWindow(searchParams.get("timeWindowMovie"));
  const timeWindowT = getTimeWindow(searchParams.get("timeWindowTV"));

  // Execute multiple queries in parallel using useQueries
  const queries = useQueries({
    queries: [
      // PRIORITY 1: Featured movies (top trending movies of the week)
      {
        queryKey: ["featured", "movie"],
        queryFn: () =>
          getTrendingAction({
            trendingCategory: "movie",
            timeWindow: "week",
          }),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
      },

      // PRIORITY 2: Trending movies (based on selected time window)
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

      // Trending TV shows (based on selected time window)
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

      // PRIORITY 3: Below the fold content (popular movies)
      {
        queryKey: ["movies", "popular"],
        queryFn: () => getPopularMoviesAction({ movieCategory: "popular" }),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
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

      // Popular TV shows
      {
        queryKey: ["tvShows", "popular"],
        queryFn: () => getPopularTvShowsAction({}),
        staleTime: 10 * 60 * 1000,
        gcTime: 30 * 60 * 1000,
      },
    ],
  });

  // Extract results for easier consumption
  const featuredMovies = queries[0].data?.results ?? [];
  const trendingMovies = queries[1].data?.results ?? [];
  const trendingTVShows = queries[2].data?.results ?? [];
  const popularMovies = queries[3].data?.results ?? [];
  const nowPlayingMovies = queries[4].data?.results ?? [];
  const topRatedMovies = queries[5].data?.results ?? [];
  const upcomingMovies = queries[6].data?.results ?? [];
  const popularTVShows = queries[7].data?.results ?? [];

  // Aggregate loading states
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

  // Aggregate error states
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

  // Determine if all queries failed (critical error)
  const allErrors = queries.every((q) => q.isError);
  const hasError = queries.some((q) => q.isError);
  const isLoading = queries.some((q) => q.isLoading);

  return {
    // Movie and TV data
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTVShows,
    trendingMovies,
    trendingTVShows,
    featuredMovies,
    isLoading,

    // Loading states per section
    loadingStates,

    // Error handling
    isError: allErrors ? queries[0].error : null, // critical error
    errorStates, // individual errors
    hasPartialError: hasError, // true if some queries failed
  };
};
