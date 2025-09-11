import { useQuery } from "@tanstack/react-query";
import { getSearchPersonAction } from "../api/get-search-person.action";
import { useState } from "react";
import type { SearchResponse } from "@/interfaces/Searchs";

export const useSearchPerson = (
  page: number = 1,
  language: string = "us-US"
) => {
  const [query, setQuery] = useState("");
  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["searchPerson", { query, page, language }],
    queryFn: async () => {
      if (query.length < 2) {
        return {
          page: 1,
          results: [],
          total_pages: 1,
          total_results: 0,
        };
      }

      const response = await getSearchPersonAction({ query, page, language });

      if (!response) throw new Error("Error fetching actors");

      return response;
    },
    staleTime: 1000 * 60 * 5,
    enabled: query.length >= 2,
  });

  const personsWithPic =
    data?.results
      .filter((actor) => actor.profile_path)
      .sort((a, b) => b.popularity - a.popularity) ?? [];

  return {
    query,
    setQuery,
    results: personsWithPic ?? [],
    isLoading,
    error,
  };
};
