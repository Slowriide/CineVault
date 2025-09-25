import type { Type } from "@/interfaces/MovieCategory";

export function isValidType(value: string | undefined): value is Type {
  return value === "movie" || value === "tv";
}
