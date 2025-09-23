import { getPopularTvShowsAction } from "@/movies/api/get-popular-tvshow.action";
import { useQuery } from "@tanstack/react-query";

export const usePopularTvShows = (
  page: number = 1,
  language: string = "us-US"
) => {
  return useQuery({
    queryKey: ["tvShow", { page, language }],
    queryFn: () => getPopularTvShowsAction({ page, language }),
    staleTime: 1000 * 60 * 5,
  });
};
