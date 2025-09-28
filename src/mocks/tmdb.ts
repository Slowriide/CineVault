import axios from "axios";

const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_API_KEY = "4e44d9029b1270a757cddc766a1bcb63"; // Demo key - users should get their own
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p";

export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const getImageUrl = (path: string, size: string = "w500") => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export const getBackdropUrl = (path: string, size: string = "w1280") => {
  if (!path) return "/placeholder.svg";
  if (path.startsWith("http")) return path;
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
};

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_title: string;
  video: boolean;
}

export interface MovieDetails extends Movie {
  genres: Array<{ id: number; name: string }>;
  runtime: number;
  budget: number;
  revenue: number;
  status: string;
  tagline: string;
  homepage: string;
  production_companies: Array<{
    id: number;
    name: string;
    logo_path: string;
    origin_country: string;
  }>;
}

export interface TVShow {
  id: number;
  name: string;
  poster_path: string;
  backdrop_path: string;
  overview: string;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  adult: boolean;
  original_language: string;
  original_name: string;
}

export interface Cast {
  id: number;
  name: string;
  character: string;
  profile_path: string;
  cast_id: number;
  credit_id: string;
  order: number;
  adult: boolean;
  gender: number;
  known_for_department: string;
  original_name: string;
  popularity: number;
}

export interface Person {
  id: number;
  name: string;
  profile_path: string;
  adult: boolean;
  also_known_as: string[];
  biography: string;
  birthday: string;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  place_of_birth: string;
  popularity: number;
}

export const tmdbService = {
  // Movies
  getMovieDetails: (type: string, id: number) =>
    tmdbApi.get(`/${type}/${id}`, {
      params: { append_to_response: "credits,similar,videos" },
    }),

  // TV Shows
  getPopularTV: () => tmdbApi.get("/tv/popular"),
  getTrendingTV: () => tmdbApi.get("/trending/tv/week"),
  getTopRatedTV: () => tmdbApi.get("/tv/top_rated"),
  getOnTheAirTV: () => tmdbApi.get("/tv/on_the_air"),

  // Search
  searchMulti: (query: string) =>
    tmdbApi.get("/search/multi", { params: { query } }),
  searchMovies: (query: string) =>
    tmdbApi.get("/search/movie", { params: { query } }),
  searchTV: (query: string) => tmdbApi.get("/search/tv", { params: { query } }),
  searchPeople: (query: string) =>
    tmdbApi.get("/search/person", { params: { query } }),

  // People
  getPersonDetails: (id: number) =>
    tmdbApi.get(`/person/${id}`, {
      params: { append_to_response: "movie_credits,tv_credits" },
    }),

  // Genres
  getMovieGenres: () => tmdbApi.get("/genre/movie/list"),
  getTVGenres: () => tmdbApi.get("/genre/tv/list"),

  // Discover
  discoverMovies: (params: Record<string, any> = {}) =>
    tmdbApi.get("/discover/movie", { params }),
  discoverTV: (params: Record<string, any> = {}) =>
    tmdbApi.get("/discover/tv", { params }),
};
