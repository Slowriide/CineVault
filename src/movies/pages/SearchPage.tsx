import { Link, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { MovieCard } from "../components/MovieCard";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import { ActorCard } from "../components/ActorCard";
import type { MediaType } from "@/interfaces/SearchResponse";
import { FilterTabs } from "../components/FilterTabs";
import { CustomError } from "@/components/custom/CustomError";

export const SearchPage = () => {
  const [searcParams, setSearchParams] = useSearchParams();

  const query = searcParams.get("query") || "";

  const {
    data,
    error,
    normalizedData: normalicedData,
    isLoading,
  } = useMultipleSearchs(query);

  const filter = searcParams.get("filter") || "all";

  const handleFilterChanged = (filter: MediaType | "all") => {
    searcParams.set("filter", filter);
    searcParams.set("page", "1");
    setSearchParams(searcParams);
  };

  const filteredResults = normalicedData.filter((result) => {
    if (filter === "all") return result.media_type;
    return result.media_type === filter;
  });

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
        {isLoading && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[2/3] bg-muted rounded-lg mb-3" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-3 w-16 bg-muted rounded" />
              </div>
            ))}
          </div>
        )}

        {/* Results Grid */}
        {!isLoading && filteredResults.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4 mb-6">
            {filteredResults.map((result) => {
              if (result.media_type === "person") {
                return (
                  <ActorCard
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
        {!isLoading && query && filteredResults.length === 0 && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-6">
              Try adjusting your search terms or browse popular content instead.
            </p>
            <Button asChild variant="outline">
              <Link to="/">Browse Popular Movies</Link>
            </Button>
          </div>
        )}

        {/* Initial State */}
        {!query && (
          <div className="text-center py-12">
            <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              Discover Movies & TV Shows
            </h3>
            <p className="text-muted-foreground">
              Search for your favorite movies, TV shows, and actors.
            </p>
          </div>
        )}
        {query && !isLoading && (
          <CustomPagination totalPages={data?.total_pages ?? 1} />
        )}
      </div>
    </div>
  );
};
