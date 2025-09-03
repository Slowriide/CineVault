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
import { getBackdropUrl, getImageUrl } from "@/mocks/tmdb";
import { useFavorites } from "../hooks/useFavorite";
import { Carousel } from "../components/Carousel";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import type { MovieDetails } from "@/interfaces/MovieDetails";
import type { TVShowDetails } from "@/interfaces/TVShowDetails";
import { useCredits } from "../hooks/useCredits";
import type { Type } from "@/interfaces/MovieCategory";
import { useSimilar } from "../hooks/useSimilar";
import { Separator } from "@/components/ui/separator";
import { Reviews } from "../components/Review";

export default function MovieDetailsPage() {
  const { type, id } = useParams();
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
  const {
    data: credits,

    error: isErrorCredits,
  } = useCredits(id, type! as Type);

  const { data, isLoading } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  const {
    data: similarMovies,

    error: isErrorSimilar,
  } = useSimilar(id, type! as Type, 1);

  console.log(similarMovies);

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

      <div className="max-w-[1600px] mx-auto py-auto space-y-12">
        <div className="relative container py-20">
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
                {/* Reviews */}
                <div className="space-x-1 pt-10 lg:pt-18 ">
                  <div className="flex justify-between mb-1">
                    <span>Popular Reviews</span>
                    <span className="hover:text-blue-500 cursor-pointer">
                      MORE
                    </span>
                  </div>
                  <Separator className="mt-1 mb-5" />
                  <Reviews
                    image="https://s.yimg.com/ny/api/res/1.2/apvEPmxMybSaho8_zOMPjw--/YXBwaWQ9aGlnaGxhbmRlcjt3PTEyNDI7aD04Mjg7Y2Y9d2VicA--/https://media.zenfs.com/es/es.afp.com/e93ab154e393bec7e1dc3d0420b14e62"
                    likes={12}
                    name="Leandro"
                    rating={4.5}
                    review="Leandro Paredes's FUT Birthday card is rated 90, he is a 180cm | 5'11 tall, right-footed Argentina midfielder (CM) that plays for AS Roma in Serie A TIM. He has 5-star weak foot and 5-star skill moves, giving him the ability to perform every skill move in the game."
                  />
                  <Reviews
                    image="https://resizer.glanacion.com/resizer/v2/rodrigo-de-paul-llego-al-pais-y-mostro-su-osado-GUBEIUNUPJBFZO7YXKQN7MZPSE.png?auth=55a5f5a3d5418236e76009ec7332a46349b526c42024a0883fdedef0108408f3&width=1280&height=854&quality=70&smart=true"
                    likes={7}
                    name="Rodrigo"
                    rating={3}
                    review="Rodrigo De Paul's Team of the Season card is rated 93, he is a 180cm | 5'11 tall, right-footed Argentina midfielder (CM) that plays for Atlético de Madrid in LALIGA EA SPORTS. He has 4-star weak foot and 5-star skill moves, giving him the ability to perform every skill move in the game."
                  />
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
                {isErrorCredits ? (
                  <p className="text-red-500">Error loading movies</p>
                ) : (
                  credits?.cast.map((actor) => (
                    <Card
                      key={actor.id}
                      className="overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-colors duration-300"
                    >
                      <Link key={actor.id} to={`/person/${actor.id}`}>
                        <div className="aspect-[2/3] relative">
                          <img
                            src={
                              getImageUrl(actor.profile_path ?? "", "w342") ??
                              "/placeholder.svg"
                            }
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
                      </Link>
                    </Card>
                  ))
                )}
              </div>
            </TabsContent>

            <TabsContent value="similar">
              {isErrorSimilar ? (
                <p className="text-red-500">Error loading movies</p>
              ) : (
                <Carousel
                  title="Similar Movies"
                  items={similarMovies?.results ?? []}
                  mediaType={(type ?? "movie") as Type}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
