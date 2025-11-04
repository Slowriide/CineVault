import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import type { supabaseReview } from "@/interfaces/MovieReviews";
import { lazy } from "react";

// Lazy load the review dialog to avoid loading it until needed
const ReviewDialog = lazy(() => import("../reviews/ReviewDialog"));

interface DeleteDialogProps {
  onDelete: (e: React.MouseEvent<Element, MouseEvent>) => Promise<void>;
  review?: supabaseReview;
  movie: NormalizedMovieDetailsData;
}

/**
 * Renders a dropdown menu for editing or deleting a review.
 * Includes lazy-loaded ReviewDialog for editing and a delete action.
 */
export const EditOrDeleteDialog = ({
  review,
  movie,
  onDelete,
}: DeleteDialogProps) => {
  return (
    <DropdownMenu>
      {/* Trigger button for the dropdown */}
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-primary cursor-pointer hover:text-chart-5" />
      </DropdownMenuTrigger>

      {/* Dropdown content */}
      <DropdownMenuContent className="bg-background w-30">
        {/* Edit option opens a lazy-loaded review dialog */}
        <ReviewDialog
          movie={movie}
          existingReview={review}
          trigger={
            <DropdownMenuItem
              className="cursor-pointer text-md"
              onSelect={(e) => e.preventDefault()} // Prevent default focus behavior
              aria-label="Add or edit review"
            >
              <Edit className="text-primary size-5" />
              Edit
            </DropdownMenuItem>
          }
        />

        {/* Delete option triggers the passed onDelete handler */}
        <DropdownMenuItem
          onClick={onDelete}
          className="cursor-pointer text-md"
          aria-label="Delete review"
        >
          <Trash className="text-primary m2 size-5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
