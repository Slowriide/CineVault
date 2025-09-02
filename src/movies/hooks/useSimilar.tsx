import { useQuery } from "@tanstack/react-query";
import type { Type } from "../../interfaces/MovieCategory";
import { getSimilar } from "../api/get-similar.action";

export const useSimilar = (
  id: string,
  type: Type,
  page: number = 1,
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["similarMovies", { id, type, page, language }],
    queryFn: () => getSimilar({ id, type, page, language }),
    staleTime: 1000 * 60 * 5,
  });
};
