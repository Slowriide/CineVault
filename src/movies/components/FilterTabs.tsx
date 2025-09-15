import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  MediaType,
  NormalizedSearchResult,
} from "@/interfaces/SearchResponse";

interface FilterTabsProps {
  filter: string;
  normalicedData: NormalizedSearchResult[];
  handleFilterChanged: (newFilter: MediaType | "all") => void;
}

export const FilterTabs = ({
  filter,
  normalicedData,
  handleFilterChanged,
}: FilterTabsProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex space-x-1 bg-muted/50 rounded-lg p-1">
        <Button
          variant={filter === "all" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFilterChanged("all")}
          className={
            filter === "all" ? "bg-primary text-primary-foreground" : ""
          }
        >
          All
          <Badge variant="secondary" className="ml-2 text-xs">
            {normalicedData.filter((r) => r.media_type).length}
          </Badge>
        </Button>

        <Button
          variant={filter === "movie" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFilterChanged("movie")}
          className={
            filter === "movie" ? "bg-primary text-primary-foreground" : ""
          }
        >
          Movies
          <Badge variant="secondary" className="ml-2 text-xs">
            {normalicedData.filter((r) => r.media_type === "movie").length}
          </Badge>
        </Button>
        <Button
          variant={filter === "tv" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFilterChanged("tv")}
          className={
            filter === "tv" ? "bg-primary text-primary-foreground" : ""
          }
        >
          TV Shows
          <Badge variant="secondary" className="ml-2 text-xs">
            {normalicedData.filter((r) => r.media_type === "tv").length}
          </Badge>
        </Button>
        <Button
          variant={filter === "person" ? "default" : "ghost"}
          size="sm"
          onClick={() => handleFilterChanged("person")}
          className={
            filter === "person" ? "bg-primary text-primary-foreground" : ""
          }
        >
          Persons
          <Badge variant="secondary" className="ml-2 text-xs">
            {normalicedData.filter((r) => r.media_type === "person").length}
          </Badge>
        </Button>
      </div>
    </div>
  );
};
