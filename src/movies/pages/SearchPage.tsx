import { useSearchParams } from "react-router";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import type { MediaType } from "@/interfaces/SearchResponse";
import { FilterTabs } from "../components/search/FilterTabs";
import { CustomError } from "@/components/custom/CustomError";
import { useCallback, useMemo } from "react";
import { SearchPageContent } from "../components/search/SearchPageContent";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const {
    data,

    normalizedData: normalicedData,
    isLoading,
    isError,
  } = useMultipleSearchs(query);

  const filter = searchParams.get("filter") || "all";

  const handleFilterChanged = useCallback(
    (filter: MediaType | "all") => {
      searchParams.set("filter", filter);
      searchParams.set("page", "1");
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams]
  );

  const filteredResults = useMemo(
    () =>
      normalicedData.filter((result) => {
        if (filter === "all") return result.media_type;
        return result.media_type === filter;
      }),
    [filter, normalicedData]
  );

  if (!data && isError) {
    return <CustomError title={""} message={""} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container py-8 mx-auto p-4">
        {/* Search Header */}
        <div className="max-w-2xl mx-auto mb-8">
          {/* Results Summary */}
          {query && (
            <div className="text-center text-muted-foreground">
              {isLoading ? (
                <p>Searching...</p>
              ) : (
                <p>
                  {normalicedData.length > 0
                    ? `Found ${data?.total_results} results for "${query}"`
                    : `No results found for "${query}"`}
                </p>
              )}
            </div>
          )}
        </div>
        {/* Filter Tabs */}
        {normalicedData.length > 0 && (
          <FilterTabs
            filter={filter}
            normalicedData={normalicedData}
            handleFilterChanged={handleFilterChanged}
          />
        )}
        <SearchPageContent
          isLoading={isLoading}
          isError={isError}
          filteredResults={filteredResults}
          query={query}
          totalPages={data?.total_pages ?? 1}
        />
      </div>
    </div>
  );
};
