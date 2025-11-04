import { useQuery } from "@tanstack/react-query";
import { getTvShowDetails } from "../api/get-tvShow-details.action";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { useTrailers } from "./useTrailers";

export const useTVShowDetails = (id: string, language: string = "us-US") => {
  const query = useQuery({
    queryKey: ["tvShowDetails", id, language],
    queryFn: () => getTvShowDetails({ id, language }),
    staleTime: 1000 * 60 * 5,
  });

  const { trailers } = useTrailers();

  const normalizedData: NormalizedMovieDetailsData | null = query.data
    ? {
        id: query.data.id,
        title: query.data.name,
        overview: query.data.overview,
        poster_path: query.data.poster_path ?? "/placeholder.svg",
        backdrop_path: query.data.backdrop_path ?? "",
        release_date: query.data.first_air_date,
        runtime: query.data.episode_run_time[0],
        vote_average: query.data.vote_average,
        vote_count: query.data.vote_count,
        genres: query.data.genres ?? [],
        homepage: query.data.homepage ?? null,
        tagline: query.data.tagline ?? "",
        seasons: query.data?.number_of_seasons ?? 0,
      }
    : null;

  return {
    ...query,
    data: normalizedData,
    trailers,
  };
};
