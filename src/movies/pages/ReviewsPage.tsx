import { useReviews } from "../hooks/useReviews";
import { Reviews } from "../components/reviews/Reviews";
import { getImageUrl } from "@/utils/tmdb";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Link, useParams, useSearchParams } from "react-router";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Card } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";
import { CustomError } from "@/components/custom/CustomError";
import { MovieReviewsSkeleton } from "../components/reviews/SkeletonReviewPage";

export const MovieReviews = () => {
  // Get the current page from the URL search params (default: 1)
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  // Get the movie/TV show slug and type from the URL
  const { slug, type } = useParams();
  const id = slug ? slug.split("-").pop()! : null;

  // Fetch reviews for this movie/TV show
  const { reviews, isError, data, isLoading } = useReviews(page);

  // Fetch movie or TV show details based on type
  const { data: movie } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  // Show skeleton loader while loading
  if (isLoading) {
    return <MovieReviewsSkeleton />;
  }

  // Handle errors or missing movie data
  if (isError || !movie || !data) {
    return (
      <CustomError
        title={"Error loading reviews"}
        message={"Try later"}
        action={{ to: `/${type}/${id}`, label: "Movie page" }}
      />
    );
  }

  // Handle case when there are no reviews
  if (!reviews || reviews.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto py-12 text-center">
          <NotepadText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            There are no reviews for this movie yet
          </h3>
          <Button>
            {/* Link to add the first review */}
            <Link to={`/${type}/${slugify(movie.title, +id!)}`}>
              Be the first to add a review
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-hero">
      <div className="max-w-[1600px] mx-auto py-auto pb-8 sm:py-8 px-4">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-2">
          {`All Reviews for ${movie?.title}`}
        </h1>
        <p className="text-muted-foreground mb-4">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 mb-8 md:space-x-4">
          {/* Movie Poster */}
          <div className="col-span-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <img
                src={getImageUrl(movie.poster_path, "w780")}
                alt={movie.title}
                className="w-full h-200 aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          {/* Reviews List */}
          <div className="col-span-2">
            {reviews.map((review) => (
              <Reviews
                key={`${review.id}-${review.author}`} // unique key for React list
                image={getImageUrl(review.author_details.avatar_path ?? "")} // Author avatar
                name={review.author} // Author name
                review={review.content} // Review content
                rating={review.author_details.rating} // Review rating
                likes={0} // Default likes count
              />
            ))}
          </div>
        </div>

        {/* Pagination */}
        {data?.total_pages > page && (
          <CustomPagination totalPages={data?.total_pages ?? 1} />
        )}
      </div>
    </div>
  );
};
