import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useSearchParams } from "react-router";
import { useGenres } from "../hooks/useGenres";
import { CustomLoading } from "@/components/custom/CustomLoading";
import { FILTERTYPES, LANGUAGES, SORT_OPTIONS } from "@/utils/Filters";
import { useSearchPerson } from "../hooks/useSearchPerson";
import { type PersonSearch } from "@/interfaces/Searchs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { Popover } from "@/components/ui/popover";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import { ChevronDown } from "lucide-react";
import { slugify } from "@/utils/slugify";
import { getImageUrl } from "@/mocks/tmdb";
import { deslugify } from "../../utils/deslugify";

export const SearchFilters = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [open, setOpen] = useState(false);
  const [year, setYear] = useState(searchParams.get("year") ?? "");

  const { data: genres, isLoading } = useGenres("movie");
  const castParam = searchParams.get("cast") ?? "";

  const {
    query: searchPersonQuery,
    setQuery,
    results: searchPersonResults,
    isLoading: loadingSearchPersons,
  } = useSearchPerson();

  const handleParamChange = (key: string, value: string) => {
    if (value) searchParams.set(key, value);
    else searchParams.delete(key);
    setSearchParams(searchParams);
  };

  const handleCastSearch = (actor: PersonSearch) => {
    const actorSlug = slugify(actor.name, actor.id);
    searchParams.set("cast", actorSlug);
    setSearchParams(searchParams);
    setQuery(actor.name);
    setOpen(false);
  };

  const handleClearAllFilters = () => {
    ["language", "sort", "genre", "type", "year", "cast", "title"].forEach(
      (key) => searchParams.delete(key)
    );
    setSearchParams(searchParams);
  };

  if (isLoading) {
    return <CustomLoading />;
  }

  return (
    <div className=" top-0 bg-gradient-hero/95 pt-4">
      <div className="container mx-auto px-4 py-4">
        <div className="flex flex-wrap gap-4 items-end justify-center">
          {/* Genre Filter */}
          <div className="space-y-2">
            <Label htmlFor="genre">Genre</Label>
            <Select
              onValueChange={(value) => handleParamChange("genre", value)}
              value={searchParams.get("genre") ?? "all-genres"}
            >
              <SelectTrigger id="genre" className="w-[140px]">
                <SelectValue placeholder="All genres" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-genres">All genres</SelectItem>
                {genres?.map((genre) => (
                  <SelectItem
                    key={genre.id}
                    value={`${genre.name.toString()}-${genre.id}`}
                  >
                    {genre.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year Filter */}
          <div className="space-y-2">
            <Label htmlFor="year">Release Year</Label>
            <Input
              id="year"
              type="number"
              placeholder="Any"
              className="w-[100px]"
              value={year}
              min={1900}
              max={new Date().getFullYear()}
              onChange={(e) => setYear(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleParamChange("year", year)
              }
            />
          </div>

          {/* Language Filter */}
          <div className="space-y-2">
            <Label htmlFor="language">Language</Label>
            <Select
              onValueChange={(value) => handleParamChange("language", value)}
              value={searchParams.get("language") ?? "all"}
            >
              <SelectTrigger id="language" className="w-[120px]">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Default</SelectItem>
                {LANGUAGES.map((lang) => (
                  <SelectItem key={lang.value} value={lang.value}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Sort Filter */}
          <div className="space-y-2">
            <Label htmlFor="sort">Sort by</Label>
            <Select
              onValueChange={(value) => handleParamChange("sort", value)}
              value={searchParams.get("sort") ?? ""}
            >
              <SelectTrigger id="sort" className="w-[150px]">
                <SelectValue placeholder="Select sort" />
              </SelectTrigger>
              <SelectContent>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Type Filter */}
          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              onValueChange={(value) => handleParamChange("type", value)}
              value={searchParams.get("type") ?? ""}
            >
              <SelectTrigger id="type" className="w-[150px]">
                <SelectValue placeholder="Movie" />
              </SelectTrigger>
              <SelectContent>
                {FILTERTYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Actor Filter */}
          <div className="space-y-2 z-20">
            <Label htmlFor="cast">Cast</Label>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger id="cast" asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className="w-[200px] text-sm font-normal text-muted-foreground justify-between bg-transparent border-input hover:bg-transparent hover:text-muted-foreground hover:border-primary"
                  defaultValue={searchParams.get("cast") ?? ""}
                >
                  {castParam ? deslugify(castParam) : "Select actor"}

                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-[200px] z-[1000] p-0"
                side="bottom"
                align="start"
                sideOffset={8}
                collisionPadding={10}
                avoidCollisions={false}
              >
                <Command>
                  <CommandInput
                    placeholder="search actor"
                    value={searchPersonQuery}
                    onValueChange={setQuery}
                  />

                  <CommandEmpty className="flex justify-center text-center my-6 text-sm">
                    {loadingSearchPersons
                      ? "Searching persons"
                      : "No actor found."}
                  </CommandEmpty>
                  <CommandGroup>
                    {searchPersonResults.map((actor) => (
                      <CommandItem
                        key={actor.id}
                        value={actor.name}
                        onSelect={() => {
                          handleCastSearch(actor);
                          setOpen(false);
                        }}
                        className="flex items-center gap-2"
                      >
                        <img
                          src={getImageUrl(actor.profile_path ?? "", "w342")}
                          alt={actor.name}
                          className="w-10 h-16 object-cover rounded-xs mr-2"
                          loading="lazy"
                        />

                        <span>{actor.name}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Clear Filters */}
          <Button
            variant="outline"
            onClick={handleClearAllFilters}
            className="ml-auto"
          >
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
};
