import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, EllipsisVertical, Trash } from "lucide-react";
import { ReviewDialog } from "../ReviewDialog";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import type { supabaseReview } from "@/interfaces/MovieReviews";

interface DeleteDialogProps {
  onDelete: (e: React.MouseEvent<Element, MouseEvent>) => Promise<void>;
  review?: supabaseReview;
  movie: NormalizedMovieDetailsData;
}

export const EditOrDeleteDialog = ({
  review,
  movie,
  onDelete,
}: DeleteDialogProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <EllipsisVertical className="text-primary cursor-pointer hover:text-chart-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-background w-30">
        <DropdownMenuItem onClick={onDelete} className="cursor-pointer text-md">
          <Trash className="text-primary m2 size-5" />
          Delete
        </DropdownMenuItem>

        <ReviewDialog
          movie={movie}
          existingReview={review}
          trigger={
            <DropdownMenuItem
              className="cursor-pointer text-md"
              onSelect={(e) => e.preventDefault()}
            >
              <Edit className="text-primary size-5" />
              Edit
            </DropdownMenuItem>
          }
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
