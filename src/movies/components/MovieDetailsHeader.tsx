import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, ExternalLink, Heart, Star } from "lucide-react";
import { PopularReviews } from "./PopularReviews";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { useAuth } from "@/context/AuthContext";
import { useFavs } from "../hooks/favorites/useFavs";
import { useToggleFavorite } from "../hooks/favorites/useToggleFavorite";
import { toast } from "sonner";
import { mapMovieDetailsToMovieDB } from "@/utils/NormalizedToMovieMapper";
import { useParams } from "react-router";

interface MovieDetailsProps {
  data: NormalizedMovieDetailsData;
}

export const MovieDetailsHeader = ({ data }: MovieDetailsProps) => {
  const { type } = useParams();
  const { session } = useAuth();
  const userId = session?.user.id;
  const { data: favorites } = useFavs(userId);
  const { addFavorite, removeFavorite } = useToggleFavorite(userId);

  if (!type) {
    return;
  }

  const favoriteIds = new Set(favorites?.map((f) => f.movie_id));
  const isFav = favoriteIds.has(String(data.id));

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("you must be logged in to add favorites");
      return;
    }

    if (isFav) {
      await removeFavorite.mutateAsync(String(data.id));
      toast.success("removed from favorites");
    } else {
      await addFavorite.mutateAsync(
        mapMovieDetailsToMovieDB(data, type as "movie" | "tv")
      );
    }
  };

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
            onClick={handleFavoriteClick}
            variant={isFav ? "default" : "outline"}
            className={isFav ? "bg-red-600 hover:bg-red-700" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFav ? "fill-current" : ""}`} />
            {isFav ? "Remove from Favorites" : "Add to Favorites"}
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
