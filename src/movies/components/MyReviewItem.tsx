import type { supabaseReview } from "@/interfaces/MovieReviews";
import { Reviews } from "./Reviews";
import { useMovieDetails } from "../hooks/useMovieDetails";
import { Card } from "@/components/ui/card";
import { getBackdropUrl } from "@/mocks/tmdb";
import { Link } from "react-router";
import { slugify } from "@/utils/slugify";
import { useTVShowDetails } from "../hooks/useTVShowDetails";
import { Separator } from "@/components/ui/separator";
import { Trash } from "lucide-react";
import { useReviewsActions } from "../hooks/reviews/useReviewsActions";
import * as React from "react";
import { useAuth } from "@/context/AuthContext";
import { CustomError } from "@/components/custom/CustomError";

export const MyReviewItem = ({ review }: { review: supabaseReview }) => {
  const { session } = useAuth();
  const userId = session?.user.id;
  const movieId = review.movie_id ?? "";

  const movieHook =
    review.media_type === "movie"
      ? useMovieDetails(movieId)
      : useTVShowDetails(movieId);

  const { data: movie, isError } = movieHook;

  const { deleteReview } = useReviewsActions(userId);

  if (!movie || !review || isError) {
    return <CustomError title={"Error"} message={"Error fetching reviews"} />;
  }

  const linkTo =
    review.media_type === "movie"
      ? `/movie/${slugify(movie!.title, movie!.id)}`
      : `/tv/${slugify(movie!.title, movie!.id)}`;

  const handleDeleteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    await deleteReview.mutateAsync(movie.id.toString());
  };

  return (
    <div>
      <div className="flex items-center justify-items-center gap-4">
        <Link to={linkTo}>
          <Card className="group relative grid-cols-1 overflow-hidden bg-gradient-card border-border/50 hover:border-primary/30 transition-all duration-300 shadow-none hover:shadow-glow hover:-translate-y-1 mt-1 w-26">
            <div className="aspect-[2/3] relative overflow-hidden rounded-t-lg ">
              <img
                src={getBackdropUrl(movie?.poster_path ?? "")}
                alt={movie?.title}
                className="w-full h-full object-cover"
              />
            </div>
          </Card>
        </Link>

        <div className="flex-1">
          <Reviews
            image={
              "https://cdn3.futbin.com/content/fifa26/img/players/240091.png?fm=png&ixlib=java-2.1.0&w=162&s=9689f5269788fb4d0581832858aa1aa7"
            }
            name={"Vicario"}
            review={review.content ?? ""}
            rating={review.rating ?? 0}
            likes={7}
            line={false}
          />
        </div>

        <Trash
          className="text-primary cursor-pointer hover:text-chart-5"
          onClick={handleDeleteClick}
        />
      </div>
      <Separator className="mt-6" />
    </div>
  );
};
