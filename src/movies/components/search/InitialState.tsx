import { SearchIcon } from "lucide-react";
import { memo } from "react";

/**
 * Displays an initial empty state for the search page.
 * Encourages users to start exploring movies, TV shows, or actors.
 * Shows a centered icon, title, and brief description.
 */
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
