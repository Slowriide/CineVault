import type { MovieMovieDB, TvShowMovieDB } from "./MovieDB.response";

export interface MultiSearchResponse {
  page: number;
  results: MultiSearchResult[];
  total_pages: number;
  total_results: number;
}

export interface MultiSearchResult {
  adult: boolean;
  backdrop_path?: null | string;
  id: number;
  name?: string;
  original_name?: string;
  overview?: string;
  poster_path?: null | string;
  media_type: MediaType;
  original_language?: string;
  genre_ids?: number[];
  popularity: number;
  first_air_date?: Date;
  vote_average?: number;
  vote_count?: number;
  origin_country?: string[];
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;
  gender?: number;
  known_for_department?: string;
  profile_path?: null;
  known_for?: KnownFor[];
}

export interface KnownFor {
  adult: boolean;
  backdrop_path: null | string;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: null | string;
  media_type: MediaType;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: Date;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface MultiPersonSearch {
  adult: boolean;
  id: number;
  name: string;
  original_name: string;
  popularity: number;
  gender: number;
  known_for_department: string;
  profile_path: string;
  media_type: "person";
}

export type MediaType = "movie" | "person" | "tv";

export type NormalizedSearchResult =
  | MovieMovieDB
  | TvShowMovieDB
  | MultiPersonSearch;
