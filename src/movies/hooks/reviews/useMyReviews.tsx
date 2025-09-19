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
