import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clapperboard,
  Clock,
  ExternalLink,
  EyeIcon,
  Heart,
  Star,
} from "lucide-react";
import { PopularReviews } from "./PopularReviews";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { useAuth } from "@/context/AuthContext";
import { useToggleFavorite } from "../hooks/favorites/useToggleFavorite";
import { toast } from "sonner";
import { mapMovieDetailsToMovieDB } from "@/utils/NormalizedToMovieMapper";
import { useParams } from "react-router";
import { useToggleWatched } from "../hooks/watched/useToggleWatched";
import { useToggleWatclist } from "../hooks/watchlist/useToggleWatchlist";

interface MovieDetailsProps {
  data: NormalizedMovieDetailsData;
}

export const MovieDetailsHeader = ({ data }: MovieDetailsProps) => {
  const { type } = useParams();
  const { session } = useAuth();
  const userId = session?.user.id;

  const { addFavorite, removeFavorite, favoriteIds } =
    useToggleFavorite(userId);

  const { addWatched, removeWatched, watchedsIds } = useToggleWatched(userId);

  const { addWatchlist, removeWatchlist, watchListIds } =
    useToggleWatclist(userId);

  if (!type) {
    return;
  }

  const isFav = favoriteIds.has(String(data.id));

  const isWatched = watchedsIds.has(String(data.id));

  const isInWatchList = watchListIds.has(String(data.id));

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

  const handleWatchedClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("you must be logged in to add watcheds");
      return;
    }

    if (isWatched) {
      await removeWatched.mutateAsync(String(data.id));
      toast.success("removed from watched");
    } else {
      await addWatched.mutateAsync(
        mapMovieDetailsToMovieDB(data, type as "movie" | "tv")
      );
    }
  };

  const handleWatchListClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (!userId) {
      toast.error("you must be logged in to add watcheds");
      return;
    }
    if (isInWatchList) {
      await removeWatchlist.mutateAsync(String(data.id));
      toast.success("removed from watched");
    } else {
      await addWatchlist.mutateAsync(
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
            className={isFav ? "bg-primary hover:bg-chart-5" : ""}
          >
            <Heart className={`w-4 h-4 mr-2 ${isFav ? "fill-current" : ""}`} />
            {isFav ? "Remove from Favorites" : "Add to Favorites"}
          </Button>

          <Button
            onClick={handleWatchedClick}
            variant={isWatched ? "default" : "outline"}
            className={isWatched ? "bg-primary hover:bg-chart-5" : ""}
          >
            <EyeIcon
              className={`w-4 h-4 mr-2 ${isWatched ? "fill-current" : ""}`}
            />
            {isWatched ? "Remove from Watched" : "Add to Watched"}
          </Button>

          <Button
            onClick={handleWatchListClick}
            variant={isInWatchList ? "default" : "outline"}
            className={isInWatchList ? "bg-primary hover:bg-chart-5" : ""}
          >
            <Clapperboard
              className={`w-4 h-4 mr-2 ${isInWatchList ? "fill-current" : ""}`}
            />
            {isInWatchList ? "Remove from Watchlist" : "Add to WatchList"}
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
