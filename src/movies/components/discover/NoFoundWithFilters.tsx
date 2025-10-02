import { Button } from "@/components/ui/button";
import { VideoOff } from "lucide-react";
import { useSearchParams } from "react-router";

export const NoFoundWithFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleClearAllFilters = () => {
    // Lista de filtros a limpiar
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
      <VideoOff aria-hidden="true" />
      <p className="text-muted-foreground text-lg ">
        No movies found with the current filters.
      </p>
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
