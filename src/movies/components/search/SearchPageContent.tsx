import { CustomPagination } from "@/components/custom/CustomPagination";
import { ActorCard } from "../ActorCard";
import { MovieCard } from "../MovieCard";
import { SkeletonGrid } from "../skeletons/SkeletonGrid";
import { EmptyState } from "./EmptyState";
import { InitialState } from "./InitialState";
import type { NormalizedSearchResult } from "@/interfaces/SearchResponse";
import { CustomError } from "@/components/custom/CustomError";

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
  //Loading state
  if (isLoading) {
    return <SkeletonGrid count={21} />;
  }
  // Error state
  if (isError) {
    return <CustomError title={"Error searching"} message={"Please refresh"} />;
  }
  //Error state
  if (!query) {
    return <InitialState />;
  }
  //Empty state
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

      {filteredResults.length > 0 && (
        <CustomPagination totalPages={totalPages ?? 1} />
      )}
    </>
  );
};
