import { HeroSection } from "../components/home/HeroSection";
import { useSearchParams } from "react-router";
import { getTimeWindow } from "@/interfaces/TimeWindow";
import { useHomeHooks } from "../hooks/home/useHomeHooks";
import { CustomError } from "@/components/custom/CustomError";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { TimeWindowSelect } from "../components/home/TimeWindowSelect";
import { SectionCarrusel } from "../components/home/SectionCarrusel";
import { LazySection } from "../components/home/LazySection";
import { useMemo } from "react";

export const HomePage = () => {
  // Read URL query params (used for time window selections)
  const [searchParams, setSearchParams] = useSearchParams();

  // Get time window selection from URL, fallback to default
  const timeWindowM = getTimeWindow(searchParams.get("timeWindowMovie"));
  const timeWindowT = getTimeWindow(searchParams.get("timeWindowTV"));

  // Memoized function to update query params without refreshing the page
  const updateTimeWindow = useMemo(
    () => (key: string, value: string) => {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        newParams.set(key, value);
        return newParams;
      });
    },
    [setSearchParams]
  );

  // Fetch all the home page data (movies, TV shows, trending, featured) using a custom hook
  const {
    popularMovies,
    nowPlayingMovies,
    topRatedMovies,
    upcomingMovies,
    popularTVShows,
    trendingMovies,
    trendingTVShows,
    featuredMovies,
    loadingStates,
    isError,
    hasPartialError,
    errorStates,
  } = useHomeHooks();

  // Pick a featured movie to show in the hero section (randomly picking from first 5)
  const featuredMovie = useMemo(() => {
    if (!featuredMovies?.length) return undefined;
    return featuredMovies[Math.floor(Math.min(5, featuredMovies.length))];
  }, [featuredMovies]);

  // If the main data fetching fails completely, show a full-page error
  if (isError) {
    return (
      <CustomError
        title="Service Unavailable"
        message="Unable to load content. Please try again later."
        action={{ to: "/", label: "Refresh" }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero ">
      {/* Hero Section - displays featured movie prominently */}
      <HeroSection
        featuredMovie={featuredMovie}
        isLoading={loadingStates.featured}
      />

      {/* Main content sections */}
      <div className="max-w-[1600px] mx-auto py-12 space-y-12 px-4">
        {/* Partial error alert */}
        {hasPartialError && (
          <Alert variant="destructive" className="mb-8">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Some content couldn't be loaded. Showing available content.
            </AlertDescription>
          </Alert>
        )}

        {/* Trending Movies Section */}
        <SectionCarrusel
          header={
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold">Trending Movies</h2>
              {/* Time Window selector */}
              <TimeWindowSelect
                value={timeWindowM}
                onValueChange={(value) =>
                  updateTimeWindow("timeWindowMovie", value)
                }
              />
            </div>
          }
          items={trendingMovies}
          mediaType="movie"
          loading={loadingStates.trendingMovies}
          title={""}
          error={errorStates.trendingMovies}
        />

        {/* Trending TV Shows Section */}
        <SectionCarrusel
          header={
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold">Trending TV Shows</h2>
              <TimeWindowSelect
                value={timeWindowT}
                onValueChange={(value) =>
                  updateTimeWindow("timeWindowTV", value)
                }
              />
            </div>
          }
          title=""
          items={trendingTVShows}
          mediaType="tv"
          loading={loadingStates.trendingTV}
          error={errorStates.trendingTV}
        />

        {/* Below-the-fold sections are lazily loaded for performance */}
        <LazySection>
          <SectionCarrusel
            title={"Popular Movies"}
            items={popularMovies}
            mediaType={"movie"}
            loading={loadingStates.popular}
            error={errorStates.popular}
          />
        </LazySection>

        <LazySection>
          <SectionCarrusel
            title={"Now Playing"}
            items={nowPlayingMovies}
            mediaType={"movie"}
            loading={loadingStates.nowPlaying}
            error={errorStates.nowPlaying}
          />
        </LazySection>

        <LazySection>
          <SectionCarrusel
            title={"Top TV Shows"}
            items={popularTVShows}
            mediaType={"tv"}
            loading={loadingStates.popularTV}
            error={errorStates.popularTV}
          />
        </LazySection>

        <LazySection>
          <SectionCarrusel
            title={"Top Rated Movies"}
            items={topRatedMovies}
            mediaType={"movie"}
            loading={loadingStates.topRated}
            error={errorStates.topRated}
          />
        </LazySection>

        <LazySection>
          <SectionCarrusel
            title={"Upcoming Movies"}
            items={upcomingMovies}
            mediaType={"movie"}
            loading={loadingStates.upcoming}
            error={errorStates.upcoming}
          />
        </LazySection>
      </div>
    </div>
  );
};
