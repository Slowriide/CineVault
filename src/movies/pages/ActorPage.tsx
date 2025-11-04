import { useParams, useSearchParams } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { getImageUrl } from "@/utils/tmdb";
import { MovieCard } from "../components/MovieCard";
import { usePerson } from "../hooks/usePerson";
import { getMovieDetails } from "@/utils/personUtils";
import { CustomError } from "@/components/custom/CustomError";
import { MovieStat } from "../components/actor/MovieStat";
import { PersonDates } from "../components/actor/PersonDates";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ActorPageSkeleton } from "./skeletons/ActorPageSkeleton";

export default function ActorPage() {
  // Get the URL slug parameter from React Router
  const { slug } = useParams();

  // Extract the numeric ID from the slug
  const id = slug ? slug?.split("-").pop() : null;

  // Local state
  const [isBiographyOpen, setIsBiographyOpen] = useState(false); // toggle full/short biography
  const [visibleCount, setVisibleCount] = useState(21); // how many credits to display initially
  const [searchParams, setSearchParams] = useSearchParams(); // for query params (sorting)

  // Get `orderBy` from query params or default to "all"
  const orderByParam = searchParams.get("orderBy") || "all";
  const validOrders = ["all", "score", "popular"] as const;
  const orderBy = validOrders.includes(orderByParam as any)
    ? (orderByParam as (typeof validOrders)[number])
    : "all";

  // Fetch actor data using custom hook
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

  // Memoize top-rated and worst-rated movie details for performance
  const topRatedDetails = useMemo(
    () => getMovieDetails(topRatedMovie),
    [topRatedMovie]
  );

  const worstRatedDetails = useMemo(
    () => getMovieDetails(worstRatedMovie),
    [worstRatedMovie]
  );

  // If no ID is provided, render a custom error page
  if (!id) {
    return (
      <CustomError
        title="Person Not Found"
        message="No person ID provided"
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  // Show skeleton loading while fetching data
  if (isLoading) {
    return <ActorPageSkeleton />;
  }

  // Show error page if fetching fails or no person is returned
  if (error || !person) {
    return (
      <CustomError
        title="Person Not Found"
        message="The person you're looking for doesn't exist."
        action={{ to: "/", label: "Back to home" }}
      />
    );
  }

  // Determine if biography is long (>200 words)
  const hasLongBio = person.biography
    ? person.biography.split(/\s+/).length > 200
    : false;

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="max-w-[1600px] container mx-auto px-4 py-8 space-y-8">
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
                {/* Name and department */}
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

                {/* Birth/death dates and place of birth */}
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

                  {/* Toggle button for long biographies */}
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

        {/* Full Filmography */}
        {filteredCredits.length > 0 && (
          <div className="space-y-4">
            {/* Header with sorting */}
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

            {/* Grid of movies/TV shows */}
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

        {/* Load more button if there are more credits to show */}
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
