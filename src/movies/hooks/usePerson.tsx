import { useQuery } from "@tanstack/react-query";
import { getPerson } from "../api/get.person.action";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { getRatedMovie, normalizeCredit } from "@/utils/personUtils";

/**
 * usePerson
 *
 * Fetches and processes detailed information about a person (actor, director, etc.).
 * Normalizes movie/TV credits, calculates top/worst rated, and allows filtering by popularity or score.
 *
 * @param personId - The TMDB person ID.
 * @param append_to_response - Extra data to append from TMDB API (default "movie_credits").
 * @param visibleCount - Number of items to show when filtering.
 * @param orderBy - Strategy to filter credits: "all", "score", or "popular".
 * @param language - Language for API response (default "us-US").
 */
export const usePerson = (
  personId: string,
  append_to_response: string = "movie_credits",
  visibleCount: number = 21,
  orderBy: "all" | "score" | "popular" = "all",
  language: string = "us-US"
) => {
  // Fetch person data from API using React Query
  const query = useQuery({
    queryKey: ["person", personId, append_to_response, language],
    queryFn: () => getPerson({ personId, append_to_response, language }),
    staleTime: 1000 * 60 * 5, // cache for 5 minutes
    enabled: !!personId,
  });

  const personData = query.data;

  // If no data, return defaults to prevent UI errors
  if (!personData)
    return {
      ...query,
      allCredits: [],
      knownFor: [],
      votedByScore: [],
      byPopularity: [],
      filteredCredits: [],
      totalMovies: undefined,
      topRatedMovie: undefined,
      worstRatedMovie: undefined,
      birthYear: undefined,
      deathYear: undefined,
    };

  // Extract birth and death year
  const birthYear = personData.birthday
    ? new Date(personData.birthday).getFullYear()
    : undefined;

  const deathYear = personData.deathday
    ? new Date(personData.deathday).getFullYear()
    : undefined;

  // Normalize movie and TV credits
  const movieCredits: MovieMovieDB[] = (
    personData.movie_credits?.cast || []
  ).map(normalizeCredit);
  const tvCredits: TvShowMovieDB[] = (personData.tv_credits?.cast || []).map(
    normalizeCredit
  );

  // Merge all credits
  const allCredits: (MovieMovieDB | TvShowMovieDB)[] = [
    ...movieCredits,
    ...tvCredits,
  ];

  // Remove duplicates
  const uniqueMovies = Array.from(
    new Map(allCredits.map((movie) => [movie.id, movie])).values()
  );

  // Only consider movies with more than 5 votes
  const votedMovies = uniqueMovies.filter((movie) => movie.vote_count > 5);

  // Movies ordered by popularity
  const byPopularity = uniqueMovies.sort((a, b) => b.popularity - a.popularity);

  // Prepare filtered sets for UI
  const allForFilter = allCredits.slice(0, visibleCount); // top N
  const votedByScore = votedMovies
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, visibleCount);
  const byPopularityForFilter = uniqueMovies
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, visibleCount);

  // Credit filtering strategy
  const filterCredits = (order: "all" | "score" | "popular") => {
    const strategies: Record<
      "all" | "score" | "popular",
      () => {
        filteredCredits: (MovieMovieDB | TvShowMovieDB)[];
        totalMovies: number;
      }
    > = {
      all: () => ({
        filteredCredits: allForFilter,
        totalMovies: allCredits.length,
      }),
      score: () => ({
        filteredCredits: votedByScore,
        totalMovies: votedMovies.length,
      }),
      popular: () => ({
        filteredCredits: byPopularityForFilter,
        totalMovies: votedMovies.length,
      }),
    };
    return strategies[order]();
  };

  const { filteredCredits, totalMovies } = filterCredits(orderBy);

  // Known-for (top 5 by score)
  const knownFor = votedByScore.slice(0, 5);

  // Best and worst rated movie
  const topRatedMovie = getRatedMovie(votedMovies, "best");
  const worstRatedMovie = getRatedMovie(votedMovies, "worst");

  return {
    ...query,
    allCredits,
    votedByScore,
    knownFor,
    topRatedMovie,
    worstRatedMovie,
    birthYear,
    deathYear,
    byPopularity,
    filteredCredits,
    totalMovies,
  };
};
