import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

interface CarouselProps {
  title: string;
  header?: React.ReactNode;
  items: (MovieMovieDB | TvShowMovieDB)[];
  mediaType: "movie" | "tv";
  loading?: boolean;
}

export const Carousel = ({
  title,
  items,
  header,
  mediaType,
  loading,
}: CarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 320; // Width of card plus gap
      const newScrollPosition =
        direction === "left"
          ? scrollRef.current.scrollLeft - scrollAmount
          : scrollRef.current.scrollLeft + scrollAmount;

      scrollRef.current.scrollTo({
        left: newScrollPosition,
        behavior: "smooth",
      });
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-7 w-32 bg-muted animate-pulse rounded" />
        </div>
        <div className="flex space-x-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="w-40 flex-shrink-0">
              <div className="aspect-[2/3] bg-muted animate-pulse rounded-lg mb-3" />
              <div className="h-4 bg-muted animate-pulse rounded mb-2" />
              <div className="h-3 w-16 bg-muted animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!items?.length) {
    return null;
  }

  return (
    <div className="space-y-4 group/carousel">
      <div className="flex items-center justify-between">
        {header ? (
          header
        ) : (
          <h2 className="text-xl font-semibold text-foreground">{title}</h2>
        )}
        <div className="flex space-x-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("left")}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => scroll("right")}
            className="h-8 w-8 p-0 hover:bg-primary/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item) => (
          <div key={`${item.id}-${title}`} className="flex-shrink-0">
            <MovieCard item={item} mediaType={mediaType} size="md" />
          </div>
        ))}
      </div>
    </div>
  );
};
