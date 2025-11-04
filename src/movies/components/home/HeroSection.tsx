import { Button } from "@/components/ui/button";
import { Info, Star, Calendar } from "lucide-react";
import { getBackdropUrl } from "@/utils/tmdb";
import { Link } from "react-router";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/utils/slugify";
import { FallbackHero } from "./FallbackHero";
import { useTrailers } from "@/movies/hooks/useTrailers";
import { HeroSkeleton } from "../skeletons/SkeletonHero";
import { Helmet } from "react-helmet";
import React, { Suspense, useState } from "react";
const TrailerPlayer = React.lazy(() => import("../movie/TrailerPlayer"));

interface HeroSectionProps {
  featuredMovie?: MovieMovieDB | TvShowMovieDB;
  isLoading?: boolean;
}

export const HeroSection = ({ featuredMovie, isLoading }: HeroSectionProps) => {
  const manualId = featuredMovie?.id.toString() ?? "";
  const manualType = featuredMovie?.media_type ?? "movie";

  const { trailers } = useTrailers(manualId, manualType);

  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (isLoading) return <HeroSkeleton />;
  if (!featuredMovie) return <FallbackHero />;

  const isMovie = "title" in featuredMovie;

  const title = isMovie ? featuredMovie.title : featuredMovie.name;

  const year = isMovie
    ? new Date(featuredMovie.release_date!).getFullYear()
    : new Date(featuredMovie.first_air_date!).getFullYear();

  const mediaType = isMovie ? "Movie" : "TV Show";

  const rating = featuredMovie.vote_average;

  const detailLink = isMovie
    ? `/movie/${slugify(title, featuredMovie.id)}`
    : `/tv/${slugify(title, featuredMovie.id)}`;

  const backdropSizes = {
    mobile: "w780",
    tablet: "w1280",
    desktop: "original",
  };

  const backdropUrl = getBackdropUrl(
    featuredMovie.backdrop_path,
    window.innerWidth < 768
      ? backdropSizes.mobile
      : window.innerWidth < 1280
      ? backdropSizes.tablet
      : backdropSizes.desktop
  );

  const posterSize = window.innerWidth < 768 ? "w185" : "w342";
  const posterUrl = getBackdropUrl(featuredMovie.poster_path, posterSize);

  return (
    <>
      {/* Preload */}
      {featuredMovie?.backdrop_path && (
        <Helmet>
          <link
            rel="preload"
            as="image"
            href={backdropUrl}
            fetchPriority="high"
            imageSrcSet={`
              ${getBackdropUrl(featuredMovie.backdrop_path, "w780")} 780w,
              ${getBackdropUrl(featuredMovie.backdrop_path, "w1280")} 1280w,
              ${getBackdropUrl(featuredMovie.backdrop_path, "original")} 1920w
            `}
            imageSizes="100vw"
          />
        </Helmet>
      )}

      {/* Backdrop */}
      <div className="relative min-h-[60dvh] md:h-[70dvh] flex items-center bg-center  bg-cover -mt-17 overflow-hidden">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background animate-pulse" />
        )}

        {!imageError && (
          <img
            src={backdropUrl}
            srcSet={`
              ${getBackdropUrl(featuredMovie.backdrop_path, "w780")} 780w,
              ${getBackdropUrl(featuredMovie.backdrop_path, "w1280")} 1280w,
              ${getBackdropUrl(featuredMovie.backdrop_path, "original")} 1920w
            `}
            sizes="100vw"
            alt=""
            loading="eager"
            fetchPriority="high"
            decoding="async"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            style={{
              contentVisibility: "auto",
            }}
          />
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />

        {/* Content */}
        <div className="relative z-10 max-w-[1600px] mx-auto container py-20 px-4">
          <div className="grid md:grid-cols-6 max-w-2xl space-y-6">
            {/* Movie Poster Thumbnail */}
            <div className="md:col-span-1 hidden md:flex">
              <img
                src={posterUrl}
                srcSet={`
                  ${getBackdropUrl(featuredMovie.poster_path, "w185")} 185w,
                  ${getBackdropUrl(featuredMovie.poster_path, "w342")} 342w
                `}
                sizes="(min-width: 768px) 96px, 0px"
                alt={title}
                loading="lazy"
                decoding="async"
                className="w-24 h-36 object-cover rounded-lg shadow-elegant"
              />
            </div>

            {/* Info */}
            <div className="md:col-span-5 space-y-4">
              {/* Rating */}
              <div className="hidden sm:flex items-center space-x-3 ">
                <Badge className="bg-background/20 border-primary/30 text-primary">
                  Featured
                </Badge>
                {rating > 0 && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight line-clamp-2">
                {title}
              </h1>

              {/* Date */}
              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
                <span>•</span>
                <span>{mediaType}</span>
                <span className="sm:hidden">•</span>
                {rating > 0 && (
                  <div className="flex items-center space-x-1 text-primary sm:hidden">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-medium">{rating.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Overview */}
              <p className="text-lg text-gray-200 leading-relaxed line-clamp-2">
                {featuredMovie.overview}
              </p>

              {/* Details & Trailer */}
              <div className="flex items-center space-x-4 pt-4 flex-wrap">
                <Button
                  asChild
                  size="lg"
                  className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-glow"
                  aria-label="Featured Movie Details"
                >
                  <Link to={detailLink}>
                    <Info className="w-5 h-5 mr-2" />
                    View Details
                  </Link>
                </Button>

                <Suspense fallback={null}>
                  <TrailerPlayer trailers={trailers.slice(0, 1)} />
                </Suspense>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
