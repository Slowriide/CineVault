import { useSearchParams } from "react-router";
import { MovieCard } from "../components/MovieCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import { ActorCard } from "../components/ActorCard";
import type { MediaType } from "@/interfaces/SearchResponse";
import { FilterTabs } from "../components/FilterTabs";
import { CustomError } from "@/components/custom/CustomError";
import { useCallback, useMemo } from "react";
import { SkeletonGrid } from "../components/SkeletonGrid";
import { InitialState } from "../components/InitialState";
import { EmptyState } from "../components/EmptyState";

export const SearchPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get("query") || "";

  const {
    data,
    error,
    normalizedData: normalicedData,
    isLoading,
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

  if (!data && error) {
    return <CustomError title={error?.name} message={error?.message} />;
  }

  return (
    <div className="min-h-screen bg-gradient-hero">
      <div className="container py-8 mx-auto">
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
            data={data!}
          />
        )}

        {/* Loading State */}
        {isLoading && <SkeletonGrid count={20} />}

        {/* Results Grid */}
        {!isLoading && filteredResults.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
            {filteredResults.map((result) => {
              if (result.media_type === "person") {
                return (
                  <ActorCard
                    key={`person-${result.id}`}
                    adult={result.adult}
                    gender={result.gender}
                    id={result.id}
                    known_for_department={result.known_for_department}
                    name={result.name}
                    original_name={result.original_name}
                    popularity={result.popularity}
                    profile_path={result.profile_path}
                    credit_id={""}
                  />
                );
              }

              return (
                <MovieCard
                  key={`${result.media_type}-${result.id}`}
                  item={result}
                  mediaType={result.media_type}
                  size="xl"
                />
              );
            })}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && query && filteredResults.length === 0 && <EmptyState />}

        {/* Initial State */}
        {!query && <InitialState />}

        {query && !isLoading && filteredResults.length > 0 && (
          <CustomPagination totalPages={data?.total_pages ?? 1} />
        )}
      </div>
    </div>
  );
};
