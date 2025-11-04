import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useSearchParams } from "react-router";

interface Props {
  totalPages: number; // Total number of available pages for pagination
}

// CustomPagination component: a reusable pagination control that reads and updates
// the "page" query parameter from the URL using React Router's useSearchParams.
export const CustomPagination = ({ totalPages }: Props) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get the current page from the URL query parameters.
  // If it's missing or invalid, default to page 1.
  const queryPage = searchParams.get("page") ?? "1";
  const page = isNaN(+queryPage) ? 1 : +queryPage;

  // Update the page number in the query string when navigation buttons are clicked.
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return; // Prevent invalid navigation
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  // Determine how many page buttons should be visible depending on screen width.
  // Smaller screens show fewer pages to prevent layout overflow.
  const maxVisible = window.innerWidth < 768 ? 5 : 10;

  // Calculate which page numbers to display (a sliding window around the current page).
  const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages, startPage + maxVisible - 1);

  // Build an array of visible page numbers to render as buttons.
  const pages = [];
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    // Horizontal flex container for pagination buttons.
    // "overflow-x-auto" allows horizontal scrolling on small screens.
    <div className="flex items-center justify-center space-x-2 mx-2 overflow-x-auto scrollbar-hide">
      {/* Previous page button */}
      <Button
        variant="outline"
        size="sm"
        disabled={page === 1}
        onClick={() => handlePageChange(page - 1)}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Previous</span>
      </Button>

      {/* Numbered page buttons */}
      {pages.map((p) => (
        <Button
          key={p}
          variant={page === p ? "default" : "outline"} // Highlight the current page
          size="sm"
          onClick={() => handlePageChange(p)}
        >
          {p}
        </Button>
      ))}

      {/* Next page button */}
      <Button
        variant="outline"
        size="sm"
        disabled={page === totalPages}
        onClick={() => handlePageChange(page + 1)}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
};
