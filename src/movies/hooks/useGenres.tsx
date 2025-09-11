import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { getGenres } from "@/utils/tmdbUtils";
import type { Genre } from "@/interfaces/Genres";

export const useGenres = (type: Type, language: string = "us-US") => {
  return useQuery<Genre[]>({
    queryKey: ["genres", type, language],
    queryFn: async () => await getGenres(type, language),
    staleTime: 1000 * 60 * 60 * 24 * 7,
  });
};
