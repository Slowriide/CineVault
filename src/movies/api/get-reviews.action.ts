import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { Type } from "@/interfaces/MovieCategory";
import type { ReviewsResponse } from "@/interfaces/MovieReviews";

interface Options {
  id: number;
  type: Type;
  page?: number;
  language?: string;
}

export const getReviewsAction = async ({
  id,
  type,
  page,
  language,
}: Options): Promise<ReviewsResponse> => {
  const { data } = await TMDBAPI.get<ReviewsResponse>(
    `/${type}/${id}/reviews`,
    {
      params: {
        page,
        language,
      },
    }
  );

  return {
    ...data,
  };
};
