import { Separator } from "@/components/ui/separator";
import { Reviews } from "./Reviews";
import { useReviews } from "../hooks/useReviews";
import { getImageUrl } from "@/mocks/tmdb";
import { Link, useParams } from "react-router";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { ReviewDialog } from "./ReviewDialog";
import { useMemo } from "react";
import { useMyReviewForMovie } from "../hooks/supabase/reviews/useMyReviews";
import { useAuth } from "@/context/AuthContext";

interface Props {
  movie: NormalizedMovieDetailsData;
}

export const PopularReviews = ({ movie }: Props) => {
  const { popularReviews: reviews, reviews: allReviews } = useReviews();
  const { slug, type } = useParams();
  const { session } = useAuth();
  const userId = session?.user.id;

  const id = useMemo(() => {
    return slug ? parseInt(slug.split("-").pop()!) : null;
  }, [slug]);

  const { review } = useMyReviewForMovie(
    userId,
    id?.toString(),
    type as "movie" | "tv"
  );

  const areReviews = useMemo(() => reviews && reviews.length > 0, [reviews]);

  return (
    <div className="space-x-1 pt-4 lg:pt-10 ">
      <div className="flex justify-between mb-1 text-md">
        <span>Popular Reviews</span>

        {/* Buttons */}
        <div className="flex space-x-4">
          {/* Dialog */}

          <ReviewDialog movie={movie} hover={true} existingReview={review} />
          {/* All reviews */}
          <Link to={`/${type}/${id}/reviews`}>
            <span className="hover:text-blue-500 cursor-pointer">
              {`All reviews (${allReviews?.length ?? ""})`}
            </span>
          </Link>
        </div>
      </div>
      <Separator className="mt-1 mb-5" />

      {/* No reviews */}

      {!areReviews && (
        <span className="flex justify-center mt-10">
          Be the first to review!!!
        </span>
      )}

      {/* Reviews */}

      {reviews.map((review) => (
        <Reviews
          key={`${review.id}-${review.author}`}
          image={getImageUrl(review.author_details.avatar_path ?? "")}
          name={review.author}
          review={review.content}
          rating={review.author_details.rating}
          likes={7}
        />
      ))}
    </div>
  );
};
