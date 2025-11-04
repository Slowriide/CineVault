import { Link } from "react-router";
import { Star } from "lucide-react";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";

interface MovieStatProps {
  label: string;
  movie?: MovieMovieDB | TvShowMovieDB;
  details?: { link: string; title: string; year: string | number };
  emptyMessage: string;
}

/**
 * Displays a labeled movie statistic, such as rating and basic movie info.
 * Shows a link to the movie when available, or an empty message otherwise.
 */
export const MovieStat = ({
  label,
  movie,
  details,
  emptyMessage,
}: MovieStatProps) => {
  const rating = movie?.vote_average.toFixed(1);

  return (
    <div className="flex flex-wrap items-center space-x-2 mb-6">
      {/* Label for the statistic (e.g., "Top Rated") */}
      <span className="font-bold text-lg">{label}</span>

      {/* If movie data is available, show rating and movie details */}
      {movie && details ? (
        <div className="flex items-center space-x-1 text-primary">
          <Star className="w-5 h-5 fill-current" />
          <span>{rating}</span>
          <Link to={details.link}>
            <span className="text-blue-400">
              {details.title} ({details.year})
            </span>
          </Link>
        </div>
      ) : (
        // Show a fallback message if no data is available
        <p className="text-red-500">{emptyMessage}</p>
      )}
    </div>
  );
};
