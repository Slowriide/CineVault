import { supabase } from "@/integrations/supabase/supabaseClient";
import type { supabaseReview } from "@/interfaces/MovieReviews";
import { useQuery } from "@tanstack/react-query";

export const useMyReviews = (userId?: string) => {
  return useQuery<supabaseReview[]>({
    queryKey: ["myreviews", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("reviews")
        .select("*")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false });

      if (error) throw new Error(error.message);
      return data;
    },
    enabled: !!userId,
  });
};

export const useMyReviewForMovie = (
  userId?: string,
  movieId?: string,
  type?: "movie" | "tv"
) => {
  const { data: reviews, ...rest } = useMyReviews(userId);

  const review = reviews?.find(
    (r) => r.movie_id === movieId && r.media_type === type
  );

  return { review, ...rest };
};
