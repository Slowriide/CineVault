import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getImageUrl } from "@/utils/tmdb";
import { Heart, Star, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { slugify } from "@/utils/slugify";
import { useAuth } from "@/context/AuthContext";
import { useToggleFavorite } from "../hooks/favorites/useToggleFavorite";
import { toast } from "sonner";
import { getYearFromReleaseDate } from "@/utils/getYear";
import React, { useCallback, useMemo } from "react";

interface MovieCardProps {
  item: MovieMovieDB | TvShowMovieDB;
  mediaType: "movie" | "tv";
  size?: "sm" | "md" | "lg" | "xl";
  showFavorite?: boolean;
  loading?: "lazy" | "eager";
}

// Classes to control card width based on size prop
const sizeClasses = {
  sm: "w-32",
  md: "w-40",
  lg: "w-48",
  xl: "w-full",
};

export const MovieCard = React.memo(
  ({
    item,
    mediaType,
    size = "md",
    showFavorite = true,
    loading = "lazy",
  }: MovieCardProps) => {
    const { session } = useAuth();
    const userId = session?.user.id;

    // Hook to manage user's favorites
    const { addFavorite, removeFavorite, favoriteIds } =
      useToggleFavorite(userId);

    // Memoize commonly derived values for efficiency
    const { title, year, rating, linkTo, posterLow, posterHigh, isFav } =
      useMemo(() => {
        const itemTitle = "title" in item ? item.title : item.name; // movie vs tv title
        const releaseDate =
          "release_date" in item ? item.release_date : item.first_air_date;
        const itemYear = getYearFromReleaseDate(releaseDate); // Extract year
        const itemRating = item.vote_average;
        const itemLink =
          mediaType === "movie"
            ? `/movie/${slugify(itemTitle, item.id)}`
            : `/tv/${slugify(itemTitle, item.id)}`;

        // Low and high resolution images
        const low = getImageUrl(item.poster_path, "w185");
        const high = getImageUrl(item.poster_path, "w342");

        return {
          title: itemTitle,
          year: itemYear,
          rating: itemRating,
          linkTo: itemLink,
          posterLow: low,
          posterHigh: high,
          isFav: favoriteIds.has(String(item.id)),
        };
      }, [item, mediaType, favoriteIds]);

    // Handle favorite/unfavorite click
    const handleFavoriteClick = useCallback(
      async (e: React.MouseEvent) => {
        e.preventDefault(); // prevent navigation when clicking favorite

        if (!userId) {
          toast.error("you must be logged in to add favorites");
          return;
        }

        if (isFav) {
          await removeFavorite.mutateAsync(String(item.id));
          toast.success("removed from favorites");
        } else {
          await addFavorite.mutateAsync(
            mediaType === "movie"
              ? ({ ...item, media_type: "movie" } as MovieMovieDB)
              : ({ ...item, media_type: "tv" } as TvShowMovieDB)
          );
        }
      },
      [userId, isFav, item, mediaType, addFavorite, removeFavorite]
    );

    return (
      <Card className="group relative overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-none hover:shadow-glow hover:-translate-y-1 mt-1">
        <div className={`${sizeClasses[size]} relative`}>
          {/* Link to movie/tv page */}
          <Link to={linkTo}>
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
              {/* Poster image */}
              <img
                src={posterLow}
                srcSet={`${posterLow} 185w, ${posterHigh} 500w`}
                sizes="(max-width: 768px) 185px, 500px"
                loading={loading}
                fetchPriority={loading === "eager" ? "high" : "low"}
                decoding="async"
                alt={title}
                className="w-full h-full object-cover"
                style={{ contentVisibility: "auto" }}
              />
              {/* Gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Rating badge */}
              {rating > 0 && (
                <Badge className="absolute top-2 left-2 bg-background/90 text-primary border-primary/20">
                  <Star className="w-3 h-3 mr-1 fill-primary text-primary hidden sm:flex" />
                  {rating.toFixed(1)}
                </Badge>
              )}

              {/* Favorite button */}
              {showFavorite && (
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-2 right-2 h-6 w-6 md:h-8 md:w-8 p-0 md:bg-background/20 bg-background/40 hover:bg-background/40 backdrop-blur-sm opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  onClick={handleFavoriteClick}
                  aria-label={
                    isFav ? "Remove from favorites" : "Add to favorites"
                  }
                >
                  <Heart
                    className={`w-4 h-4 ${
                      isFav ? "fill-red-500 text-red-500" : "text-white"
                    }`}
                  />
                </Button>
              )}
            </div>
          </Link>

          {/* Card content */}
          <div className="p-3 space-y-1 justify-between">
            <Link to={linkTo}>
              {/* Title */}
              <h3 className="font-medium text-sm leading-tight line-clamp-1 min- group-hover:text-primary transition-colors duration-200 mb-1">
                {title}
              </h3>
            </Link>

            {/* Year and media type */}
            <div className="flex items-center text-xs text-muted-foreground space-x-2">
              <Calendar className="w-3 h-3 hidden sm:flex" />
              <span>{year ?? ""}</span>
              {mediaType && (
                <>
                  <span className="hidden sm:flex">•</span>
                  <Badge variant="outline" className="text-xs py-0 px-1 h-5 ">
                    {mediaType === "movie" ? "Movie" : "TV"}
                  </Badge>
                </>
              )}
            </div>

            {/* Overview / description */}
            {item.overview && size !== "sm" && (
              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.overview}
              </p>
            )}
          </div>
        </div>
      </Card>
    );
  },
  // Only re-render if props change
  (prevProps, nextProps) => {
    return (
      prevProps.item.id === nextProps.item.id &&
      prevProps.mediaType === nextProps.mediaType &&
      prevProps.size === nextProps.size &&
      prevProps.showFavorite === nextProps.showFavorite &&
      prevProps.loading === nextProps.loading
    );
  }
);

MovieCard.displayName = "MovieCard";
