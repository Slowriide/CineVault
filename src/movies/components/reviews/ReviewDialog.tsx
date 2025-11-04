import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { getImageUrl } from "@/utils/tmdb";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router";
import type { supabaseReview } from "@/interfaces/MovieReviews";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useReviewsActions } from "@/movies/hooks/supabase/reviews/useReviewsActions";
import { StarRating } from "../movie/StarRating";
import { toast } from "sonner";

interface Props {
  movie: NormalizedMovieDetailsData;
  existingReview?: supabaseReview; // Optional, present if editing a review
  trigger?: React.ReactNode; // Optional custom trigger element
}

interface FormData {
  review: string; // Review content from textarea
}

/**
 * ReviewDialog component allows users to create or edit a review for a movie or TV show.
 * It includes:
 * - Star rating selector (via StarRating component)
 * - Text area for review content
 * - Handles form submission and updates the review in Supabase
 */
export const ReviewDialog = ({ movie, existingReview, trigger }: Props) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 0); // Default to existing rating if editing
  const [open, setOpen] = useState(false); // Controls dialog visibility
  const { type } = useParams(); // Get "movie" or "tv" from route
  const { session } = useAuth(); // Get current user session
  const { addOrUpdateReview } = useReviewsActions(session?.user.id); // Hook for handling review mutations
  const userId = session?.user.id;

  // React Hook Form setup for the review text area
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { review: existingReview?.content ?? "" }, // Prefill with existing review if editing
  });

  /**
   * Handles form submission.
   * Validates login and then calls Supabase mutation to add or update review.
   */
  const onSubmit = async (data: FormData) => {
    if (!userId) {
      toast.error("You must be logged in to add reviews");
      return;
    }

    await addOrUpdateReview.mutateAsync({
      movie_id: movie.id.toString(),
      media_type:
        (existingReview?.media_type as "movie" | "tv") ??
        (type as "movie" | "tv"),
      rating: rating,
      content: data.review,
    });

    // Close dialog after submission
    setOpen(false);
  };

  const isEditing = !!existingReview; // Flag to determine if dialog is editing an existing review

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger element to open the dialog */}
      <DialogTrigger asChild>
        {trigger ?? (
          <span className="hover:text-blue-500 cursor-pointer">
            {existingReview ? "Edit review" : "Create review"}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[350px] max-h-[350px] sm:max-w-[520px] sm:max-h-[400px] md:max-w-[700px] md:max-h-[500px]">
        {/* Hidden header elements for accessibility */}
        <DialogHeader>
          <DialogTitle className="sr-only">Create review</DialogTitle>
          <DialogDescription className="sr-only">
            Create your own review
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-4 mt-5 max-w-[350px] max-h-[350px] sm:max-w-[520px] sm:max-h-[400px] md:max-w-[700px] md:max-h-[500px]">
          {/* Movie Poster + Title section */}
          <div className="grid col-span-1 gap-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <img
                src={getImageUrl(movie.poster_path, "w780")}
                alt={movie.title}
                className="w-full h-full aspect-[2/3] object-cover"
              />
            </Card>
            {/* Display title on medium screens and above */}
            <span className="hidden md:flex items-center justify-center text-xl text-foreground">
              {movie.title}
            </span>
          </div>

          {/* Review form section */}
          <div className="col-span-2 flex flex-col gap-2 flex-1">
            {/* Star rating selector */}
            <div className="flex space-x-2">
              <StarRating value={rating} onChange={setRating} />
              <span className="text-lg text-foreground hidden md:flex">
                Rating
              </span>
            </div>

            {/* Review text input */}
            <Textarea
              id="review"
              {...register("review", { required: true })}
              rows={5}
              placeholder="Other users may be interested in your thoughts!"
              className="resize-none w-full md:h-82 h-40 overflow-y-auto text-sm sm:text-md"
            />
            {/* Validation error */}
            {errors.review && (
              <p className="text-sm text-destructive">Must be a review</p>
            )}
          </div>
        </div>

        {/* Footer with action buttons */}
        <DialogFooter>
          {/* Close button */}
          <DialogClose asChild>
            <Button variant={"outline"} className="hidden sm:flex">
              Close
            </Button>
          </DialogClose>

          {/* Submit button */}
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {isEditing ? "Update Review" : "Save Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
