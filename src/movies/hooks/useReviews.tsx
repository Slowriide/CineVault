import { useQuery } from "@tanstack/react-query";
import { getReviewsAction } from "../api/get-reviews.action";
import { useParams } from "react-router";
import type { Type } from "@/interfaces/MovieCategory";
import type { Reviews } from "@/interfaces/MovieReviews";
import { useAuth } from "@/context/AuthContext";
import { useMyReviewForMovie } from "./supabase/reviews/useMyReviews";
import { useSupabaseProfile } from "./supabase/profile/useSupabaseProfile";

/**
 * useReviews
 *
 * Fetches reviews for a specific movie/TV show and merges them with the current user's review.
 * Returns both all reviews and the top 2 popular reviews.
 *
 * @param page - The page number for paginated reviews (default 1)
 * @param language - The language of reviews (default "us-US")
 */
export const useReviews = (page: number = 1, language: string = "us-US") => {
  // Get the `slug` and `type` from the URL params
  const { slug, type: query } = useParams();

  // Extract the numeric ID from the slug (format: name-id)
  const id = slug ? parseInt(slug.split("-").pop()!) : null;

  // Get current user session
  const { session } = useAuth();
  const userId = session?.user.id;

  // Cast query param to Type
  const type = query as Type;

  // Get user's profile data
  const { getProfile } = useSupabaseProfile(userId);
  const profileData = getProfile.data;

  // Get the user's own review (if any) for this movie/TV show
  const { review: myReview } = useMyReviewForMovie(
    userId,
    id?.toString(),
    type
  );

  // Return default empty results if id or type is missing
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

  // Fetch reviews from API using React Query
  const results = useQuery({
    queryKey: ["reviews", id, page, type, language],
    queryFn: () => getReviewsAction({ id, type, page, language }),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    retry: false,
  });

  // Transform the user's own review to match API review format
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

  // Filter out API reviews that are duplicates of the user's review
  const allReviews: Reviews[] =
    results.data?.results.filter(
      (r) => !myReviewTransformed.some((mr) => mr.id === r.id)
    ) ?? [];

  // Merge the user's review with API reviews
  const reviews = [...myReviewTransformed, ...allReviews];

  // Select top 2 reviews as "popular reviews"
  const popularReviews: Reviews[] = reviews.slice(0, 2) ?? [];

  return {
    ...results, // React Query's data, loading, error states
    reviews, // All reviews including user's own
    popularReviews, // Top 2 reviews for display
  };
};
