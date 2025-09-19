import { Separator } from "@/components/ui/separator";
import { Reviews } from "./Review";
import { useReviews } from "../hooks/useReviews";
import { getImageUrl } from "@/mocks/tmdb";
import { Link, useParams } from "react-router";

export const PopularReviews = () => {
  const { popularReviews: reviews, reviews: allReviews } = useReviews();
  const { slug, type } = useParams();

  const id = slug ? parseInt(slug.split("-").pop()!) : null;

  const areReviews = reviews && reviews.length > 0;

  return (
    <div className="space-x-1 pt-10 lg:pt-16 ">
      <div className="flex justify-between mb-1 ">
        <span>Popular Reviews</span>
        <div className="space-x-4">
          <span className="hover:text-blue-500 cursor-pointer">Create</span>
          <Link to={`/${type}/${id}/reviews`}>
            <span className="hover:text-blue-500 cursor-pointer">
              {`All reviews (${allReviews?.length ?? ""})`}
            </span>
          </Link>
        </div>
      </div>
      <Separator className="mt-1 mb-5" />

      {!areReviews && (
        <span className="flex justify-center mt-10">
          Be the first to review!!!
        </span>
      )}

      {reviews!.map((review) => (
        <Reviews
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
