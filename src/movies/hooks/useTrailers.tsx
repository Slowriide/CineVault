import type { Type } from "@/interfaces/MovieCategory";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { isValidType } from "@/utils/typeValidator";
import { getTrailersAction } from "../api/get-trailers.action";

export const useTrailers = (
  manualId?: string,
  manualType?: string,
  language: string = "us-US"
) => {
  const { type: typeSlug, slug } = useParams();

  const type: Type | null =
    manualType && isValidType(manualType)
      ? manualType
      : isValidType(typeSlug)
      ? typeSlug
      : null;

  const id = manualId ?? (slug ? slug.split("-").pop()! : null);

  const response = useQuery({
    queryKey: ["trailer", id, type, language],
    queryFn: () => {
      if (!id || !type) throw new Error("Invalid type or id");

      return getTrailersAction({ id, type, language });
    },
    enabled: !!id && !!type,
  });

  const videos = response.data?.results;

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
