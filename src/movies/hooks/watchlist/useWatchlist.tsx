import { supabase } from "@/integrations/supabase/supabaseClient";

import { useQuery } from "@tanstack/react-query";

export const useWatchlist = (userId?: string) => {
  return useQuery({
    queryKey: ["watchlist", userId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("watchlist")
        .select("*")
        .eq("user_id", userId!);

      if (error) throw new Error(error?.message);

      return data;
    },
    enabled: !!userId,
    initialData: [],
  });
};
