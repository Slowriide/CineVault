import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { ProfileSidebar } from "../components/PerfilSidebar";
import { MovieCard } from "../components/MovieCard";
import { PopularReviews } from "../components/PopularReviews";
import { useMovies } from "../hooks/usePopularMovies";
import { useAuth } from "@/context/AuthContext";
import { useFavs } from "../hooks/favorites/useFavs";
import { SupabaseToMovieMapper } from "@/utils/FavoriteToMovieMapper";
import { useWatched } from "../hooks/watched/useWatched";
import { useWatchlist } from "../hooks/watchlist/useWatchlist";

export default function ProfileDashboard() {
  const [activeTab, setActiveTab] = useState("favorites");

  const { session } = useAuth();
  const userId = session?.user.id;

  const { data: favorites, isLoading, isError } = useFavs(userId);
  const {
    data: watcheds,
    isLoading: watchedsLoading,
    isError: watchedsError,
  } = useWatched(userId);

  const {
    data: watchList,
    isLoading: watchListLoading,
    isError: watchListError,
  } = useWatchlist(userId);

  if (isLoading || watchedsLoading || watchListLoading)
    return <p>Loading...</p>;
  if (isError || !favorites || !watcheds || !watchList)
    return <p>Error loading favorites</p>;

  const { data: popularData } = useMovies("popular");

  const { data: topRatedData } = useMovies("top_rated");

  if (!popularData || !topRatedData) {
    return;
  }

  const movies = popularData.results;

  return (
    <div className="min-h-screen bg-gradient-hero pt-10">
      <div className="max-w-[1600px] mx-auto container">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Right Main Area - Tabs */}
          <div className="lg:col-span-3">
            <Card className="bg-card border-border py-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  My Cinema Profile
                </CardTitle>
                <CardDescription>
                  Track your favorite movies, watchlist, and reviews
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="flex w-full justify-between items-center mb-6 h-10">
                    <TabsTrigger
                      value="favorites"
                      className="flex items-center gap-2 "
                    >
                      <Heart className="h-4 w-4 " />
                      <span className="hidden sm:inline">Favorites</span>
                      {favorites.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {favorites.length}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="watchlist"
                      className="flex items-center gap-2"
                    >
                      <Clock className="h-4 w-4" />
                      <span className="hidden sm:inline">Watchlist</span>

                      {watchList.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {watchList.length}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="watched"
                      className="flex items-center gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      <span className="hidden sm:inline">Watched</span>

                      {watcheds.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {watcheds.length}
                        </span>
                      )}
                    </TabsTrigger>

                    <TabsTrigger
                      value="reviews"
                      className="flex items-center gap-2"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Reviews</span>

                      {movies.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {movies.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Favorites Tab */}
                  <TabsContent value="favorites" className="space-y-6">
                    {favorites.length > 0 && !isError ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {favorites.map((fav) => {
                          // Asegurarse que metadata tenga el tipo correcto
                          const item = SupabaseToMovieMapper(fav);

                          return (
                            <MovieCard
                              key={`favorite-${fav.media_type}-${fav.movie_id}`}
                              item={item}
                              mediaType={item.media_type}
                              size="xl"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No favorites yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Start exploring movies and TV shows to build your
                          collection
                        </p>
                        <Button asChild>
                          <a href="/">Discover Movies</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Watchlist Tab */}
                  <TabsContent value="watchlist" className="space-y-6">
                    {watchList.length > 0 && !watchListError ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {watchList.map((watchList) => {
                          const item = SupabaseToMovieMapper(watchList);

                          return (
                            <MovieCard
                              key={`watchlist-${item.media_type}-${item.id}`}
                              item={item}
                              mediaType={item.media_type}
                              size="xl"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <Clock className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          Your watchlist is empty
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Add movies and shows you want to watch later
                        </p>
                        <Button asChild>
                          <a href="/">Browse Movies</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Watched Tab */}
                  <TabsContent value="watched" className="space-y-6">
                    {watcheds.length > 0 && !watchedsError ? (
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                        {watcheds.map((watched) => {
                          const item = SupabaseToMovieMapper(watched);

                          return (
                            <MovieCard
                              key={`watched-${item.media_type}-${item.id}`}
                              item={item}
                              mediaType={item.media_type}
                              size="xl"
                            />
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <CheckCircle className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No watched movies yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Mark movies as watched to track your viewing history
                        </p>
                        <Button asChild>
                          <a href="/">Start Watching</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>

                  {/* Reviews Tab */}
                  <TabsContent value="reviews" className="space-y-6">
                    {movies.length > 0 ? (
                      <div className="space-y-4">
                        <PopularReviews />
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
                        <h3 className="text-lg font-semibold mb-2">
                          No reviews yet
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          Share your thoughts about the movies you've watched
                        </p>
                        <Button asChild>
                          <a href="/">Find Movies to Review</a>
                        </Button>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
