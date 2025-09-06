import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Heart, Star } from "lucide-react";
import { PopularReviews } from "./PopularReviews";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";

interface MovieDetailsProps {
  data: NormalizedMovieDetailsData;

  isFavorite: (id: number) => boolean;
  toggleFavorite: (data: {
    id: number;
    title: string;
    poster_path: string;
    media_type: "movie";
  }) => void;

  favoriteData: {
    id: number;
    title: string;
    poster_path: string;
    media_type: "movie";
  };
}

export const MovieDetailsHeader = ({
  data,
  isFavorite,
  favoriteData,
  toggleFavorite,
}: MovieDetailsProps) => {
  return (
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
            className={isFavorite(data.id) ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart
              className={`w-4 h-4 mr-2 ${
                isFavorite(data.id) ? "fill-current" : ""
              }`}
            />
            {isFavorite(data.id) ? "Remove from Favorites" : "Add to Favorites"}
          </Button>

          {data.homepage && (
            <Button asChild variant="outline">
              <a href={data.homepage} target="_blank" rel="noopener noreferrer">
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
  );
};
