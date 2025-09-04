import { useEffect, useState } from "react";
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
import { CustomLoading } from "@/components/custom/CustomLoading";
import { SectionCarrusel } from "../components/SectionCarrusel";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams() || "";

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
  const { data: featuredMovieData } = useTrending("movie", "week");
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
  const featuredMovies = featuredMovieData?.results;
  const trendingTVShow = trendingTVShowData?.results;

  const [featuredMovie, setFeaturedMovie] = useState<
    MovieMovieDB | TvShowMovieDB
  >();

  useEffect(() => {
    if (featuredMovies && featuredMovies.length > 0) {
      const randomIndex = Math.floor(
        Math.random() * Math.min(5, featuredMovies.length)
      );
      setFeaturedMovie(featuredMovies[randomIndex]);
    }
  }, [featuredMovies]);

  if (
    loadingPopular ||
    loadingNow ||
    loadingTop ||
    loadingUpcoming ||
    loadingPpopularTvShows ||
    loadingTrendingTVShow
  ) {
    return <CustomLoading />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero ">
      {/* Hero Section */}
      <HeroSection featuredMovie={featuredMovie!} />

      {/* Content Sections */}
      <div className="max-w-[1600px] mx-auto py-12 space-y-12">
        {/* Trending Movies */}
        <SectionCarrusel
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
          error={errorTrendingMovies}
        />

        {/* Trending TV shows */}
        <SectionCarrusel
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
          title=""
          items={trendingTVShow ?? []}
          mediaType="tv"
          loading={loadingTrendingTVShow}
          error={errorTrendingTVShow}
        />
        {/* Popular Movies */}
        <SectionCarrusel
          title={"Popular Movies"}
          items={popularMovies ?? []}
          loading={loadingPopular}
          mediaType={"movie"}
          error={errorPopular}
        />

        <SectionCarrusel
          title={"Now Playing"}
          items={nowPlayingMovies ?? []}
          loading={loadingNow}
          mediaType={"movie"}
          error={errorNow}
        />

        {/* Popular TV Shows */}
        <SectionCarrusel
          title={"Top TV Shows"}
          items={popularTVShows ?? []}
          mediaType={"tv"}
          loading={loadingPpopularTvShows}
          error={errorPopularTvShows}
        />

        {/* Top Rated Movies */}
        <SectionCarrusel
          title={"Top Rated Movies"}
          items={topRatedMovies ?? []}
          mediaType={"movie"}
          loading={loadingTop}
          error={errorTop}
        />

        {/* Upcoming Movies */}
        <SectionCarrusel
          title={"Upcoming Movies"}
          items={upcomingMovies ?? []}
          mediaType={"movie"}
          loading={loadingUpcoming}
          error={errorUpcoming}
        />
      </div>
    </div>
  );
};
