import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { getImageUrl } from "@/mocks/tmdb";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { StarRating } from "./movie/StarRating";
import { useReviewsActions } from "../hooks/supabase/reviews/useReviewsActions";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router";
import type { supabaseReview } from "@/interfaces/MovieReviews";

interface Props {
  movie: NormalizedMovieDetailsData;
  existingReview?: supabaseReview;
  icon?: React.ReactNode;
  hover?: boolean;
  trigger?: React.ReactNode;
}

interface FormData {
  review: string;
}

export const ReviewDialog = ({ movie, existingReview, trigger }: Props) => {
  const [rating, setRating] = useState(existingReview?.rating ?? 0);
  const [open, setOpen] = useState(false);
  const { type } = useParams();
  const { session } = useAuth();
  const { addOrUpdateReview } = useReviewsActions(session?.user.id);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { review: existingReview?.content ?? "" },
  });

  const onSubmit = async (data: FormData) => {
    await addOrUpdateReview.mutateAsync({
      movie_id: movie.id.toString(),
      media_type:
        (existingReview?.media_type as "movie" | "tv") ??
        (type as "movie" | "tv"),
      rating: rating,
      content: data.review,
    });
    setOpen(false);
  };

  const isEditing = !!existingReview;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? (
          <span className="hover:text-blue-500 cursor-pointer">
            {existingReview ? "Edit review" : "Create review"}
          </span>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[500px] max-h-[300px] md:max-w-[700px] md:max-h-[500px]">
        <div className="grid grid-cols-3 gap-4 mt-5 max-w-[400px] max-h-[200px] md:max-w-[700px] md:max-h-[500px]">
          <div className="grid col-span-1 gap-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <img
                src={getImageUrl(movie.poster_path, "w780")}
                alt={movie.title}
                className="w-full h-full aspect-[2/3] object-cover"
              />
            </Card>
            <span className="hidden md:flex items-center justify-center text-xl text-foreground">
              {movie.title}
            </span>
          </div>
          <div className="col-span-2 flex flex-col gap-2 flex-1 ">
            <div className="flex space-x-2">
              <StarRating value={rating} onChange={setRating} />
              <span className="text-lg text-foreground">Rating</span>
            </div>
            <Textarea
              id="review"
              {...register("review", {
                required: true,
              })}
              rows={5}
              placeholder="Other users may interesten on your thoughts!!"
              className="resize-none w-full md:h-82 h-40  overflow-y-auto"
            />
            {errors.review && (
              <p className="text-sm text-destructive">Must be a review</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant={"outline"} className="hidden md:flex">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" onClick={handleSubmit(onSubmit)}>
            {isEditing ? "Update Review" : "Save Review"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
