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
import { ToggleButton } from "./movie/ToggleButton";
import { CustomError } from "@/components/custom/CustomError";

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
    return (
      <CustomError title={"No movie info"} message={"Error loading info"} />
    );
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
            <span>{data.release_date?.toString()}</span>
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
              <Badge key={`${genre.id}-${genre.name}`} variant="secondary">
                {genre.name}
              </Badge>
            ))}
          </div>
        )}

        <p className="text-muted-foreground leading-relaxed mb-6">
          {data.overview}
        </p>

        {/* Action Buttons */}
        <div className=" grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 items-center mb-4 gap-4">
          <ToggleButton
            isActive={isFav}
            icon={
              <Heart
                className={`w-4 h-4 mr-2 ${isFav ? "fill-current" : ""}`}
              />
            }
            labelOn={"Remove from Favorites"}
            labelOff={"Add to Favorites"}
            onClick={handleFavoriteClick}
          />

          <ToggleButton
            isActive={isWatched}
            icon={
              <EyeIcon
                className={`w-4 h-4 mr-2 ${isWatched ? "fill-current" : ""}`}
              />
            }
            labelOn={"Remove from Watched"}
            labelOff={"Add to Watched"}
            onClick={handleWatchedClick}
          />

          <ToggleButton
            isActive={isInWatchList}
            icon={
              <Clapperboard
                className={`w-4 h-4 mr-2 ${
                  isInWatchList ? "fill-current" : ""
                }`}
              />
            }
            labelOn={"Remove from Watchlist"}
            labelOff={"Add to WatchList"}
            onClick={handleWatchListClick}
          />

          {data.homepage && (
            <Button asChild variant="outline" size="lg">
              <a href={data.homepage} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-2 " />
                Visit Homepage
              </a>
            </Button>
          )}
        </div>

        {/* Reviews */}
        <PopularReviews movie={data} />
      </div>
    </div>
  );
};
