import { useQuery } from "@tanstack/react-query";
import { getReviewsAction } from "../api/get-reviews.action";
import { useParams } from "react-router";
import type { Type } from "@/interfaces/MovieCategory";
import type { Reviews } from "@/interfaces/MovieReviews";
import { useAuth } from "@/context/AuthContext";
import { useMyReviewForMovie } from "./supabase/reviews/useMyReviews";
import { useSupabaseProfile } from "./supabase/profile/useSupabaseProfile";

export const useReviews = (page: number = 1, language: string = "us-US") => {
  const { slug, type: query } = useParams();
  const id = slug ? parseInt(slug.split("-").pop()!) : null;
  const { session } = useAuth();
  const userId = session?.user.id;
  const type = query as Type;
  const { getProfile } = useSupabaseProfile(userId);
  const profileData = getProfile.data;

  const { review: myReview } = useMyReviewForMovie(
    userId,
    id?.toString(),
    type
  );

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

  const results = useQuery({
    queryKey: ["reviews", id, page, type, language],
    queryFn: () => getReviewsAction({ id, type, page, language }),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  //transform user review in api review type
  const myReviewTransformed: Reviews[] = myReview
    ? [
        {
          id: myReview.movie_id ?? "",
          author: profileData?.username ?? "You",
          author_details: {
            avatar_path: profileData?.avatar_url ?? "/placeholder.svg",
            rating: myReview.rating ?? 0,
            name: profileData?.username ?? "You",
            username: profileData?.username ?? "you",
          },
          content: myReview.content ?? "",
          created_at: new Date(),
          updated_at: new Date(),
          url: "",
        },
      ]
    : [];

  //looking for user review in the api reviews
  const allReviews: Reviews[] =
    results.data?.results.filter(
      (r) => !myReviewTransformed.some((mr) => mr.id === r.id)
    ) ?? [];

  //merge all
  const reviews = [...myReviewTransformed, ...allReviews];

  const popularReviews: Reviews[] = reviews.slice(0, 2) ?? [];

  return {
    ...results,
    reviews: reviews,
    popularReviews: popularReviews,
  };
};
