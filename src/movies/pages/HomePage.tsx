import { useEffect, useState } from "react";
import { HeroSection } from "../components/home/HeroSection";
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
import { useHomeHooks } from "../hooks/home/useHomeHooks";

export const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const timeWindowM = getTimeWindow(searchParams.get("timeWindowMovie"));
  const timeWindowT = getTimeWindow(searchParams.get("timeWindowTV"));

  const {
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
  } = useHomeHooks();

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

  if (isLoading) {
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
          loading={isLoading}
          title={""}
          error={isError}
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
          items={trendingTVShows ?? []}
          mediaType="tv"
        />
        {/* Popular Movies */}
        <SectionCarrusel
          title={"Popular Movies"}
          items={popularMovies ?? []}
          mediaType={"movie"}
        />

        <SectionCarrusel
          title={"Now Playing"}
          items={nowPlayingMovies ?? []}
          mediaType={"movie"}
        />

        {/* Popular TV Shows */}
        <SectionCarrusel
          title={"Top TV Shows"}
          items={popularTVShows ?? []}
          mediaType={"tv"}
        />

        {/* Top Rated Movies */}
        <SectionCarrusel
          title={"Top Rated Movies"}
          items={topRatedMovies ?? []}
          mediaType={"movie"}
        />

        {/* Upcoming Movies */}
        <SectionCarrusel
          title={"Upcoming Movies"}
          items={upcomingMovies ?? []}
          mediaType={"movie"}
        />
      </div>
    </div>
  );
};
