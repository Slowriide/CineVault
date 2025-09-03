import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/mocks/tmdb";
import { Heart, Star, Calendar } from "lucide-react";
import { useFavorites } from "../hooks/useFavorite";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

interface MovieCardProps {
  item: MovieMovieDB | TvShowMovieDB;
  mediaType: "movie" | "tv";
  size?: "sm" | "md" | "lg" | "xl";
  showFavorite?: boolean;
}

export const MovieCard = ({
  item,
  mediaType,
  size = "md",
  showFavorite = true,
}: MovieCardProps) => {
  const { isFavorite, toggleFavorite } = useFavorites();

  const title = "title" in item ? item.title : item.name;
  const releaseDate =
    "release_date" in item ? item.release_date : item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const rating = item.vote_average;

  const sizeClasses = {
    sm: "w-32",
    md: "w-40",
    lg: "w-48",
    xl: "w-full",
  };

  const imageSize = {
    sm: "w342",
    md: "w500",
    lg: "w780",
    xl: "w780",
  };

  const linkTo = mediaType === "movie" ? `/movie/${item.id}` : `/tv/${item.id}`;

  return (
    <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-none hover:shadow-glow hover:-translate-y-1 mt-1">
      <div className={`${sizeClasses[size]} relative`}>
        <Link to={linkTo}>
          <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
            <img
              src={getImageUrl(item.poster_path, imageSize[size])}
              alt={title}
              className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Rating Badge */}
            {rating > 0 && (
              <Badge className="absolute top-2 left-2 bg-background/90 text-primary border-primary/20">
                <Star className="w-3 h-3 mr-1 fill-primary text-primary" />
                {rating.toFixed(1)}
              </Badge>
            )}

            {/* Favorite Button */}
            {showFavorite && (
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2 h-8 w-8 p-0 bg-background/20 hover:bg-background/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                onClick={(e) => {
                  e.preventDefault();
                  toggleFavorite({ id: item.id, media_type: mediaType });
                }}
              >
                <Heart
                  className={`w-4 h-4 ${
                    isFavorite(item.id)
                      ? "fill-red-500 text-red-500"
                      : "text-white"
                  }`}
                />
              </Button>
            )}
          </div>
        </Link>

        {/* Card Content */}
        <div className="p-3 space-y-2">
          <Link to={linkTo}>
            <h3 className="font-medium text-sm leading-tight line-clamp-1 min- group-hover:text-primary transition-colors duration-200">
              {title}
            </h3>
          </Link>

          <div className="flex items-center text-xs text-muted-foreground space-x-2">
            <Calendar className="w-3 h-3" />
            <span>{year}</span>
            {mediaType && (
              <>
                <span>•</span>
                <Badge variant="outline" className="text-xs py-0 px-1 h-5">
                  {mediaType === "movie" ? "Movie" : "TV"}
                </Badge>
              </>
            )}
          </div>

          {item.overview && size !== "sm" && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {item.overview}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};
