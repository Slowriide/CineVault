import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/get-movie-details.action";

export const useMovieDetails = (id: string, language: string = "us-US") => {
  return useQuery({
    queryKey: ["movieDetails", id, language],
    queryFn: () => getMovieDetails({ id, language }),
    staleTime: 1000 * 60 * 5,
  });
};
