import { useReviews } from "../hooks/useReviews";
import { Reviews } from "../components/Reviews";
import { getImageUrl } from "@/mocks/tmdb";
import { Button } from "@/components/ui/button";
import { NotepadText } from "lucide-react";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Link, useParams, useSearchParams } from "react-router";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { CustomPagination } from "@/components/custom/CustomPagination";
import { Card } from "@/components/ui/card";
import { slugify } from "@/utils/slugify";

export const MovieReviews = () => {
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  const { slug, type } = useParams();
  const id = slug ? slug.split("-").pop()! : null;

  const { reviews, isError, data } = useReviews(page);

  const { data: movie } =
    type === "movie" ? useMovieDetails(id!) : useTVShowDetails(id!);

  if (!reviews || isError || reviews.length === 0 || !movie) {
    return (
      <div className="min-h-screen bg-gradient-hero">
        <div className="container mx-auto py-12 text-center ">
          <NotepadText className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            There are no reviews for this movie yet
          </h3>
          <Button>
            <Link to={`/${type}/${slugify(movie!.title, +id!)}`}>
              Be te first to add a review
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-hero">
      <div className="max-w-[1600px] mx-auto py-8">
        <h1 className="text-3xl font-bold mb-2">
          {`All Reviews for ${movie?.title}`}{" "}
        </h1>
        <p className="text-muted-foreground mb-4">
          {reviews.length} review{reviews.length === 1 ? "" : "s"}
        </p>

        {/* Poster */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="md:col-span-1">
            <Card className="overflow-hidden bg-gradient-card border-border/50 shadow-elegant">
              <img
                src={getImageUrl(movie.poster_path, "w780")}
                alt={movie.title}
                className="w-full h-200 aspect-[2/3] object-cover"
              />
            </Card>
          </div>

          <div className=" gap-6 mb-6 col-span-2">
            {reviews.map((review) => (
              <Reviews
                key={`${review.id}-${review.author}`}
                image={getImageUrl(review.author_details.avatar_path ?? "")}
                name={review.author}
                review={review.content}
                rating={review.author_details.rating}
                likes={0}
              />
            ))}
          </div>
        </div>
        <CustomPagination totalPages={data?.total_pages ?? 1} />
      </div>
    </div>
  );
};
