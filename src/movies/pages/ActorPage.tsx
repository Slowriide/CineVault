import { useParams, Link } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExternalLink, Calendar, MapPin, ArrowLeft, Star } from "lucide-react";
import { useState } from "react";
import { getImageUrl } from "@/mocks/tmdb";
import { MovieCard } from "../components/MovieCard";
import { usePerson } from "../hooks/usePerson";
import { getMovieDetails } from "@/utils/personUtils";

export default function ActorPage() {
  const { id } = useParams<{ id: string }>();
  const [isBiographyOpen, setIsBiographyOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(21);

  if (!id) {
    return (
      <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Person Not Found</h1>
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

  const {
    data: person,
    isLoading,
    error,
    allCredits,
    votedMovies,
    knownFor,
    topRatedMovie,
    worstRatedMovie,
  } = usePerson(id, "movie_credits,tv_credits", visibleCount);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-foreground">
            Person not found
          </h1>
          <p className="text-muted-foreground">
            The person you're looking for doesn't exist.
          </p>
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const personData = person;

  const topRatedDetails = getMovieDetails(topRatedMovie!);
  const worstRatedDetails = getMovieDetails(worstRatedMovie!);

  const birthYear = personData.birthday
    ? new Date(personData.birthday).getFullYear()
    : null;

  const deathYear = personData.deathday
    ? new Date(personData.deathday).getFullYear()
    : null;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Actor Header */}
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image */}
              <div className="md:col-span-1">
                <div className="aspect-[2/3] relative overflow-hidden rounded-lg bg-muted">
                  <img
                    src={getImageUrl(personData.profile_path, "w500")}
                    alt={personData.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Actor Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {personData.name}
                  </h1>
                  <Badge variant="secondary">
                    {personData.known_for_department}
                  </Badge>
                </div>

                {/* Top rated movie */}
                <div className="flex flex-wrap items-center space-x-2 mb-6">
                  <span className="font-bold text-lg">Top rated movie:</span>
                  {topRatedMovie ? (
                    <div className="flex items-center space-x-1 text-primary">
                      <Star className="w-5 h-5 fill-current" />
                      <span> {topRatedMovie.vote_average.toFixed(1)}</span>
                      <Link to={topRatedDetails.link}>
                        <span className="text-blue-400">
                          {topRatedDetails.title} ({topRatedDetails.year})
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-red-500">
                      There is not a top rated movie
                    </p>
                  )}
                </div>

                {/* Worst rated movie */}
                <div className="flex flex-wrap items-center space-x-2 mb-6">
                  <span className="font-bold text-lg">Worst rated movie:</span>
                  {worstRatedMovie ? (
                    <div className="flex items-center space-x-1 text-primary">
                      <Star className="w-5 h-5 fill-current" />
                      <span> {worstRatedMovie.vote_average.toFixed(1)}</span>
                      <Link to={worstRatedDetails.link}>
                        <span className="text-blue-400">
                          {worstRatedDetails.title} ({worstRatedDetails.year})
                        </span>
                      </Link>
                    </div>
                  ) : (
                    <p className="text-red-500">
                      There is not a worst rated movie
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {personData.birthday && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Born:</span>
                      <span className="text-foreground">
                        {new Date(personData.birthday).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        {birthYear &&
                          ` (${
                            new Date().getFullYear() - birthYear
                          } years old)`}
                      </span>
                    </div>
                  )}

                  {personData.deathday && (
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Died:</span>
                      <span className="text-foreground">
                        {new Date(personData.deathday).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                        {birthYear &&
                          deathYear &&
                          ` (${deathYear - birthYear} years old)`}
                      </span>
                    </div>
                  )}

                  {personData.place_of_birth && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">From:</span>
                      <span className="text-foreground">
                        {personData.place_of_birth}
                      </span>
                    </div>
                  )}
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-3">
                  {personData.imdb_id && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://www.imdb.com/name/${personData.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        IMDb
                      </a>
                    </Button>
                  )}
                  {personData.homepage && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={personData.homepage}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Website
                      </a>
                    </Button>
                  )}
                </div>

                {/* Biography Section */}
                <div className="space-y-2">
                  <p
                    className={`text-muted-foreground leading-relaxed whitespace-pre-line transition-all duration-300 ${
                      isBiographyOpen ? "" : "line-clamp-[15]"
                    }`}
                  >
                    {personData.biography}
                  </p>

                  {/* Botón */}
                  {personData.biography &&
                    personData.biography.split(" ").length > 150 && ( //si tiene mas de 50 palabras
                      <Button
                        variant="ghost"
                        size="sm"
                        className="px-0 text-primary hover:text-primary/80"
                        onClick={() => setIsBiographyOpen(!isBiographyOpen)}
                      >
                        {isBiographyOpen ? "Ver menos" : "Ver más"}
                      </Button>
                    )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Known For Section */}
        {knownFor.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Known For</h2>
            <div className="flex gap-4 overflow-x-auto pb-4">
              {knownFor.map((credit) => (
                <div
                  key={`${credit.id}-${"title" in credit ? "movie" : "tv"}`}
                  className="flex-shrink-0"
                >
                  <MovieCard
                    item={credit}
                    mediaType={"title" in credit ? "movie" : "tv"}
                    size="sm"
                    showFavorite={false}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Full Filmography */}
        {votedMovies.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground">Filmography</h2>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {votedMovies.map((credit) => (
                <MovieCard
                  key={`full-film${credit.id}-${
                    "title" in credit ? "movie" : "tv"
                  }`}
                  item={credit}
                  mediaType={"title" in credit ? "movie" : "tv"}
                  size="xl"
                  showFavorite={false}
                />
              ))}
            </div>
          </div>
        )}
        {visibleCount < allCredits.length && (
          <div className="flex justify-center mt-4">
            <Button
              variant="outline"
              onClick={() => setVisibleCount((prev) => prev + 14)}
            >
              Load more
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
