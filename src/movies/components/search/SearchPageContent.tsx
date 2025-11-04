import { CustomPagination } from "@/components/custom/CustomPagination";
import { ActorCard } from "../ActorCard";
import { MovieCard } from "../MovieCard";
import { SkeletonGrid } from "../skeletons/SkeletonGrid";
import { EmptyState } from "./EmptyState";
import { InitialState } from "./InitialState";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { CustomError } from "@/components/custom/CustomError";

/**
 * Component Purpose:
 * Renders search results for movies, TV shows, and actors.
 * Handles multiple states:
 * - Loading: shows skeleton grid
 * - Error: shows a custom error message
 * - Initial: when no query is entered
 * - Empty: when search returns no results
 * Displays results in a responsive grid and paginates if results exist.
 */
interface SearchPageContentProps {
  isLoading: boolean;
  isError: boolean;
  filteredResults: NormalizedSearchResult[];
  query: string;
  totalPages: number;
}

export const SearchPageContent = ({
  filteredResults,
  isLoading,
  query,
  totalPages,
  isError,
}: SearchPageContentProps) => {
  // Loading state: show skeletons while data is being fetched
  if (isLoading) {
    return <SkeletonGrid count={21} />;
  }

  // Error state: display error message
  if (isError) {
    return <CustomError title={"Error searching"} message={"Please refresh"} />;
  }

  // Initial state: when the user hasn't entered a search query
  if (!query) {
    return <InitialState />;
  }

  // Empty state: when query is entered but no results are found
  if (filteredResults.length === 0) {
    return <EmptyState />;
  }

  return (
    <>
      {/* Results Grid */}
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
                credit_id={""} // Default empty string for now
              />
            );
          }

          // Render Movie/TV results
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

      {/* Pagination: only show if there are results */}
      {filteredResults.length > 0 && (
        <CustomPagination totalPages={totalPages ?? 1} />
      )}
    </>
  );
};
