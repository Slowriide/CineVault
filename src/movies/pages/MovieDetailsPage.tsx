import { useState } from "react";
import { useParams, Link } from "react-router";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

import {
  Heart,
  Star,
  Calendar,
  Clock,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { getBackdropUrl, getImageUrl, type Cast } from "@/mocks/tmdb";
import { useFavorites } from "../hooks/useFavorite";
import { Carousel } from "../components/Carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import type { MovieDetails } from "@/interfaces/MovieDetails";
import type { TVShowDetails } from "@/interfaces/TVShowDetails";

export default function MovieDetailsPage() {
  const { type, id } = useParams();
  const [cast, setCast] = useState<Cast[]>([]);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const { isFavorite, toggleFavorite } = useFavorites();

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const { data, isLoading, isError } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container py-20">
          <div className="animate-pulse space-y-6">
            <div className="h-8 w-32 bg-muted rounded" />
            <div className="grid md:grid-cols-3 gap-8">
              <div className="aspect-[2/3] bg-muted rounded-lg" />
              <div className="md:col-span-2 space-y-4">
                <div className="h-12 bg-muted rounded" />
                <div className="h-6 w-64 bg-muted rounded" />
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded" />
                  <div className="h-4 w-3/4 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Movie Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const isMovie = type === "movie";

  const title = isMovie
    ? (data as MovieDetails).title
    : (data as TVShowDetails).name;
  const releaseDate = isMovie
    ? (data as MovieDetails).release_date
    : (data as TVShowDetails).first_air_date;
  const runtime = isMovie
    ? (data as MovieDetails).runtime
    : (data as TVShowDetails).episode_run_time[0] || 0;
  const rating = data.vote_average;

  const favoriteData = isMovie
    ? {
        id: (data as MovieDetails).id,
        title: (data as MovieDetails).title,
        poster_path: (data as MovieDetails).poster_path,
        media_type: "movie" as const,
      }
    : {
        id: (data as TVShowDetails).id,
        name: (data as TVShowDetails).name,
        poster_path: (data as TVShowDetails).poster_path,
        media_type: "tv" as const,
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

      <div className="relative container py-20">
        {/* Back Button */}
        <Button asChild variant="ghost" className="mb-6 hover:bg-background/10">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>

        {/* Movie Header */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Poster */}
          <div className="md:col-span-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <img
                src={getImageUrl(data.poster_path, "w780")}
                alt={title}
                className="w-full aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Details */}
          <div className="md:col-span-2 space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-4 text-foreground">
                {title}
              </h1>

              {data.tagline && (
                <p className="text-lg text-muted-foreground italic mb-4">
                  "{data.tagline}"
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 mb-6">
                {rating > 0 && (
                  <div className="flex items-center space-x-1 text-primary">
                    <Star className="w-5 h-5 fill-current" />
                    <span className="font-semibold text-lg">
                      {rating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({data.vote_count} votes)
                    </span>
                  </div>
                )}

                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  <span>{releaseDate.toString()}</span>
                </div>

                {runtime && (
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{runtime} min</span>
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
            </div>
          </div>
        </div>

        {/* Tabs for Additional Content */}
        <Tabs defaultValue="cast" className="space-y-6">
          <TabsList className="bg-muted/50">
            <TabsTrigger value="cast">Cast</TabsTrigger>
            <TabsTrigger value="similar">Similar Movies</TabsTrigger>
          </TabsList>

          <TabsContent value="cast" className="space-y-4">
            <h2 className="text-xl font-semibold">Cast</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {cast.map((actor) => (
                <Card
                  key={actor.id}
                  className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
                >
                  <div className="aspect-[2/3] relative">
                    <img
                      src={getImageUrl(actor.profile_path, "w342")}
                      alt={actor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="font-medium text-sm text-foreground line-clamp-1">
                      {actor.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {actor.character}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="similar">
            <Carousel
              title="Similar Movies"
              items={similarMovies}
              mediaType="movie"
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
