import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/mocks/tmdb";
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
  const { type, slug } = useParams();

  const id = slug ? parseInt(slug.split("-").pop()!).toString() : null;
  const [visibleCount, setVisibleCount] = useState(21);

  if (!id) {
    return (
      <CustomError
        title="Movie Not Found"
        message="No Movie ID provided"
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  const {
    visiblePersons: credits,
    allPersons,
    isLoading: isLoadingPersons,
    error: isErrorCredits,
  } = useCredits(id, type! as Type, visibleCount);

  const { data, trailers, isError, isLoading } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  const {
    data: similarMovies,
    error: isErrorSimilar,
    isLoading: isLoadingSimilar,
  } = useSimilar(id, type! as Type, 1);

  if (isLoading) {
    return <MovieDetailsPageSkeleton />;
  }

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
      {/* Backdrop */}
      <MovieBackdrop backdropPath={data.backdrop_path} />

      <div className="max-w-[1600px] mx-auto py-auto  px-4">
        <div className="relative container pt-20 pb-10">
          {/* Movie Header */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Poster */}
            <div className="md:col-span-1">
              <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
                <img
                  src={getImageUrl(data.poster_path, "w780")}
                  alt={data.title}
                  className="w-full aspect-[2/3] object-cover"
                />
              </Card>

              <TrailerPlayer
                trailers={trailers}
                className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 items-center gap-4 mt-4"
              />
            </div>

            {/* Details */}
            <MovieDetailsHeader data={data as NormalizedMovieDetailsData} />
          </div>

          {/* Tabs for Additional Content */}
          <ContentTabs
            credits={credits}
            similarMovies={similarMovies}
            isErrorCredits={isErrorCredits}
            isErrorSimilar={isErrorSimilar}
            isLoadingSimilar={isLoadingSimilar}
            type={(type ?? "movie") as Type}
            visibleCount={visibleCount}
            allPersons={allPersons.length}
            onClick={() => setVisibleCount((prev) => prev + 14)}
          />
        </div>
      </div>
    </div>
  );
}
