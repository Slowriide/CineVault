import { Button } from "@/components/ui/button";
import { VideoOff } from "lucide-react";
import { useSearchParams } from "react-router";

/**
 * Displays a message when no movies/TV shows match the current filters.
 * Provides a button to clear all applied filters.
 */
export const NoFoundWithFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Clears all relevant query filters from the URL
  const handleClearAllFilters = () => {
    const filtersToRemove = [
      "language",
      "sort",
      "genre",
      "type",
      "year",
      "cast",
    ];
    filtersToRemove.forEach((filter) => searchParams.delete(filter));
    setSearchParams(searchParams);
  };

  return (
    <div className="justify-items-center text-center py-12 space-y-4">
      {/* Icon indicating no results */}
      <VideoOff aria-hidden="true" />

      {/* Informative message */}
      <p className="text-muted-foreground text-lg ">
        No movies found with the current filters.
      </p>

      {/* Button to clear filters and reset search */}
      <Button
        variant="outline"
        onClick={handleClearAllFilters}
        aria-label="Clear all filters"
      >
        Clear filters
      </Button>
    </div>
  );
};
