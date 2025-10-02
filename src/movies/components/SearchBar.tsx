import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useMultipleSearchs } from "../hooks/useMultipleSearchs";
import { Card } from "@/components/ui/card";
import { getImageUrl } from "@/mocks/tmdb";
import { useDebounce } from "../hooks/useDebounce";

interface SearchBarProps {
  onFocus?: () => void;
  onBlur?: () => void;
}

export const SearchBar = ({ onBlur, onFocus }: SearchBarProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [open, setOpen] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const navigate = useNavigate();

  const debouncedTerm = useDebounce(searchTerm, 500);
  const { normalizedData, isLoading } = useMultipleSearchs(debouncedTerm);
  const suggestions = normalizedData.slice(0, 5);

  useEffect(() => {
    setOpen(!!searchTerm);
  }, [searchTerm]);

  // Click afuera para cerrar
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // evita que el form recargue la página

    const query = inputRef.current?.value.trim();
    if (!query) return;

    navigate(`/search?query=${encodeURIComponent(query)}`);
    setOpen(false);
  };

  const clearInput = () => {
    setSearchTerm("");
    setOpen(false);
    inputRef.current?.focus();
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full items-center max-w-xl mx-auto mr-2 "
    >
      <form onSubmit={handleSubmit}>
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground " />
        <Input
          ref={inputRef}
          placeholder="Search movies, TV shows, actors..."
          className="pl-10 bg-muted/50 border-border/50 focus:border-primary/50 "
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => {
            debouncedTerm && setOpen(true);
            onFocus?.();
          }}
          onBlur={() => {
            setTimeout(() => onBlur?.(), 150);
          }}
        />

        {open && debouncedTerm.length > 0 && (
          <div className="absolute mt-2 w-full bg-background border border-border rounded-lg shadow-lg z-50">
            {suggestions.length === 0 && !isLoading ? (
              <div className="flex justify-center items-center text-sm text-muted-foreground h-20">
                No results
              </div>
            ) : (
              suggestions.map((item) => {
                if (item.media_type === "person") {
                  return (
                    <Link
                      key={`${item.media_type}-${item.id}`}
                      to={`/${item.media_type}/${item.id}`}
                      onClick={clearInput}
                      className="flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                    >
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

                const title = "title" in item ? item.title : item.name;

                return (
                  <Link
                    key={`${item.media_type}-${item.id}`}
                    to={`/${item.media_type}/${item.id}`}
                    className="flex items-center gap-3 p-2 hover:bg-muted transition-colors"
                    onClick={clearInput}
                  >
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
