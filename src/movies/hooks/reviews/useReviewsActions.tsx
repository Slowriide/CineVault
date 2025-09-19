import { supabase } from "@/integrations/supabase/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ReviewProps {
  movie_id: string;
  media_type: "movie" | "tv";
  rating: number;
  content: string;
}

export const useReviewsActions = (userId?: string) => {
  const queryClient = useQueryClient();

  const addOrUpdateReview = useMutation({
    mutationFn: async (review: ReviewProps) => {
      if (!userId) throw new Error("Not logged in");

      const { error } = await supabase.from("reviews").upsert(
        {
          user_id: userId,
          ...review,
        },
        { onConflict: "user_id,movie_id" }
      );
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Review Saved!");
      queryClient.invalidateQueries({ queryKey: ["myreviews", userId] });
    },
  });

  const deleteReview = useMutation({
    mutationFn: async (movieId: string) => {
      if (!userId) throw new Error("Not logged in");

      const { error } = await supabase
        .from("reviews")
        .delete()
        .eq("user_id", userId)
        .eq("movie_id", movieId);
      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Review deleted!");
      queryClient.invalidateQueries({ queryKey: ["myreviews", userId] });
    },
  });

  return { addOrUpdateReview, deleteReview };
};
