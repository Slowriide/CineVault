import { supabase } from "@/integrations/supabase/supabaseClient";
import type { SupabaseMovie } from "@/utils/FavoriteToMovieMapper";

import { useQuery } from "@tanstack/react-query";

export const useWatched = (userId?: string) => {
  return useQuery<SupabaseMovie[]>({
    queryKey: ["watched", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watched")
        .select("*")
        .eq("user_id", userId!);

      if (error) throw new Error(error?.message);

      return data;
    },
    enabled: !!userId,
  });
};
