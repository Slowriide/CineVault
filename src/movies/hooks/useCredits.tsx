import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { getCredits } from "../api/get-credits.action";
import type { PersonDetails } from "@/interfaces/Credits";

export const useCredits = (
  movieId: string,
  type: Type,
  visibleCount: number = 21,
  language: string = "us-US"
) => {
  const response = useQuery({
    queryKey: ["credits", movieId, type, language],
    queryFn: () => getCredits({ movieId, type, language }),
  });

  const allPersons: PersonDetails[] = [...(response.data?.cast ?? [])];

  const visiblePersons = allPersons.slice(0, visibleCount);

  return {
    ...response,
    visiblePersons,
    allPersons,
  };
};
