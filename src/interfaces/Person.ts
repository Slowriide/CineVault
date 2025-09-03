export interface Person {
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: Date;
  deathday: null;
  gender: number;
  homepage: null;
  id: number;
  imdb_id: string;
  known_for_department: string;
  name: string;
  place_of_birth: string;
  popularity: number;
  profile_path: string;
  movie_credits: MovieCredits;
  tv_credits: TvCredits;
}

export interface MovieCredits {
  cast: MovieCreditsCast[];
  crew: MovieCreditsCast[];
}

export interface MovieCreditsCast {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  order?: number;
  department?: string;
  job?: string;
}

export interface TvCredits {
  cast: TvCreditsCast[];
  crew: TvCreditsCast[];
}

export interface TvCreditsCast {
  adult: boolean;
  backdrop_path: null | string;
  genre_ids: number[];
  id: number;
  origin_country: string;
  original_language: string;
  original_name: string;
  overview: string;
  popularity: number;
  poster_path: null | string;
  first_air_date: Date;
  name: string;
  vote_average: number;
  vote_count: number;
  character?: string;
  credit_id: string;
  episode_count: number;
  first_credit_air_date: Date;
  department?: string;
  job?: string;
}
