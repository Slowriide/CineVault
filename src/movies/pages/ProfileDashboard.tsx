import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Heart, Clock, CheckCircle, MessageSquare } from "lucide-react";
import { ProfileSidebar } from "../components/PerfilSidebar";
import { useAuth } from "@/context/AuthContext";
import { useFavs } from "../hooks/favorites/useFavs";
import { useWatched } from "../hooks/watched/useWatched";
import { useWatchlist } from "../hooks/watchlist/useWatchlist";
import { useMyReviews } from "../hooks/supabase/reviews/useMyReviews";
import { useSearchParams } from "react-router";
import { ProfileTabsContent } from "../components/profile/tabs/ProfileTabsContent";
import { ReviewsTabContent } from "../components/profile/tabs/ReviewsTabContent";

export function ProfileDashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "favorites";

  const { session } = useAuth();
  const userId = session?.user.id;

  const {
    data: favorites = [],
    isLoading: isFavsLoading,
    isError: isFavsError,
  } = useFavs(userId);

  const {
    data: watchList = [],
    isLoading: isWatchListLoading,
    isError: isWatchListError,
  } = useWatchlist(userId);

  const {
    data: watcheds = [],
    isLoading: iswWatchedsLoading,
    isError: isWatchedsError,
  } = useWatched(userId);

  const {
    data: myReviews = [],
    isLoading: isReviewsLoading,
    isError: isReviewsError,
  } = useMyReviews(userId);

  const handleTabChange = (tab: string) => {
    searchParams.set("tab", tab);
    setSearchParams(searchParams);
  };

  return (
    <div className="min-h-screen bg-gradient-hero mx-4 my-4">
      <div className="max-w-[1600px] mx-auto container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Left Sidebar - Profile Info */}
          <div className="lg:col-span-1">
            <ProfileSidebar />
          </div>

          {/* Right Main Area - Tabs */}
          <div className="md:col-span-3">
            <Card className="bg-card border-border py-8">
              {/* Header */}
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-6 w-6 text-primary" />
                  My Cinema Profile
                </CardTitle>
                <CardDescription>
                  Track your favorite movies, watchlist, and reviews
                </CardDescription>
              </CardHeader>

              {/* Content */}
              <CardContent>
                <Tabs
                  value={tab}
                  onValueChange={handleTabChange}
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

                      {myReviews.length > 0 && (
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          {myReviews.length}
                        </span>
                      )}
                    </TabsTrigger>
                  </TabsList>

                  {/* Favorites Tab */}
                  <ProfileTabsContent
                    movies={favorites}
                    isError={isFavsError}
                    isLoading={isFavsLoading}
                    value={"favorites"}
                    title={"You don't have any favorites yet"}
                    subtitle={"Add your favorite movies and shows"}
                  />

                  {/* Watchlist Tab */}
                  <ProfileTabsContent
                    movies={watchList}
                    isError={isWatchListError}
                    isLoading={isWatchListLoading}
                    value={"watchlist"}
                    title="Your watchlist is empty"
                    subtitle="Add movies and shows you want to watch later"
                  />

                  {/* Watched Tab */}
                  <ProfileTabsContent
                    movies={watcheds}
                    isError={isWatchedsError}
                    isLoading={iswWatchedsLoading}
                    value={"watched"}
                    title={"No watched movies yet"}
                    subtitle={
                      "Mark movies as watched to track your viewing history"
                    }
                  />

                  {/* Reviews Tab */}
                  <ReviewsTabContent
                    myReviews={myReviews}
                    isError={isReviewsError}
                    isLoading={isReviewsLoading}
                  />
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
