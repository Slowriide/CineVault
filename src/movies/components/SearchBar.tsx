import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/utils/tmdb";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onFocus?: () => void; // Optional callback when input is focused
  onBlur?: () => void; // Optional callback when input loses focus
}

/**
 * SearchBar Component
 *
 * A search input component for movies, TV shows, and actors.
 * - Provides autocomplete suggestions with debounced API search.
 * - Handles navigation to search results page on submit.
 * - Closes suggestion dropdown when clicking outside or clearing input.
 */
export const SearchBar = ({ onBlur, onFocus }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState(""); // User's input
  const [open, setOpen] = useState(false); // Dropdown open state

  const inputRef = useRef<HTMLInputElement>(null); // Input DOM ref
  const containerRef = useRef<HTMLDivElement>(null); // Container ref for click outside detection

  const navigate = useNavigate();

  // Debounce user input to prevent excessive API calls
  const debouncedTerm = useDebounce(searchTerm, 500);
  const { normalizedData, isLoading } = useMultipleSearchs(debouncedTerm);

  // Take only top 5 suggestions for display
  const suggestions = normalizedData.slice(0, 5);

  // Open dropdown when user types
  useEffect(() => {
    setOpen(!!searchTerm);
  }, [searchTerm]);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Navigate to search results on form submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent page reload
    const query = inputRef.current?.value.trim();
    if (!query) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  // Clear input and focus
  const clearInput = () => {
    setSearchTerm("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full items-center max-w-xl mx-auto mr-2"
    >
      <form onSubmit={handleSubmit}>
        {/* Search Icon */}
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        {/* Input field */}
        <Input
          ref={inputRef}
          placeholder="Search movies, TV shows, actors..."
          className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            debouncedTerm && setOpen(true);
            onFocus?.();
          }}
          onBlur={() => {
            setTimeout(() => onBlur?.(), 150); // Delay to allow click on suggestion
          }}
        />

        {/* Autocomplete dropdown */}
        {open && debouncedTerm.length > 0 && (
          <div className="absolute mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50">
            {/* No results */}
            {suggestions.length === 0 && !isLoading ? (
              <div className="flex justify-center items-center text-sm text-muted-foreground h-20">
                No results
              </div>
            ) : (
              // Render suggestions
              suggestions.map((item) => {
                if (item.media_type === "person") {
                  return (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={`/${item.media_type}/${item.id}`}
                      onClick={clearInput}
                      className="flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                    >
                      {/* Person avatar */}
                      <Card className="w-10 h-14 overflow-hidden border-none shadow-none rounded">
                        <img
                          src={getImageUrl(item.profile_path, "w82")}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </Card>
                      <div className="flex flex-col">
                        <span className="font-medium text-sm">{item.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {item.media_type}
                        </span>
                      </div>
                    </Link>
                  );
                }

                // Movies or TV Shows
                const title = "title" in item ? item.title : item.name;

                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={`/${item.media_type}/${item.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                    onClick={clearInput}
                  >
                    {/* Poster */}
                    <Card className="w-10 h-14 overflow-hidden border-none shadow-none rounded">
                      <img
                        src={getImageUrl(item.poster_path, "w92")}
                        alt={title}
                        className="w-full h-full object-cover"
                      />
                    </Card>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{title}</span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {item.media_type}
                      </span>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        )}
      </form>
    </div>
  );
};
