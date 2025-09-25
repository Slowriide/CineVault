import { useQuery } from "@tanstack/react-query";
import { getMovieDetails } from "../api/get-movie-details.action";
import type { NormalizedMovieDetailsData } from "@/interfaces/NormalizedMovieDetailsData";
import { useTrailers } from "./useTrailers";

export const useMovieDetails = (id: string, language: string = "us-US") => {
  const query = useQuery({
    queryKey: ["movieDetails", id, language],
    queryFn: () => getMovieDetails({ id, language }),
    staleTime: 1000 * 60 * 5,
    enabled: !!id,
  });

  const { trailers } = useTrailers();

  const normalizedData: NormalizedMovieDetailsData | null = query.data
    ? {
        id: query.data.id,
        title: query.data.title ?? "Untitled",
        overview: query.data.overview,
        poster_path: query.data.poster_path ?? "/placeholder.svg",
        backdrop_path: query.data.backdrop_path ?? "",
        release_date: query.data.release_date,
        runtime: query.data.runtime,
        vote_average: query.data.vote_average,
        vote_count: query.data.vote_count,
        genres: query.data.genres ?? [],
        homepage: query.data.homepage ?? null,
        tagline: query.data.tagline ?? "",
      }
    : null;
  console.log(trailers);
  return {
    ...query,
    data: normalizedData,
    trailers,
  };
};
