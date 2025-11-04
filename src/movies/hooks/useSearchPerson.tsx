import { useQuery } from "@tanstack/react-query";
import { getSearchPersonAction } from "../api/get-search-person.action";
import { useState } from "react";
import type { SearchResponse } from "@/interfaces/Searchs";

/**
 * useSearchPerson
 *
 * Handles searching for people (actors, crew, etc.) by query string.
 * Filters out results without a profile picture and sorts by popularity.
 *
 * @param page - Current page for paginated results (default 1)
 * @param language - Language for the API results (default "us-US")
 */
export const useSearchPerson = (
  page: number = 1,
  language: string = "us-US"
) => {
  // Local state to store the current search query
  const [query, setQuery] = useState("");

  // React Query to fetch search results
  const { data, isLoading, error } = useQuery<SearchResponse>({
    queryKey: ["searchPerson", { query, page, language }], // Unique query key
    queryFn: async () => {
      // Return empty results if the query is too short
      if (query.length < 2) {
        return {
          page: 1,
          results: [],
          total_pages: 1,
          total_results: 0,
        };
      }

      // Fetch results from the API
      const response = await getSearchPersonAction({ query, page, language });

      if (!response) throw new Error("Error fetching actors");

      return response;
    },
    staleTime: 1000 * 60 * 5, // Cache results for 5 minutes
    enabled: query.length >= 2, // Only run query if query has >= 2 characters
  });

  // Filter out actors without a profile picture and sort by popularity
  const personsWithPic =
    data?.results
      .filter((actor) => actor.profile_path) // only include actors with a profile image
      .sort((a, b) => b.popularity - a.popularity) ?? [];

  return {
    query, // Current search query
    setQuery, // Function to update query
    results: personsWithPic ?? [], // Filtered and sorted results
    isLoading, // Loading state
    error, // Error state
  };
};
