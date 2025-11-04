import React, { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { MovieCard } from "./MovieCard";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { SkeletonCarrusel } from "./skeletons/SkeletonCarrusel";

interface CarouselProps {
  title: string; // Title of the carousel section
  header?: React.ReactNode; // Optional custom header
  items: (MovieMovieDB | TvShowMovieDB)[]; // Items to display
  mediaType: "movie" | "tv"; // Type of media
  loading?: boolean; // Loading state
}

/**
 * Component Purpose:
 * Displays a horizontal scrollable carousel of movies or TV shows.
 * Includes optional header, left/right scroll buttons for desktop,
 * and lazy loading via MovieCard component.
 */
export const Carousel = React.memo(
  ({ title, items, header, mediaType, loading }: CarouselProps) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    /**
     * Scroll the carousel horizontally
     * @param direction - "left" or "right"
     */
    const scroll = useCallback((direction: "left" | "right") => {
      if (scrollRef.current) {
        const scrollAmount = 320; // Approximate card width + gap
        const newScrollPosition =
          direction === "left"
            ? scrollRef.current.scrollLeft - scrollAmount
            : scrollRef.current.scrollLeft + scrollAmount;

        scrollRef.current.scrollTo({
          left: newScrollPosition,
          behavior: "smooth", // Smooth animation
        });
      }
    }, []);

    // Loading skeleton while items are fetched
    if (loading) {
      return <SkeletonCarrusel elements={9} />;
    }

    // If no items, render nothing
    if (!items?.length) {
      return null;
    }

    return (
      <div className="space-y-4 group/carousel">
        {/* Header section with optional custom header */}
        <div className="flex items-center justify-between">
          {header || (
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          )}

          {/* Scroll buttons only visible on hover for larger screens */}
          <div className="hidden sm:flex space-x-2 opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="h-8 w-8 p-0 hover:bg-primary/10"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Carousel content */}
        <div
          ref={scrollRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-4 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // hide scrollbar in Firefox & IE
        >
          {items.map((item, index) => (
            <div key={`${item.id}-${title}`} className="flex-shrink-0">
              <MovieCard
                item={item}
                mediaType={mediaType}
                size="md"
                loading={index < 6 ? "eager" : "lazy"} // load first few cards eagerly
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
);

Carousel.displayName = "Carousel";
