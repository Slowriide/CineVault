import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/tmdb";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { useCredits } from "../hooks/useCredits";
import type { Type } from "@/interfaces/MovieCategory";
import { useSimilar } from "../hooks/useSimilar";
import { CustomError } from "@/components/custom/CustomError";
import { ContentTabs } from "../components/movie/ContentTabs";
import { MovieDetailsHeader } from "../components/movie/MovieDetailsHeader";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { MovieBackdrop } from "../components/movie/MovieBackdrop";
import { MovieDetailsPageSkeleton } from "./skeletons/MovieDetailsPageSkeleton";
import { TrailerPlayer } from "../components/movie/TrailerPlayer";
import { useState } from "react";

export default function MovieDetailsPage() {
  // Get the type (movie or tv) and slug from URL params
  const { type, slug } = useParams();

  // Extract movie/TV show ID from slug (last part after hyphen)
  const id = slug ? parseInt(slug.split("-").pop()!).toString() : null;

  // State for controlling how many credits to show
  const [visibleCount, setVisibleCount] = useState(21);

  // If ID is missing, show a full-page error
  if (!id) {
    return (
      <CustomError
        title="Movie Not Found"
        message="No Movie ID provided"
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  // Fetch cast and crew (credits) for the movie/TV show
  const {
    visiblePersons: credits,
    allPersons,
    error: isErrorCredits,
  } = useCredits(id, type! as Type, visibleCount);

  // Fetch movie or TV show details depending on type
  const { data, trailers, isError, isLoading } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  // Fetch similar movies/TV shows
  const {
    data: similarMovies,
    error: isErrorSimilar,
    isLoading: isLoadingSimilar,
  } = useSimilar(id, type! as Type, 1);

  // Show skeleton while loading
  if (isLoading) {
    return <MovieDetailsPageSkeleton />;
  }

  // Show error page if movie/TV show not found or API request failed
  if (!data || isError) {
    return (
      <CustomError
        title="Movie Not Found"
        message="The Movie you're looking for doesn't exist."
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Background Backdrop Image */}
      <MovieBackdrop backdropPath={data.backdrop_path} />

      <div className="max-w-[1600px] mx-auto py-auto px-4">
        <div className="relative container pt-20 pb-10">
          {/* Movie Header Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Left Column: Poster + Trailers */}
            <div className="md:col-span-1">
              {/* Movie/TV poster */}
              <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
                <img
                  src={getImageUrl(data.poster_path, "w780")}
                  alt={data.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </Card>

              {/* Trailer previews */}
              <TrailerPlayer
                trailers={trailers}
                className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 items-center gap-4 mt-4"
              />
            </div>

            {/* Right Column: Movie Details Header */}
            <MovieDetailsHeader data={data as NormalizedMovieDetailsData} />
          </div>

          {/* Tabs Section for additional content */}
          <ContentTabs
            credits={credits} // visible cast members
            similarMovies={similarMovies} // similar movies/TV shows
            isErrorCredits={isErrorCredits} // credits loading error
            isErrorSimilar={isErrorSimilar} // similar content loading error
            isLoadingSimilar={isLoadingSimilar} // similar content loading state
            type={(type ?? "movie") as Type} // media type
            visibleCount={visibleCount} // how many credits currently shown
            allPersons={allPersons.length} // total cast size
            onClick={() => setVisibleCount((prev) => prev + 14)} // load more credits
          />
        </div>
      </div>
    </div>
  );
}
