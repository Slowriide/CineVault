import { useQuery } from "@tanstack/react-query";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { normalizeSearchResults } from "@/utils/NormalizeResult";
import { useSearchParams } from "react-router";
import { getMovieByFiltersAction } from "../api/get-movies-by-filters.action";

export const useMoviesByFilter = () => {
  const [searcParams] = useSearchParams();

  const language = searcParams.get("language") || "us-US";
  const sortBy = searcParams.get("sort") || undefined;
  const genreQuery = searcParams.get("genre") || undefined;
  const type = searcParams.get("type") || "movie";
  const year = searcParams.get("year") || undefined;
  const castString = searcParams.get("cast") || undefined;

  const genreString = genreQuery
    ? parseInt(genreQuery.split("-").pop()!).toString()
    : null;
  const genre = Number(genreString);

  const cast = castString
    ? parseInt(castString.split("-").pop()!).toString()
    : null;

  const pageQuery = searcParams.get("page") || 1;
  const page = Number(pageQuery);

  const result = useQuery({
    queryKey: [
      "multipleSearch",
      language,
      sortBy,
      genre,
      type,
      year,
      page,
      cast,
    ],
    queryFn: () =>
      getMovieByFiltersAction({
        language,
        sortBy,
        genre,
        type,
        year: Number(year),
        page,
        cast: Number(cast),
      }),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const normalizedResults: NormalizedSearchResult[] = result.data?.results
    ? (
        result.data.results
          .map(normalizeSearchResults)
          .filter(Boolean) as NormalizedSearchResult[]
      ).sort((a, b) => b.popularity - a.popularity)
    : [];

  return {
    ...result,
    normalizedData: normalizedResults,
  };
};
