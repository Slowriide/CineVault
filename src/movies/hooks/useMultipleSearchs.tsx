import { useQuery } from "@tanstack/react-query";
import { getMultipleSearchsAction } from "../api/get-multiple-searchs.action";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { normalizeSearchResults } from "@/utils/NormalizeResult";
import { useSearchParams } from "react-router";

export const useMultipleSearchs = (
  query: string,
  include_adult?: boolean,
  language: string = "us-US"
) => {
  const [searcParams] = useSearchParams();

  // const query = searcParams.get("query") || "";
  const pageQuery = searcParams.get("page") || 1;
  const page = Number(pageQuery);

  const result = useQuery({
    queryKey: ["multipleSearch", query, include_adult, language, page],
    queryFn: () =>
      getMultipleSearchsAction({ query, include_adult, page, language }),
    enabled: !!query,
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

  const a = result.data?.results.filter((m) => m.media_type === "movie");
  console.log(a);

  return {
    ...result,
    normalizedData: normalizedResults,
  };
};
