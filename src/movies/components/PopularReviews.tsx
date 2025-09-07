import { Separator } from "@/components/ui/separator";
import { Reviews } from "./Review";
import { useReviews } from "../hooks/useReviews";
import { getImageUrl } from "@/mocks/tmdb";

export const PopularReviews = () => {
  const { reviews } = useReviews();

  const areReviews = reviews.length > 0;

  return (
    <div className="space-x-1 pt-10 lg:pt-18 ">
      <div className="flex justify-between mb-1">
        <span>Popular Reviews</span>
        <span className="hover:text-blue-500 cursor-pointer">MORE</span>
      </div>
      <Separator className="mt-1 mb-5" />

      {!areReviews && (
        <span className="flex justify-center mt-10">
          Be the first to review!!!
        </span>
      )}

      {reviews.map((review) => (
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
