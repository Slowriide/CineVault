import { useParams, useSearchParams } from "react-router";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { ExternalLink, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { getImageUrl } from "@/mocks/tmdb";
import { MovieCard } from "../components/MovieCard";
import { usePerson } from "../hooks/usePerson";
import { getMovieDetails } from "@/utils/personUtils";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { CustomError } from "@/components/custom/CustomError";
import { MovieStat } from "../components/actor/MovieStat";
import { PersonDates } from "../components/PersonDates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ActorPage() {
  // const { id } = useParams<{ id: string }>();

  const { slug } = useParams();

  const id = slug ? slug?.split("-").pop() : null;

  const [isBiographyOpen, setIsBiographyOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(21);
  const [searchParams, setSearchParams] = useSearchParams();

  const orderByParam = searchParams.get("orderBy") || "all";

  const validOrders = ["all", "score", "popular"] as const;

  const orderBy = validOrders.includes(orderByParam as any)
    ? (orderByParam as (typeof validOrders)[number])
    : "all";

  const {
    data: person,
    isLoading,
    error,
    topRatedMovie,
    worstRatedMovie,
    birthYear,
    deathYear,
    filteredCredits,
    totalMovies,
  } = usePerson(id ?? "1", "movie_credits,tv_credits", visibleCount, orderBy);

  const topRatedDetails = useMemo(
    () => getMovieDetails(topRatedMovie),
    [topRatedMovie]
  );

  const worstRatedDetails = useMemo(
    () => getMovieDetails(worstRatedMovie),
    [worstRatedMovie]
  );

  if (!id) {
    return (
      <CustomError
        title="Person Not Found"
        message="No person ID provided"
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  if (isLoading) {
    return <CustomLoading />;
  }

  if (error || !person) {
    return (
      <CustomError
        title="Person Not Found"
        message="The person you're looking for doesn't exist."
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  const hasLongBio = person.biography
    ? person.biography.split(/\s+/).length > 200
    : false;

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
                    src={getImageUrl(person.profile_path, "w500")}
                    alt={person.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Actor Info */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <h1 className="text-4xl font-bold text-foreground mb-2">
                    {person.name}
                  </h1>
                  <Badge variant="secondary">
                    {person.known_for_department}
                  </Badge>
                </div>

                {/* Top rated movie */}
                <MovieStat
                  label="Top rated movie:"
                  movie={topRatedMovie}
                  details={topRatedDetails}
                  emptyMessage="There is not a top rated movie"
                />

                {/* Worst rated movie */}
                <MovieStat
                  label="Worst rated movie:"
                  movie={worstRatedMovie}
                  details={worstRatedDetails}
                  emptyMessage="There is not a worst rated movie"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  {person.birthday && (
                    <PersonDates
                      date={person.birthday}
                      birthYear={birthYear}
                      isBirth={true}
                    />
                  )}

                  {person.deathday && (
                    <PersonDates
                      date={person.birthday}
                      birthYear={birthYear}
                      deathYear={deathYear}
                      isBirth={false}
                    />
                  )}

                  {person.place_of_birth && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">From:</span>
                      <span className="text-foreground">
                        {person.place_of_birth}
                      </span>
                    </div>
                  )}
                </div>

                {/* External Links */}
                <div className="flex flex-wrap gap-3">
                  {person.imdb_id && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={`https://www.imdb.com/name/${person.imdb_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        IMDb
                      </a>
                    </Button>
                  )}
                  {person.homepage && (
                    <Button variant="outline" size="sm" asChild>
                      <a
                        href={person.homepage}
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
                    {person.biography}
                  </p>

                  {/* Botón */}
                  {hasLongBio && (
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

        {/* Known For Section
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
        )} */}

        {/* Full Filmography */}
        {filteredCredits.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                Filmography
              </h2>
              <Select
                value={orderBy}
                onValueChange={(value: "all" | "score" | "popular") => {
                  setSearchParams((prev) => {
                    const newParams = new URLSearchParams(prev);
                    newParams.set("orderBy", value);
                    return newParams;
                  });
                }}
              >
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Order by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="score">Score</SelectItem>
                  <SelectItem value="popular">Popular</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
              {filteredCredits.map((credit) => (
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

        {visibleCount < totalMovies && (
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
