import { useQuery } from "@tanstack/react-query";
import { getReviewsAction } from "../api/get-reviews.action";
import { useParams } from "react-router";
import type { Type } from "@/interfaces/MovieCategory";
import type { Reviews } from "@/interfaces/MovieReviews";

export const useReviews = (page: number = 1, language: string = "us-US") => {
  const { slug, type: query } = useParams();
  const id = slug ? parseInt(slug.split("-").pop()!) : null;

  if (!query || !id) {
    return {
      reviews: [] as Reviews[],
      data: undefined,
      error: null,
      isError: false,
      isLoading: false,
      popularReviews: [],
    };
  }
  const type = query as Type;

  const results = useQuery({
    queryKey: ["reviews", id, page, type, language],
    queryFn: () => getReviewsAction({ id, type, page, language }),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  const popularReviews: Reviews[] = results.data?.results.slice(0, 2) ?? [];

  return {
    ...results,
    reviews: results.data?.results,
    popularReviews: popularReviews,
  };
};
