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
  const counts = useMemo(() => {
    const result: Record<string, number> = {}; //object with filter types keys

    tabDefinitions.forEach(({ value }) => {
      if (value === "all") {
        result[value] = normalicedData.length;
      } else {
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
