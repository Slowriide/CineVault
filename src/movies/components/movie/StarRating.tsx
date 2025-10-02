import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  max?: number;
}

export const StarRating = ({ value, onChange, max = 10 }: StarRatingProps) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating ?? value;

  const handlePointer = (
    e: React.PointerEvent<HTMLDivElement>,
    starIndex: number,
    commit: boolean
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const half = x < rect.width / 2;
    const newValue = starIndex + (half ? 0.5 : 1);

    if (commit) {
      onChange(newValue);
      setHoverRating(null);
    } else {
      setHoverRating(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight" && value < max) {
      onChange(value + 0.5);
    }
    if (e.key === "ArrowLeft" && value > 0.5) {
      onChange(value - 0.5);
    }
  };

  return (
    <div
      role="slider"
      aria-label="Rating"
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuemax={max}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="flex space-x-1 mb-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2"
    >
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFull = displayRating >= starValue;
        const isHalf =
          displayRating >= starValue - 0.5 && displayRating < starValue;

        return (
          <div
            key={index}
            className="relative cursor-pointer w-4 h-4 sm:w-6 sm:h-6"
            onPointerMove={(e) => handlePointer(e, index, false)}
            onPointerLeave={() => setHoverRating(null)}
            onPointerUp={(e) => handlePointer(e, index, true)}
          >
            {isFull ? (
              <Star className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6 fill-current" />
            ) : isHalf ? (
              <StarHalf className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6 fill-current" />
            ) : (
              <Star className="text-yellow-400 w-4 h-4 sm:w-6 sm:h-6" />
            )}
          </div>
        );
      })}
    </div>
  );
};
