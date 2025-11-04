import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

import { CustomError } from "@/components/custom/CustomError";
import { Carousel } from "../Carousel";
import React from "react";

type SectionProps = {
  title: string;
  items: (MovieMovieDB | TvShowMovieDB)[];
  loading?: boolean;
  error?: unknown;
  mediaType: "movie" | "tv";
  header?: React.ReactNode;
};

/**
 * SectionCarrusel displays a horizontal carousel of movies or TV shows.
 * Handles loading and error states and supports an optional header element.
 * Wrapped in React.memo for performance optimization.
 */
export const SectionCarrusel = React.memo(
  ({ title, items, loading, error, mediaType, header }: SectionProps) => {
    // Show error placeholder if something went wrong
    if (error)
      return (
        <CustomError
          title="Error loading carrousel"
          message="Please try again"
          height="h-40"
        />
      );

    // Render carousel with provided items
    return (
      <Carousel
        title={title}
        items={items ?? []} // fallback to empty array
        mediaType={mediaType}
        loading={loading}
        header={header}
      />
    );
  }
);

// Set displayName for React DevTools
SectionCarrusel.displayName = "SectionCarrusel";
