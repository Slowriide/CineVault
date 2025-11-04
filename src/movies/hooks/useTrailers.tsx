import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isValidType } from "@/utils/typeValidator";
import { getTrailersAction } from "../api/get-trailers.action";

/**
 * useTrailers
 *
 * Fetches YouTube trailers for a movie or TV show.
 *
 * @param manualId - Optional ID to override route params
 * @param manualType - Optional type ("movie" or "tv") to override route params
 * @param language - Language code for API results (default: "us-US")
 * @returns An object containing filtered trailers
 */
export const useTrailers = (
  manualId?: string,
  manualType?: string,
  language: string = "us-US"
) => {
  // Extract params from the route
  const { type: typeSlug, slug } = useParams();

  // Determine type: manualType > route param > null if invalid
  const type: Type | null =
    manualType && isValidType(manualType)
      ? manualType
      : isValidType(typeSlug)
      ? typeSlug
      : null;

  // Determine ID: manualId > slug from route (last part after dash)
  const id = manualId ?? (slug ? slug.split("-").pop()! : null);

  // Fetch trailers with React Query
  const response = useQuery({
    queryKey: ["trailer", id, type, language], // Unique cache key
    queryFn: () => {
      if (!id || !type) throw new Error("Invalid type or id");
      return getTrailersAction({ id, type, language });
    },
    enabled: !!id && !!type, // Only run query if we have both
  });

  const videos = response.data?.results;

  // Filter and sort trailers
  const trailers =
    videos
      ?.filter(
        (video) =>
          video.type === "Trailer" &&
          video.site === "YouTube" &&
          video.name.toLowerCase().includes("trailer")
      )
      .sort((a, b) => a.name.localeCompare(b.name)) ?? [];

  return { trailers };
};
