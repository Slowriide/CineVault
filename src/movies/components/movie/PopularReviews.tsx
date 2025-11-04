import { Separator } from "@/components/ui/separator";
import { Reviews } from "../reviews/Reviews";
import { useReviews } from "../../hooks/useReviews";
import { getImageUrl } from "@/utils/tmdb";
import { Link, useParams } from "react-router";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";

import { lazy, useMemo } from "react";
import { useMyReviewForMovie } from "../../hooks/supabase/reviews/useMyReviews";
import { useAuth } from "@/context/AuthContext";

// Lazy load the review dialog for performance optimization
const ReviewDialog = lazy(() => import("../reviews/ReviewDialog"));

interface Props {
  movie: NormalizedMovieDetailsData;
}

/**
 * PopularReviews component displays the most popular reviews for a movie or TV show.
 * It also provides:
 * - A button to add a new review using the ReviewDialog component
 * - A link to view all reviews for the movie/TV show
 * - Handles user-specific reviews (fetching current user's review)
 * - Lazy loads review dialog for performance
 */
export const PopularReviews = ({ movie }: Props) => {
  // Fetch popular and all reviews using a custom hook
  const { popularReviews: reviews, reviews: allReviews } = useReviews();

  // Get movie/TV slug and type from URL
  const { slug, type } = useParams();
  const { session } = useAuth();
  const userId = session?.user.id;

  // Parse movie/TV id from slug (assumes slug ends with the id)
  const id = useMemo(
    () => (slug ? parseInt(slug.split("-").pop()!) : null),
    [slug]
  );

  // Fetch the current user's review for this movie/TV
  const { review } = useMyReviewForMovie(
    userId,
    id?.toString(),
    type as "movie" | "tv"
  );

  // Determine if there are any popular reviews
  const areReviews = useMemo(() => reviews && reviews.length > 0, [reviews]);

  return (
    <div className="space-x-1 pt-4 lg:pt-10 max-w-[1600px] mx-auto">
      {/* Header section: title + actions */}
      <div className="flex justify-between mb-1 text-md">
        <span>Popular Reviews</span>

        <div className="flex space-x-4">
          {/* Button to open review dialog */}
          <ReviewDialog movie={movie} existingReview={review} />

          {/* Link to view all reviews */}
          <Link to={`/${type}/${id}/reviews`}>
            <span className="hover:text-blue-500 cursor-pointer">
              {`All reviews (${allReviews?.length ?? ""})`}
            </span>
          </Link>
        </div>
      </div>

      {/* Separator line */}
      <Separator className="mt-1 mb-5" />

      {/* Display placeholder if there are no reviews */}
      {!areReviews && (
        <span className="flex justify-center mt-10">
          Be the first to review!!!
        </span>
      )}

      {/* Render popular reviews */}
      {reviews.map((review) => (
        <Reviews
          key={`${review.id}-${review.author}`}
          image={getImageUrl(review.author_details.avatar_path ?? "")}
          name={review.author}
          review={review.content}
          rating={review.author_details.rating}
          likes={7} // Placeholder, could be dynamic later
        />
      ))}
    </div>
  );
};
