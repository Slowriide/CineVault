import { Heart, Star, StarHalf } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface ReviewProps {
  image: string;
  name: string;
  review: string;
  rating: number;
  likes: number;
  line?: boolean;
}

export const Reviews = ({
  image,
  likes,
  name,
  rating,
  review,
  line = true,
}: ReviewProps) => {
  const [expanded, setExpanded] = useState(false);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating); // número de estrellas llenas
    const hasHalf = rating % 1 >= 0.5; // si hay media estrella

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star key={`full-${i}`} className="w-4 h-4 text-primary fill-current" />
      );
    }

    if (hasHalf) {
      stars.push(<StarHalf key="half" className="w-4 h-4 text-primary" />);
    }

    const emptyStars = 10 - fullStars - (hasHalf ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-400" />);
    }

    return stars;
  };

  const isLong = review.length > 600;
  const displayedReview =
    !expanded && isLong ? review.slice(0, 600) + "..." : review;

  return (
    <div>
      <div className="flex items-start mt-5 ">
        <img
          src={image}
          alt="user"
          className="w-12 h-12 object-cover rounded-full mr-3 "
        />
        <div className="flex-1">
          <div className="flex space-x-2 items-center mb-2">
            <span> Review by</span>
            <span className="text-accent cursor-pointer">{name}</span>
            {renderStars(rating)}
            <span className="text-primary">({rating}/10) </span>
          </div>

          <p className=" mb-2">{displayedReview}</p>
          {isLong && (
            <Button
              variant="link"
              className="p-0 h-auto text-blue-500"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "Show less" : "Show more"}
            </Button>
          )}

          <div className=" text-gray-400 flex items-center">
            <Heart className="h-4 w-4 hover:text-red-600 cursor-pointer" />
            <span className=" ml-1">{likes} likes</span>
          </div>
        </div>
      </div>
      {line && <Separator className="mt-5" />}
    </div>
  );
};
