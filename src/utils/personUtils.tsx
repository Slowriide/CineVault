import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { slugify } from "./slugify";

export function normalizeCredit(credit: any) {
  return {
    ...credit,
    backdrop_path: credit.backdrop_path ?? "assets/placeholder.svg",
    poster_path: credit.poster_path ?? "assets/placeholder.svg",
    origin_country:
      "origin_country" in credit
        ? Array.isArray(credit.origin_country)
          ? credit.origin_country
          : [credit.origin_country]
        : [],
  };
}

export function getRatedMovie(
  credits: (MovieMovieDB | TvShowMovieDB)[],
  type: "best" | "worst"
) {
  if (credits.length === 0) return undefined;
  const sorted = [...credits].sort((a, b) =>
    type === "best"
      ? b.vote_average - a.vote_average
      : a.vote_average - b.vote_average
  );
  return sorted[0];
}

export function getMovieDetails(
  item: MovieMovieDB | TvShowMovieDB | undefined
) {
  if (!item) return undefined;
  const isMovie = "title" in item;
  return {
    title: isMovie ? item.title : item.name,
    year: isMovie
      ? new Date(item.release_date).getFullYear()
      : new Date(item.first_air_date).getFullYear(),
    link: isMovie
      ? `/movie/${slugify(item.title, item.id)}`
      : `/tv/${slugify(item.name, item.id)}`,
  };
}
