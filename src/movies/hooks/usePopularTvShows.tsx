import { useQuery } from "@tanstack/react-query";
import { getPopularTvShowsAction } from "../api/get-popular-tvshow.action";

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
