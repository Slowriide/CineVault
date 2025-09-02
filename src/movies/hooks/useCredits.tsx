import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { getCredits } from "../api/get-credits.action";

export const useCredits = (
  movieId: string,
  type: Type,
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["credits", movieId, type, language],
    queryFn: () => getCredits({ movieId, type, language }),
  });
};
