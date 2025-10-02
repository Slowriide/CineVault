import type { supabaseReview } from "@/interfaces/MovieReviews";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Card } from "@/components/ui/card";
import { getBackdropUrl } from "@/mocks/tmdb";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { Separator } from "@/components/ui/separator";
import { useReviewsActions } from "../hooks/supabase/reviews/useReviewsActions";
import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomError } from "@/components/custom/CustomError";
import { useSupabaseProfile } from "../hooks/supabase/profile/useSupabaseProfile";
import { EditOrDeleteDialog } from "./profile/EditOrDeleteDialog";
import { MyReview } from "./profile/MyReview";

export const MyReviewItem = ({ review }: { review: supabaseReview }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const movieId = review.movie_id ?? "";

  const { getProfile } = useSupabaseProfile(userId);
  const profileData = getProfile.data;

  const movieHook =
    review.media_type === "movie"
      ? useMovieDetails(movieId)
      : useTVShowDetails(movieId);

  const { data: movie, isError } = movieHook;

  const { deleteReview } = useReviewsActions(userId);

  if (!movie || !review || isError) {
    return <CustomError title={"Error"} message={"Error fetching reviews"} />;
  }

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
        <Link to={linkTo} className="flex-shrink-0">
          <Card className="group relative grid-cols-1 overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-none hover:shadow-glow hover:-translate-y-1 mt-1 w-26">
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg ">
              <img
                src={getBackdropUrl(movie?.poster_path ?? "")}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </Link>

        <div className="flex flex-1 min-w-0 ">
          <MyReview
            image={profileData?.avatar_url ?? "/profile_placeholder.png"}
            name={profileData?.username ?? "User"}
            review={review.content ?? ""}
            rating={review.rating ?? 0}
            likes={7}
            line={false}
          />
        </div>
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
