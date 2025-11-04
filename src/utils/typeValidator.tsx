import type { Type } from "@/interfaces/MovieCategory";

/**
 * Type guard to check if a string is a valid media type.
 *
 * @param value - the string to validate
 * @returns true if the value is "movie" or "tv", false otherwise
 */
export function isValidType(value: string | undefined): value is Type {
  // Check if the value strictly matches "movie" or "tv"
  return value === "movie" || value === "tv";
}
