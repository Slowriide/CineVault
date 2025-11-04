import { Heart, Star, StarHalf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { memo, useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewProps {
  image: string;
  name: string;
  review: string;
  rating: number;
  likes: number;
  line?: boolean;
}

/**
 * Renders a user's review with:
 * - Avatar and username
 * - Star rating (supports half stars)
 * - Expandable/collapsible review text if too long
 * - Like button with count
 * - Optional separator line
 */
export const MyReview = memo(
  ({ image, likes, name, rating, review, line = true }: ReviewProps) => {
    const [expanded, setExpanded] = useState(false);

    // Generate stars including full, half, and empty stars
    const renderStars = (rating: number) => {
      const stars = [];
      const fullStars = Math.floor(rating);
      const hasHalf = rating % 1 >= 0.5;

      for (let i = 0; i < fullStars; i++) {
        stars.push(
          <Star
            key={`full-${i}`}
            className="w-4 h-4 text-primary fill-current"
          />
        );
      }

      if (hasHalf) {
        stars.push(<StarHalf key="half" className="w-4 h-4 text-primary" />);
      }

      const emptyStars = 10 - fullStars - (hasHalf ? 1 : 0);
      for (let i = 0; i < emptyStars; i++) {
        stars.push(
          <Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />
        );
      }

      return stars;
    };

    const isLong = review.length > 600;
    const displayedReview =
      !expanded && isLong ? review.slice(0, 600) + "..." : review;

    return (
      <div className="w-full">
        <div className="flex items-start mt-5 overflow-hidden">
          {/* User avatar */}
          <img
            src={image}
            alt="user"
            className="hidden sm:flex w-12 h-12 object-cover rounded-full mr-3 flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            {/* Header with name and star rating */}
            <div className="flex flex-wrap space-x-2 items-center mb-2 line-clamp-1">
              <span>Review by</span>
              <span className="text-accent cursor-pointer line-clamp-1">
                {name}
              </span>

              {/* Star rating */}
              <span className="gap-x-1 hidden sm:flex">
                {renderStars(rating)}
              </span>
              <Star className="flex sm:hidden w-4 h-4 text-primary fill-current" />
              <span className="text-primary">({rating}/10)</span>
            </div>

            {/* Review text with optional expand/collapse */}
            <p className="mb-2 break-words whitespace-pre-wrap overflow-hidden line-clamp-5 sm:line-clamp-none">
              {displayedReview}
            </p>
            {isLong && (
              <Button
                variant="link"
                className="p-0 h-auto text-blue-500"
                onClick={() => setExpanded((prev) => !prev)}
              >
                {expanded ? "Show less" : "Show more"}
              </Button>
            )}

            {/* Likes */}
            <div className="text-gray-400 flex items-center">
              <Heart className="h-4 w-4 hover:text-red-600 cursor-pointer" />
              <span className="ml-1">{likes} likes</span>
            </div>
          </div>
        </div>

        {/* Optional separator */}
        {line && <Separator className="mt-5" />}
      </div>
    );
  }
);
