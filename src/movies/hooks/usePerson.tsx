import { useQuery } from "@tanstack/react-query";
import { getPerson } from "../api/get.person.action";
import type {
  MovieMovieDB,
  TvShowMovieDB,
} from "@/interfaces/MovieDB.response";
import { getRatedMovie, normalizeCredit } from "@/utils/personUtils";

export const usePerson = (
  personId: string,
  append_to_response: string = "movie_credits",
  visibleCount: number = 21,
  orderBy: "all" | "score" | "popular" = "all",
  language: string = "us-US"
) => {
  const query = useQuery({
    queryKey: ["person", personId, append_to_response, language],
    queryFn: () => getPerson({ personId, append_to_response, language }),
    staleTime: 1000 * 60 * 5,
  });

  const personData = query.data;

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

  //Person Data
  const birthYear = personData.birthday
    ? new Date(personData.birthday).getFullYear()
    : undefined;

  const deathYear = personData.deathday
    ? new Date(personData.deathday).getFullYear()
    : undefined;

  //Normalize credits
  const movieCredits: MovieMovieDB[] = (
    personData.movie_credits?.cast || []
  ).map(normalizeCredit);

  const tvCredits: TvShowMovieDB[] = (personData.tv_credits?.cast || []).map(
    normalizeCredit
  );

  //Movies Data
  const allCredits: (MovieMovieDB | TvShowMovieDB)[] = [
    ...movieCredits,
    ...tvCredits,
  ];

  //delete duplicated movies
  const uniqueMovies = Array.from(
    new Map(allCredits.map((movie) => [movie.id, movie])).values()
  );

  //only movies with +5 votes
  const votedMovies = uniqueMovies.filter((movie) => movie.vote_count > 5);

  //movies ordered by popularity
  const byPopularity = uniqueMovies.sort((a, b) => b.popularity - a.popularity);

  //Credits Filter

  //movies without order and sliced
  const allForFilter = allCredits.slice(0, visibleCount);

  //movies ordered by score and sliced
  const votedByScore = votedMovies
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, visibleCount);

  //movies ordered by popularity and sliced
  const byPopularityForFilter = uniqueMovies
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, visibleCount);

  // Filter credits strategy
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

  //
  const knownFor = votedByScore.slice(0, 5);
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
