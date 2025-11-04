import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import { memo } from "react";
import { Link } from "react-router";

export const EmptyState = memo(() => {
  return (
    <div className="text-center py-12">
      {/* Icon for empty state */}
      <SearchIcon className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />

      {/* Main message */}
      <h3 className="text-xl font-semibold mb-2">No results found</h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your search terms or browse popular content instead.
      </p>

      {/* Call to action button */}
      <Button asChild variant="outline" aria-label="Browse Movies">
        <Link to="/">Browse Popular Movies</Link>
      </Button>
    </div>
  );
});
