import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export const StarRating = ({ value, onChange, max = 10 }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState(0);

  const displayRating = hoverRating || value;

  const handleClick = (starIndex: number, isHalf: boolean) => {
    const newRating = isHalf ? starIndex + 0.5 : starIndex + 1;
    onChange(newRating);
  };

  return (
    <div className="flex space-x-1 mb-2">
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFull = displayRating >= starValue;
        const isHalf =
          displayRating >= starValue - 0.5 && displayRating < starValue;

        return (
          <div key={index} className="relative cursor-pointer w-6 h-6">
            {/* Clickable left half */}
            <div
              className="absolute left-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHoverRating(index + 0.5)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleClick(index, true)}
            />
            {/* Clickable right half */}
            <div
              className="absolute right-0 top-0 w-1/2 h-full z-10"
              onMouseEnter={() => setHoverRating(index + 1)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => handleClick(index, false)}
            />
            {/* Star Icon */}
            {isFull ? (
              <Star className="text-yellow-400 w-6 h-6 fill-current" />
            ) : isHalf ? (
              <StarHalf className="text-yellow-400 w-6 h-6 fill-current" />
            ) : (
              <Star className="text-yellow-400  w-6 h-6" />
            )}
          </div>
        );
      })}
    </div>
  );
};
