import { supabase } from "@/integrations/supabase/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export const useWatched = (userId?: string) => {
  return useQuery({
    queryKey: ["watched", userId],
    queryFn: async () => {
      if (!userId) return [];
      const { data, error } = await supabase
        .from("watched")
        .select("*")
        .eq("user_id", userId);

      if (error) throw new Error(error?.message);

      return data;
    },
    enabled: !!userId,
  });
};
