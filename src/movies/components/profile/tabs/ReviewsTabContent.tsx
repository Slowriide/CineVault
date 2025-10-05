import { TabsContent } from "@/components/ui/tabs";
import { MyReviewItem } from "../../MyReviewItem";
import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { supabaseReview } from "@/interfaces/MovieReviews";
import { SkeletonMyReview } from "../../skeletons/SkeletonMyReview";
import { CustomError } from "@/components/custom/CustomError";

interface ReviewsTabContentProps {
  myReviews: supabaseReview[];
  isError: boolean;
  isLoading: boolean;
}

export const ReviewsTabContent = ({
  myReviews,
  isError,
  isLoading,
}: ReviewsTabContentProps) => {
  return (
    <TabsContent value="reviews" className="space-y-6">
      {isLoading ? (
        <SkeletonMyReview />
      ) : isError ? (
        <CustomError
          title={`Error loading reviews`}
          message={"Please refresh"}
          height="h-40 items-center"
        />
      ) : myReviews.length === 0 ? (
        <div className="text-center py-12">
          <MessageSquare className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">No reviews yet</h3>
          <p className="text-muted-foreground mb-6">
            Share your thoughts about the movies you've watched
          </p>
          <Button asChild>
            <a href="/">Find Movies to Review</a>
          </Button>
        </div>
      ) : (
        <div className=" space-y-4 ">
          {myReviews.map((review) => (
            <MyReviewItem key={review.id} review={review} />
          ))}
        </div>
      )}
    </TabsContent>
  );
};
