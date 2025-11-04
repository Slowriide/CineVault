import { Star, StarHalf } from "lucide-react";
import { useState } from "react";

interface StarRatingProps {
  value: number; // Current rating value
  onChange: (value: number) => void; // Callback to update rating
  max?: number; // Maximum number of stars (default 10)
}

/**
 * StarRating component renders an interactive star-based rating control.
 * Features:
 * - Supports full and half-star precision based on pointer position.
 * - Updates rating on click or drag.
 * - Keyboard accessibility: ArrowLeft/ArrowRight adjust the rating in 0.5 increments.
 * - Dynamic rendering of full, half, and empty stars.
 * - Responsive size: smaller on mobile, larger on bigger screens.
 */
export const StarRating = ({ value, onChange, max = 10 }: StarRatingProps) => {
  // Local state to track the rating while hovering over stars
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  // Determine what rating to display: hovered rating or actual value
  const displayRating = hoverRating ?? value;

  /**
   * Handle pointer events for hover and click.
   * - Determines if the user is pointing at the left (half) or right (full) of the star.
   * - commit = true when pointer up (click), false when pointer move (hover)
   */
  const handlePointer = (
    e: React.PointerEvent<HTMLDivElement>,
    starIndex: number,
    commit: boolean
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // pointer position inside the star
    const half = x < rect.width / 2; // is it in the left half?
    const newValue = starIndex + (half ? 0.5 : 1); // calculate rating

    if (commit) {
      onChange(newValue); // commit rating on click
      setHoverRating(null); // reset hover state
    } else {
      setHoverRating(newValue); // preview rating on hover
    }
  };

  /**
   * Keyboard accessibility:
   * - Right arrow increases rating by 0.5
   * - Left arrow decreases rating by 0.5
   * - Clamped between 0.5 and max
   */
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
      role="slider" // accessibility: screen readers know this is a slider
      aria-label="Rating"
      aria-valuemin={0}
      aria-valuenow={value}
      aria-valuemax={max}
      tabIndex={0} // make div focusable for keyboard control
      onKeyDown={handleKeyDown}
      className="flex space-x-1 mb-2 focus:outline-none focus-visible:outline-2 focus-visible:outline-yellow-400 focus-visible:outline-offset-2"
    >
      {/* Render stars */}
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isFull = displayRating >= starValue; // full star
        const isHalf =
          displayRating >= starValue - 0.5 && displayRating < starValue; // half star

        return (
          <div
            key={index}
            className="relative cursor-pointer w-4 h-4 sm:w-6 sm:h-6"
            onPointerMove={(e) => handlePointer(e, index, false)} // hover
            onPointerLeave={() => setHoverRating(null)} // reset hover
            onPointerUp={(e) => handlePointer(e, index, true)} // click
          >
            {/* Render full, half, or empty star */}
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
