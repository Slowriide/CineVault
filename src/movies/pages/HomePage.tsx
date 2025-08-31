import { useEffect, useState } from "react";
import { Carousel } from "../components/Carousel";
import { HeroSection } from "../components/HeroSection";
import { useMovies } from "../hooks/usePopularMovies";
import { usePopularTvShows } from "../hooks/usePopularTvShows";
import { useTrending } from "../hooks/useTrending";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSearchParams } from "react-router";
import { getTimeWindow } from "@/interfaces/TimeWindow";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeWindowM = getTimeWindow(searchParams.get("timeWindowMovie"));
  const timeWindowT = getTimeWindow(searchParams.get("timeWindowTV"));

  const {
    data: popularData,
    isLoading: loadingPopular,
    error: errorPopular,
  } = useMovies("popular");
  const {
    data: nowPlayingData,
    isLoading: loadingNow,
    error: errorNow,
  } = useMovies("now_playing");
  const {
    data: topRatedData,
    isLoading: loadingTop,
    error: errorTop,
  } = useMovies("top_rated");
  const {
    data: upcomingMoviesData,
    isLoading: loadingUpcoming,
    error: errorUpcoming,
  } = useMovies("upcoming");
  const {
    data: popularTvShowsData,
    isLoading: loadingPpopularTvShows,
    error: errorPopularTvShows,
  } = usePopularTvShows();
  const {
    data: trendingMoviesData,
    isLoading: loadingTrendingMovies,
    error: errorTrendingMovies,
  } = useTrending("movie", timeWindowM);
  const {
    data: trendingTVShowData,
    isLoading: loadingTrendingTVShow,
    error: errorTrendingTVShow,
  } = useTrending("tv", timeWindowT);

  const popularMovies = popularData?.results;
  const nowPlayingMovies = nowPlayingData?.results;
  const topRatedMovies = topRatedData?.results;
  const upcomingMovies = upcomingMoviesData?.results;
  const popularTVShows = popularTvShowsData?.results;
  const trendingMovies = trendingMoviesData?.results;
  const trendingTVShow = trendingTVShowData?.results;

  const [featuredMovie, setFeaturedMovie] = useState<
    MovieMovieDB | TvShowMovieDB
  >();

  useEffect(() => {
    if (trendingMovies && trendingMovies.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, trendingMovies.length)
      );
      setFeaturedMovie(trendingMovies[randomIndex]);
    }
  }, [trendingMovies]);

  if (
    loadingPopular ||
    loadingNow ||
    loadingTop ||
    loadingUpcoming ||
    loadingPpopularTvShows ||
    loadingTrendingTVShow
  ) {
    return <p>Cargando...</p>;
  }

  return (
    <div className="min-h-screen bg-gradient-hero ">
      {/* Hero Section */}
      <HeroSection featuredMovie={featuredMovie!} />

      {/* Content Sections */}
      <div className="max-w-[1600px] mx-auto py-12 space-y-12">
        {/* Trending Movies */}
        {errorTrendingMovies ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            header={
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">Trending Movies</h2>
                <Select
                  value={timeWindowM}
                  onValueChange={(value: "day" | "week") => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set("timeWindowMovie", value);
                      return newParams;
                    });
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            items={trendingMovies ?? []}
            mediaType="movie"
            loading={loadingTrendingMovies}
            title={""}
          />
        )}
        {/* Trending TV shows */}
        {errorTrendingTVShow ? (
          <p className="text-red-500">Error loading TV shows</p>
        ) : (
          <Carousel
            header={
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold">Trending TV Shows</h2>
                <Select
                  value={timeWindowT}
                  onValueChange={(value: "day" | "week") => {
                    setSearchParams((prev) => {
                      const newParams = new URLSearchParams(prev);
                      newParams.set("timeWindowTV", value);
                      return newParams;
                    });
                  }}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Time Window" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            }
            title="Trending TV Shows This Week"
            items={trendingTVShow ?? []}
            mediaType="tv"
            loading={loadingTrendingTVShow}
          />
        )}
        {/* Popular Movies */}
        {errorPopular ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            title="Popular Movies"
            items={popularMovies ?? []}
            mediaType="movie"
            loading={loadingPopular}
          />
        )}
        {errorNow ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            title="Now Playing"
            items={nowPlayingMovies ?? []}
            mediaType="movie"
            loading={loadingNow}
          />
        )}
        {/* Popular TV Shows */}
        {errorPopularTvShows ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            title="Top TV Shows"
            items={popularTVShows ?? []}
            mediaType="tv"
            loading={loadingPpopularTvShows}
          />
        )}
        {/* Top Rated Movies */}
        {errorTop ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            title="Top Rated Movies"
            items={topRatedMovies ?? []}
            mediaType="movie"
            loading={loadingTop}
          />
        )}
        {/* Upcoming Movies */}
        {errorUpcoming ? (
          <p className="text-red-500">Error loading movies</p>
        ) : (
          <Carousel
            title="Upcoming Movies"
            items={upcomingMovies ?? []}
            mediaType="movie"
            loading={loadingUpcoming}
          />
        )}
      </div>
    </div>
  );
};
