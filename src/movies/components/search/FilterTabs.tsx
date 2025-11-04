import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  MediaType,
  NormalizedSearchResult,
} from "@/interfaces/SearchResponse";
import { useMemo } from "react";

interface FilterTabsProps {
  filter: string;
  normalicedData: NormalizedSearchResult[];
  handleFilterChanged: (newFilter: MediaType | "all") => void;
}

/**
 * Renders a set of filter tabs (All, Movies, TV Shows, Persons) for a search results list.
 * Each tab displays a count of items matching that category and allows the user to filter results.
 * It supports an "active" state to indicate the currently selected filter.
 */
const tabDefinitions: { label: string; value: MediaType | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Movies", value: "movie" },
  { label: "TV Shows", value: "tv" },
  { label: "Persons", value: "person" },
];

export const FilterTabs = ({
  filter,
  normalicedData,
  handleFilterChanged,
}: FilterTabsProps) => {
  // Compute counts for each tab type based on current search results
  const counts = useMemo(() => {
    const result: Record<string, number> = {};

    tabDefinitions.forEach(({ value }) => {
      if (value === "all") {
        result[value] = normalicedData.length; // total items
      } else {
        // count items matching this media_type
        result[value] = normalicedData.filter(
          (r) => r.media_type === value
        ).length;
      }
    });

    return result;
  }, [normalicedData]);

  return (
    <div className="flex justify-center mb-8">
      <div className="flex overflow-x-auto flex-nowrap space-x-1 bg-muted/50 rounded-lg p-1">
        {tabDefinitions.map(({ label, value }) => (
          <Button
            key={value}
            variant={filter === value ? "default" : "ghost"}
            size="sm"
            onClick={() => handleFilterChanged(value)}
            className={`${
              filter === value ? "bg-primary text-primary-foreground" : ""
            } text-xs sm:text-sm px-2 flex-shrink-0`}
          >
            {label}
            <Badge variant="secondary" className="ml-2 text-xs">
              {counts[value]}
            </Badge>
          </Button>
        ))}
      </div>
    </div>
  );
};
