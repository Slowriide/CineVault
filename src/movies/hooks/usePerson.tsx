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
      votedMovies: [],
      topRatedMovie: null,
      worstRatedMovie: null,
    };

  const movieCredits: MovieMovieDB[] = (
    personData.movie_credits?.cast || []
  ).map(normalizeCredit);

  const tvCredits: TvShowMovieDB[] = (personData.tv_credits?.cast || []).map(
    normalizeCredit
  );

  const allCredits: (MovieMovieDB | TvShowMovieDB)[] = [
    ...movieCredits,
    ...tvCredits,
  ];

  const votedMovies = allCredits.filter((movie) => movie.vote_count > 5);

  const votedByScore = votedMovies
    .sort((a, b) => b.vote_average - a.vote_average)
    .slice(0, visibleCount);

  const knownFor = votedByScore.slice(0, 5);
  const topRatedMovie = getRatedMovie(votedMovies, "best");
  const worstRatedMovie = getRatedMovie(votedMovies, "worst");

  return {
    ...query,
    allCredits,
    votedMovies,
    knownFor,
    topRatedMovie,
    worstRatedMovie,
  };
};
