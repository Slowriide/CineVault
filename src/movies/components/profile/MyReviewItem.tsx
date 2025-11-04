import type { supabaseReview } from "@/interfaces/MovieReviews";
import { useMovieDetails } from "../../hooks/useMovieDetails";
import { useTVShowDetails } from "../../hooks/useTVShowDetails";
import { Card } from "@/components/ui/card";
import { getBackdropUrl } from "@/utils/tmdb";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import { Separator } from "@/components/ui/separator";
import { useReviewsActions } from "../../hooks/supabase/reviews/useReviewsActions";
import { useAuth } from "@/context/AuthContext";
import { useSupabaseProfile } from "../../hooks/supabase/profile/useSupabaseProfile";
import { CustomError } from "@/components/custom/CustomError";
import { EditOrDeleteDialog } from "./EditOrDeleteDialog";
import { MyReview } from "./MyReview";
import * as React from "react";

/**
 * Renders a single review item in the user's profile with:
 * - Movie/TV show poster linking to the detail page
 * - Review content with rating and likes
 * - User avatar and name
 * - Edit/Delete actions for the review
 */
export const MyReviewItem = ({ review }: { review: supabaseReview }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const movieId = review.movie_id ?? "";

  // Fetch user profile for avatar and username
  const { getProfile } = useSupabaseProfile(userId);
  const profileData = getProfile.data;

  // Fetch movie or TV show details based on media type
  const movieHook =
    review.media_type === "movie"
      ? useMovieDetails(movieId)
      : useTVShowDetails(movieId);
  const { data: movie, isError } = movieHook;

  const { deleteReview } = useReviewsActions(userId);

  // Error handling
  if (!movie || !review || isError) {
    return <CustomError title={"Error"} message={"Error fetching reviews"} />;
  }

  // Construct link to movie or TV show detail page
  const linkTo =
    review.media_type === "movie"
      ? `/movie/${slugify(movie!.title, movie!.id)}`
      : `/tv/${slugify(movie!.title, movie!.id)}`;

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await deleteReview.mutateAsync(movie.id.toString());
  };

  return (
    <div>
      <div className="flex items-center justify-items-center gap-4 overflow-hidden">
        {/* Movie/TV poster linking to detail page */}
        <Link to={linkTo} className="flex-shrink-0">
          <Card className="group relative grid-cols-1 overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-none hover:shadow-glow hover:-translate-y-1 mt-1 w-26">
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg">
              <img
                src={getBackdropUrl(movie?.poster_path ?? "")}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </Link>

        {/* User review */}
        <div className="flex flex-1 min-w-0">
          <MyReview
            image={profileData?.avatar_url ?? "/profile_placeholder.png"}
            name={profileData?.username ?? "User"}
            review={review.content ?? ""}
            rating={review.rating ?? 0}
            likes={7}
            line={false}
          />
        </div>

        {/* Edit/Delete review actions */}
        <EditOrDeleteDialog
          onDelete={handleDeleteClick}
          movie={movie}
          review={review}
        />
      </div>

      <Separator className="mt-6" />
    </div>
  );
};
