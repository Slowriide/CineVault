import { supabase } from "@/integrations/supabase/supabaseClient";
import type { SupabaseMovie } from "@/utils/FavoriteToMovieMapper";

import { useQuery } from "@tanstack/react-query";

export const useFavs = (userId?: string) => {
  return useQuery<SupabaseMovie[]>({
    queryKey: ["favorites", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("favorites")
        .select("*")
        .eq("user_id", userId!);

      if (error) throw new Error(error.message);

      return data;
    },
    enabled: !!userId,
  });
};
