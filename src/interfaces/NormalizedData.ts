import type { Genre } from "./MovieDetails";

export interface NormalizedData {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: Date;
  runtime: number;
  vote_average: number;
  vote_count: number;
  genres: Genre[];
  homepage: string;
  tagline: string;
}
