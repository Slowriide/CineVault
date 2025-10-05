import { SearchIcon } from "lucide-react";
import { memo } from "react";

export const InitialState = memo(() => {
  return (
    <div className="text-center py-12">
      <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Discover Movies & TV Shows</h3>
      <p className="text-muted-foreground">
        Search for your favorite movies, TV shows, and actors.
      </p>
    </div>
  );
});
