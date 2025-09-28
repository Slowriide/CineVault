import { useParams } from "react-router";
import { Card } from "@/components/ui/card";
import { getBackdropUrl, getImageUrl } from "@/mocks/tmdb";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { useCredits } from "../hooks/useCredits";
import type { Type } from "@/interfaces/MovieCategory";
import { useSimilar } from "../hooks/useSimilar";
import { CustomError } from "@/components/custom/CustomError";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { ContentTabs } from "../components/ContentTabs";
import { MovieDetailsHeader } from "../components/MovieDetailsHeader";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";

export default function MovieDetailsPage() {
  const { type, slug } = useParams();

  const id = slug ? parseInt(slug.split("-").pop()!).toString() : null;

  if (!id) {
    return (
      <CustomError
        title="Movie Not Found"
        message="No Movie ID provided"
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  const { data: credits, error: isErrorCredits } = useCredits(
    id,
    type! as Type
  );

  const { data, isLoading, trailers } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  const {
    data: similarMovies,
    error: isErrorSimilar,
    isLoading: isLoadingSimilar,
  } = useSimilar(id, type! as Type, 1);

  if (isLoading) {
    return <CustomLoading />;
  }

  if (!data) {
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
      {data.backdrop_path && (
        <div
          className="absolute top-0 left-0 right-0 h-[60vh] bg-cover bg-center opacity-20"
          style={{
            backgroundImage: `url(${getBackdropUrl(
              data.backdrop_path,
              "original"
            )})`,
          }}
        />
      )}

      <div className="max-w-[1600px] mx-auto py-auto space-y-12">
        <div className="relative container py-20">
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
            </div>

            {/* Details */}
            <MovieDetailsHeader
              data={data as NormalizedMovieDetailsData}
              trailers={trailers ?? []}
            />
          </div>

          {/* Tabs for Additional Content */}
          <ContentTabs
            credits={credits}
            similarMovies={similarMovies}
            isErrorCredits={isErrorCredits}
            isErrorSimilar={isErrorSimilar}
            isLoadingSimilar={isLoadingSimilar}
            type={(type ?? "movie") as Type}
          />
        </div>
      </div>
    </div>
  );
}
