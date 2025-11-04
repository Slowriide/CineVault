import { useSearchParams } from "react-router";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import type { MediaType } from "@/interfaces/SearchResponse";
import { FilterTabs } from "../components/search/FilterTabs";
import { CustomError } from "@/components/custom/CustomError";
import { useCallback, useMemo } from "react";
import { SearchPageContent } from "../components/search/SearchPageContent";

export const SearchPage = () => {
  // Get query string and other search params from URL
  const [searchParams, setSearchParams] = useSearchParams();

  // The search term entered by the user
  const query = searchParams.get("query") || "";

  // Fetch search results using a custom hook
  const {
    data, // raw API response
    normalizedData: normalicedData, // normalized and filtered search results
    isLoading, // loading state
    isError, // error state
  } = useMultipleSearchs(query);

  // Current filter for search results (e.g., all, movie, tv, person)
  const filter = searchParams.get("filter") || "all";

  // Callback to update filter in URL and reset pagination
  const handleFilterChanged = useCallback(
    (filter: MediaType | "all") => {
      searchParams.set("filter", filter); // set filter param
      searchParams.set("page", "1"); // reset page to 1 when changing filter
      setSearchParams(searchParams); // apply new search params
    },
    [searchParams, setSearchParams]
  );

  // Memoized filtered results based on current filter
  const filteredResults = useMemo(
    () =>
      normalicedData.filter((result) => {
        if (filter === "all") return result.media_type; // keep all
        return result.media_type === filter; // filter by type
      }),
    [filter, normalicedData]
  );

  // Show error component if data fetching failed
  if (!data && isError) {
    return <CustomError title={""} message={""} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container py-8 mx-auto p-4">
        {/* Search Header / Summary */}
        <div className="max-w-2xl mx-auto mb-8">
          {query && (
            <div className="text-center text-muted-foreground">
              {isLoading ? (
                <p>Searching...</p> // Loading state
              ) : (
                <p>
                  {normalicedData.length > 0
                    ? `Found ${data?.total_results} results for "${query}"` // Show result count
                    : `No results found for "${query}"`}{" "}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Filter Tabs for search results (all, movie, tv, person) */}
        {normalicedData.length > 0 && (
          <FilterTabs
            filter={filter} // current selected filter
            normalicedData={normalicedData} // normalized search data
            handleFilterChanged={handleFilterChanged} // callback for filter change
          />
        )}

        {/* Main content: search results list */}
        <SearchPageContent
          isLoading={isLoading} // loading state
          isError={isError} // error state
          filteredResults={filteredResults} // filtered results to display
          query={query} // current search query
          totalPages={data?.total_pages ?? 1} // total number of pages for pagination
        />
      </div>
    </div>
  );
};
