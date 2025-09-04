import { useParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Heart, Star, Calendar, Clock, ExternalLink } from "lucide-react";
import { getBackdropUrl, getImageUrl } from "@/mocks/tmdb";
import { useFavorites } from "../hooks/useFavorite";

import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import type { MovieDetails } from "@/interfaces/MovieDetails";
import { useCredits } from "../hooks/useCredits";
import type { Type } from "@/interfaces/MovieCategory";
import { useSimilar } from "../hooks/useSimilar";
import { CustomError } from "@/components/custom/CustomError";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { PopularReviews } from "../components/PopularReviews";
import { ContentTabs } from "../components/ContentTabs";

export default function MovieDetailsPage() {
  const { type, id } = useParams();
  const { isFavorite, toggleFavorite } = useFavorites();

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

  const { data, isLoading } =
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

  const favoriteData = {
    id: (data as MovieDetails).id,
    title: (data as MovieDetails).title,
    poster_path: (data as MovieDetails).poster_path,
    media_type: "movie" as const,
  };

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
            <div className="md:col-span-2 space-y-6">
              <div>
                <h1 className="text-4xl font-bold mb-4 text-foreground">
                  {data.title}
                </h1>

                {data.tagline && (
                  <p className="text-lg text-muted-foreground italic mb-4">
                    "{data.tagline}"
                  </p>
                )}

                <div className="flex flex-wrap items-center gap-4 mb-6">
                  {data.vote_average > 0 && (
                    <div className="flex items-center space-x-1 text-primary">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="font-semibold text-lg">
                        {data.vote_average.toFixed(1)}
                      </span>
                      <span className="text-muted-foreground">
                        ({data.vote_count} votes)
                      </span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>{data.release_date.toString()}</span>
                  </div>

                  {data.runtime && (
                    <div className="flex items-center space-x-1 text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      <span>{data.runtime} min</span>
                    </div>
                  )}
                </div>

                {/* Genres */}
                {data.genres && data.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {data.genres.map((genre) => (
                      <Badge key={genre.id} variant="secondary">
                        {genre.name}
                      </Badge>
                    ))}
                  </div>
                )}

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {data.overview}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center space-x-4">
                  <Button
                    onClick={() => toggleFavorite(favoriteData)}
                    variant={isFavorite(data.id) ? "default" : "outline"}
                    className={
                      isFavorite(data.id) ? "bg-red-600 hover:bg-red-700" : ""
                    }
                  >
                    <Heart
                      className={`w-4 h-4 mr-2 ${
                        isFavorite(data.id) ? "fill-current" : ""
                      }`}
                    />
                    {isFavorite(data.id)
                      ? "Remove from Favorites"
                      : "Add to Favorites"}
                  </Button>

                  {data.homepage && (
                    <Button asChild variant="outline">
                      <a
                        href={data.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Visit Homepage
                      </a>
                    </Button>
                  )}
                </div>
                {/* Reviews */}
                <PopularReviews />
              </div>
            </div>
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
