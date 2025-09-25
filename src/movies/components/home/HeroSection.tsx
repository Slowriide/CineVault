import { Button } from "@/components/ui/button";
import { Info, Star, Calendar } from "lucide-react";
import { getBackdropUrl } from "@/mocks/tmdb";
import { Link } from "react-router";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/utils/slugify";
import { FallbackHero } from "./FallbackHero";
import { useTrailers } from "@/movies/hooks/useTrailers";
import { TrailerPlayer } from "../movie/TrailerPlayer";

interface HeroSectionProps {
  featuredMovie?: MovieMovieDB | TvShowMovieDB;
}

export const HeroSection = ({ featuredMovie }: HeroSectionProps) => {
  const manualId = featuredMovie?.id.toString() ?? "";
  const manualType = featuredMovie?.media_type ?? "movie";

  const { trailers } = useTrailers(manualId, manualType);

  if (!featuredMovie) {
    return <FallbackHero />;
  }

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

  return (
    <div
      className="relative h-[70vh] flex items-center bg-cover bg-center -mt-16"
      style={{
        backgroundImage: `url(${getBackdropUrl(
          featuredMovie.backdrop_path,
          "original"
        )})`,
      }}
    >
      <div className="absolute mx-auto inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />

      <div className="relative z-10 max-w-[1600px] mx-auto container py-20">
        <div className="max-w-2xl space-y-6">
          {/* Movie Poster Thumbnail */}
          <div className="flex items-start space-x-6">
            <img
              src={getBackdropUrl(featuredMovie.poster_path, "original")}
              alt={title}
              className="w-24 h-36 object-cover rounded-lg shadow-elegant"
            />

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
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

              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                {title}
              </h1>

              <div className="flex items-center space-x-4 text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{year}</span>
                </div>
                <span>•</span>
                <span>{mediaType}</span>
              </div>

              <p className="text-lg text-gray-200 leading-relaxed line-clamp-3">
                {featuredMovie.overview}
              </p>

              <div className="flex items-center space-x-4 pt-4">
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

                <TrailerPlayer trailers={trailers.slice(0, 1)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
