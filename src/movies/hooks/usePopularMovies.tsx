import { useQuery } from "@tanstack/react-query";
import { getPopularMoviesAction } from "../api/get-popular-movies.action";
import type { MovieCategory } from "../../interfaces/MovieCategory";

export const useMovies = (
  movieCategory: MovieCategory = "popular",
  page: number = 1,
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["popularMovies", { page, language, movieCategory }],
    queryFn: () => getPopularMoviesAction({ page, language, movieCategory }),
    staleTime: 1000 * 60 * 5,
  });
};
